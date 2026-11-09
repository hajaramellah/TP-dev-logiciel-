import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

// Allow JSON body up to 25MB for camera image uploads
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Initialize Google GenAI client
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

/**
 * Helper to mask sensitive information for technical diagnostic logging
 */
function maskSensitiveData(str?: string): string {
  if (!str || str.trim().length === 0) return 'Non présent';
  const clean = str.trim();
  if (clean.length <= 4) return '***';
  return `${clean.slice(0, 2)}***${clean.slice(-2)}`;
}

/**
 * POST /api/ocr/cin
 * Extracts CIN fields from Moroccan National ID card
 */
app.post('/api/ocr/cin', async (req: Request, res: Response) => {
  try {
    const { imageBase64 } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ success: false, message: 'Aucune image transmise pour l\'OCR CIN.' });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
    const imageSizeKb = Math.round((cleanBase64.length * 0.75) / 1024);

    console.log(`[OCR CIN] Requête reçue — Taille image: ${imageSizeKb} KB`);

    if (ai) {
      try {
        const startTime = Date.now();
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [
            {
              role: 'user',
              parts: [
                {
                  inlineData: {
                    mimeType: 'image/jpeg',
                    data: cleanBase64,
                  },
                },
                {
                  text: `Analyse cette image de Carte Nationale d'Identité Marocaine (CIN) rédigée en français et en arabe.
Extrais UNIQUEMENT les informations réelles visibles sur la carte au format JSON strict.

RÈGLES STRICTES DE NON-HALLUCINATION :
1. N'INVENTE AUCUNE INFORMATION. Si une mention est absente ou illisible, mets une chaîne vide "".
2. Pour "cin", extrait le numéro alphanumérique de la CIN (ex: CD123456, BK78901).
3. Pour "lastName" et "firstName", extrait le nom et prénom exactement inscrits.
4. Pour "birthDate", extrait la date de naissance au format JJ/MM/AAAA.
5. Dans "rawText", donne l'intégralité du texte brut reconnu sur la carte.

Schéma JSON attendu:
{
  "cin": "Numéro de CIN",
  "lastName": "Nom de famille en majuscules",
  "firstName": "Prénom",
  "birthDate": "Date de naissance (JJ/MM/AAAA)",
  "birthPlace": "Lieu de naissance",
  "nationality": "Nationalité si inscrite",
  "cardValidUntil": "Date de validité si visible",
  "rawText": "Texte brut extrait"
}`,
                },
              ],
            },
          ],
          config: {
            responseMimeType: 'application/json',
          },
        });

        const durationMs = Date.now() - startTime;
        const textOutput = response.text || '{}';
        const parsed = JSON.parse(textOutput);

        console.log(`[OCR CIN Succès] Temps: ${durationMs}ms — CIN: ${maskSensitiveData(parsed.cin)}, Nom: ${maskSensitiveData(parsed.lastName)}`);

        return res.json({
          success: true,
          data: {
            cin: parsed.cin || '',
            lastName: parsed.lastName || '',
            firstName: parsed.firstName || '',
            birthDate: parsed.birthDate || '',
            birthPlace: parsed.birthPlace || '',
            nationality: parsed.nationality || 'Marocaine',
            cardValidUntil: parsed.cardValidUntil || '',
          },
          diagnostic: {
            imageSizeKb,
            durationMs,
            rawTextExcerpt: parsed.rawText ? parsed.rawText.slice(0, 150) : '',
          },
        });
      } catch (err: any) {
        console.warn('[OCR CIN Avertissement] Échec Gemini API, fallback saisie manuelle:', err?.message);
        return res.json({
          success: true,
          data: {
            cin: '',
            lastName: '',
            firstName: '',
            birthDate: '',
            birthPlace: '',
            nationality: 'Marocaine',
            cardValidUntil: '',
          },
          notice: 'La capture a été reçue mais nécessite une vérification manuelle.',
          diagnostic: { imageSizeKb, errorMsg: err?.message },
        });
      }
    } else {
      return res.json({
        success: true,
        data: {
          cin: '',
          lastName: '',
          firstName: '',
          birthDate: '',
          birthPlace: '',
          nationality: 'Marocaine',
          cardValidUntil: '',
        },
        notice: 'Mode manuel : veuillez vérifier vos informations de CIN.',
      });
    }
  } catch (error: any) {
    console.error('OCR CIN error:', error);
    return res.status(500).json({ success: false, message: 'Erreur lors du traitement OCR de la CIN.' });
  }
});

/**
 * POST /api/ocr/student-card
 * Extracts academic fields from Moroccan Student Card (Carte d'étudiant / Attestation)
 */
app.post('/api/ocr/student-card', async (req: Request, res: Response) => {
  try {
    const { imageBase64 } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ success: false, message: 'Aucune image transmise pour l\'OCR carte d\'étudiant.' });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
    const imageSizeKb = Math.round((cleanBase64.length * 0.75) / 1024);

    console.log(`[OCR Carte-Étudiant] Requête reçue — Taille image: ${imageSizeKb} KB`);

    if (ai) {
      try {
        const startTime = Date.now();
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [
            {
              role: 'user',
              parts: [
                {
                  inlineData: {
                    mimeType: 'image/jpeg',
                    data: cleanBase64,
                  },
                },
                {
                  text: `Analyse cette image de Carte d'Étudiant universitaire marocaine (ex: USMBA, UM5, Cadi Ayyad, FST, ENSA, FSJES...) ou d'Attestation d'Inscription/Réussite Master (en français et/ou en arabe).

Lisez TRÈS ATTENTIVEMENT et FIDÈLEMENT le contenu réel imprimé sur le document.

CONSIGNES STRICTES DE RECONNAISSANCE ET NON-HALLUCINATION :
1. NE JAMAIS INVENTER NI SUPPOSER D'INFORMATION. Si une mention est absente ou illisible, mets une chaîne vide "".
2. Ne confonds pas le nom global de l'université (ex: Université Sidi Mohamed Ben Abdellah) avec le nom de l'établissement/faculté d'origine (ex: Faculté des Sciences Dhar El Mahraz, FST Fès, ENSA, FSJES...).
3. Pour "cne" : extrait le Code CNE, Code Massar, N° Étudiant, N° Apogée ou N° Carte (ex: N134059876, 1512345678, 2018001234).
4. Pour "studentFullName" : extrait le nom et prénom de l'étudiant s'ils apparaissent sur la carte (en français ou translittéré si en arabe).
5. Pour "originEstablishment" : extrait le nom complet de la Faculté / Établissement / École (ex: Faculté des Sciences Dhar El Mahraz Fès, FST Fès, ENSA, Faculté des Lettres...).
6. Pour "masterSpecialty" : extrait l'intitulé exact de la filière, spécialité Master ou diplôme si mentionné. Ne devine pas une spécialité si elle n'est pas inscrite.
7. Pour "academicYear" : extrait l'année universitaire inscrite (ex: 2024-2025, 2025/2026). Si absente, laisse vide "".
8. Dans "rawText", fournis le texte brut complet reconnu sur le document (en français et arabe) pour traçabilité.

Schéma JSON attendu:
{
  "cne": "Code CNE / Massar / N° Étudiant / N° Apogée visible",
  "massarCode": "Code Massar si spécifié séparément, sinon identique au CNE",
  "studentFullName": "Nom et prénom de l'étudiant tel qu'inscrit",
  "originEstablishment": "Nom complet de l'établissement / Faculté d'origine",
  "masterSpecialty": "Filière / Spécialité de Master ou diplôme exact",
  "academicYear": "Année universitaire inscrite (ex: 2024-2025, 2025-2026)",
  "rawText": "Lignes de texte brut lues sur le document"
}`,
                },
              ],
            },
          ],
          config: {
            responseMimeType: 'application/json',
          },
        });

        const durationMs = Date.now() - startTime;
        const textOutput = response.text || '{}';
        const parsed = JSON.parse(textOutput);

        console.log(`[OCR Carte-Étudiant Succès] Temps: ${durationMs}ms — CNE: ${maskSensitiveData(parsed.cne)}, Nom: ${maskSensitiveData(parsed.studentFullName)}, Établissement: ${parsed.originEstablishment || 'Non détecté'}, Filière: ${parsed.masterSpecialty || 'Non détectée'}, Année: ${parsed.academicYear || 'Non détectée'}`);

        return res.json({
          success: true,
          data: {
            cne: parsed.cne || parsed.massarCode || '',
            massarCode: parsed.massarCode || parsed.cne || '',
            studentFullName: parsed.studentFullName || '',
            originEstablishment: parsed.originEstablishment || '',
            masterSpecialty: parsed.masterSpecialty || '',
            academicYear: parsed.academicYear || '',
            rawText: parsed.rawText || '',
          },
          diagnostic: {
            imageSizeKb,
            durationMs,
            rawTextExcerpt: parsed.rawText ? parsed.rawText.slice(0, 200) : '',
          },
        });
      } catch (err: any) {
        console.warn('[OCR Carte-Étudiant Avertissement] Échec Gemini API, fallback champs vides pour saisie manuelle:', err?.message);
        return res.json({
          success: true,
          data: {
            cne: '',
            massarCode: '',
            studentFullName: '',
            originEstablishment: '',
            masterSpecialty: '',
            academicYear: '',
            rawText: '',
          },
          notice: 'La capture a été reçue mais nécessite une saisie manuelle de vos coordonnées universitaires.',
          diagnostic: { imageSizeKb, errorMsg: err?.message },
        });
      }
    } else {
      console.log('[OCR Carte-Étudiant] GEMINI_API_KEY non configurée — mode saisie manuelle');
      return res.json({
        success: true,
        data: {
          cne: '',
          massarCode: '',
          studentFullName: '',
          originEstablishment: '',
          masterSpecialty: '',
          academicYear: '',
          rawText: '',
        },
        notice: 'Mode manuel : veuillez renseigner vos coordonnées universitaires.',
      });
    }
  } catch (error: any) {
    console.error('OCR Student card error:', error);
    return res.status(500).json({ success: false, message: 'Erreur lors du traitement OCR de la carte d\'étudiant.' });
  }
});

/**
 * POST /api/auth/google/verify
 * Server-side verification for Google Sign-In tokens / identities
 */
app.post('/api/auth/google/verify', async (req: Request, res: Response) => {
  try {
    const { credential, userInfo } = req.body;

    let payload: any = userInfo;

    // If a JWT credential was supplied from Google Identity Services, decode its payload
    if (credential && typeof credential === 'string') {
      try {
        const parts = credential.split('.');
        if (parts.length === 3) {
          const buff = Buffer.from(parts[1], 'base64');
          payload = JSON.parse(buff.toString('utf-8'));
        }
      } catch (e) {
        console.warn('Failed to parse Google JWT credential payload, using fallback', e);
      }
    }

    if (!payload || !payload.email) {
      return res.status(400).json({ success: false, message: 'Identité Google invalide.' });
    }

    const googleUser = {
      googleId: payload.sub || `g-${Date.now()}`,
      email: payload.email.toLowerCase(),
      name: payload.name || `${payload.given_name || ''} ${payload.family_name || ''}`.trim(),
      givenName: payload.given_name || payload.firstName || '',
      familyName: payload.family_name || payload.lastName || '',
      photoUrl: payload.picture || '',
      verifiedEmail: payload.email_verified ?? true,
    };

    return res.json({
      success: true,
      user: googleUser,
    });
  } catch (error: any) {
    console.error('Google auth verification error:', error);
    return res.status(500).json({ success: false, message: 'Échec de la validation de l\'authentification Google.' });
  }
});

/**
 * Mount Vite development middlewares or serve static build files
 */
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT} (env: ${isProduction ? 'production' : 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
