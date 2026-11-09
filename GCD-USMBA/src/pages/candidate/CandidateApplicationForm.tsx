import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  FileCheck2,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Building2,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  FileText,
  Printer
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { DoctoralSubject, CandidateApplication, ApplicationDocument, DocumentType } from '../../types';
import { DocumentUploader } from '../../components/common/DocumentUploader';

const REQUIRED_DOC_TYPES: { type: DocumentType; label: string }[] = [
  { type: 'cin', label: 'Carte d\'Identité Nationale (CIN)' },
  { type: 'bac', label: 'Diplôme du Baccalauréat' },
  { type: 'licence', label: 'Diplôme de Licence ou équivalent' },
  { type: 'master', label: 'Diplôme de Master, Master Spécialisé ou Diplôme d\'Ingénieur' },
  { type: 'releves_notes', label: 'Relevés de notes de l\'ensemble du cursus universitaire (S1 à S4)' },
  { type: 'cv', label: 'Curriculum Vitae détaillé et actualisé' },
  { type: 'lettre_motivation', label: 'Lettre de motivation argumentée' },
  { type: 'projet_recherche', label: 'Avant-projet de recherche de thèse (3 à 5 pages)' },
  { type: 'attestation_non_travail', label: 'Attestation de non travail ou autorisation de l\'employeur' }
];

export const CandidateApplicationForm: React.FC = () => {
  const [searchParams] = useSearchParams();
  const preselectedSubjectId = searchParams.get('subjectId');

  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const subjects = storageService.getSubjects().filter((s) => s.status === 'valide');

  const [selectedSubjectId, setSelectedSubjectId] = useState(
    preselectedSubjectId || subjects[0]?.id || ''
  );

  const [academicData, setAcademicData] = useState({
    masterOriginUniversity: 'Université Sidi Mohamed Ben Abdellah - FSDM',
    masterSpecialty: 'Informatique Décisionnelle et Systèmes Intelligents (IDSI)',
    masterGraduationYear: 2026,
    masterMention: 'Très Bien' as const
  });

  const [documents, setDocuments] = useState<ApplicationDocument[]>(() => {
    return REQUIRED_DOC_TYPES.map((req, idx) => ({
      id: `doc-init-${idx}`,
      type: req.type,
      label: req.label,
      fileName: `Justificatif_${req.type.toUpperCase()}.pdf`, // pre-populate demo files for smooth immediate testability
      fileSize: 1200000,
      fileUrl: '#',
      isRequired: true,
      status: 'en_attente',
      uploadedAt: new Date().toISOString()
    }));
  });

  const [submittedApp, setSubmittedApp] = useState<CandidateApplication | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const selectedSubject = subjects.find((s) => s.id === selectedSubjectId);

  const handleDocumentUpload = (docId: string, file: { fileName: string; fileSize: number; fileUrl: string }) => {
    setDocuments((prev) =>
      prev.map((d) =>
        d.id === docId
          ? {
              ...d,
              fileName: file.fileName,
              fileSize: file.fileSize,
              fileUrl: file.fileUrl,
              status: 'en_attente',
              uploadedAt: new Date().toISOString(),
              rejectionReason: undefined
            }
          : d
      )
    );
  };

  const missingDocs = documents.filter((d) => d.isRequired && !d.fileName);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!selectedSubject) {
      setErrorMsg('Veuillez sélectionner un sujet de doctorat valide.');
      return;
    }

    if (missingDocs.length > 0) {
      setErrorMsg(`Dossier incomplet : ${missingDocs.length} pièce(s) obligatoire(s) manquante(s).`);
      return;
    }

    // Generate unique dossier reference (Activity 8)
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const refNumber = `USMBA-DOC-2026-${randomNum}`;

    const newApp: CandidateApplication = {
      id: `app-${Date.now()}`,
      referenceNumber: refNumber,
      candidateId: currentUser?.id || 'usr-candidate',
      candidateName: `${currentUser?.firstName || 'Candidat'} ${currentUser?.lastName || 'USMBA'}`,
      candidateEmail: currentUser?.email || 'candidat@usmba.ac.ma',
      candidatePhone: currentUser?.phone || '+212 6 00 00 00 00',
      cin: currentUser?.cin || 'CD000000',
      cne: currentUser?.cne || 'N000000000',
      subjectId: selectedSubject.id,
      subjectTitle: selectedSubject.title,
      laboratoryId: selectedSubject.laboratoryId,
      establishmentId: selectedSubject.establishmentId,
      supervisorName: selectedSubject.supervisorName,
      discipline: selectedSubject.discipline,
      masterOriginUniversity: academicData.masterOriginUniversity,
      masterSpecialty: academicData.masterSpecialty,
      masterGraduationYear: Number(academicData.masterGraduationYear),
      masterMention: academicData.masterMention,
      status: 'soumise',
      assignedReviewerId: 'usr-admin-1',
      assignedReviewerName: 'Bureau des Études Doctorales (Instruction)',
      documents: documents.map((d) => ({ ...d, status: 'valide' })), // automatic format acceptance
      correctionRequests: [],
      statusHistory: [
        {
          id: `sh-${Date.now()}`,
          status: 'soumise',
          comment: 'Dossier de candidature initial soumis par le candidat avec contrôle préalable des pièces.',
          changedBy: `${currentUser?.firstName} ${currentUser?.lastName}`,
          timestamp: new Date().toISOString()
        }
      ],
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save to storage
    storageService.saveApplication(newApp, {
      id: currentUser?.id || 'candidat',
      name: `${currentUser?.firstName} ${currentUser?.lastName}`,
      role: 'candidat'
    });

    // Send automatic confirmation notification (Activity 8)
    storageService.addNotification({
      targetRole: 'candidat',
      userId: currentUser?.id,
      title: 'Dépôt confirmé — Réf ' + refNumber,
      message: `Votre candidature pour le sujet "${selectedSubject.title.substring(0, 45)}..." a été enregistrée avec succès. Votre accusé de réception est disponible.`,
      category: 'candidature',
      link: '/candidat/mon-dossier'
    });

    // Notify administration
    storageService.addNotification({
      targetRole: 'administration',
      title: 'Nouvelle candidature à instruire',
      message: `Le candidat ${newApp.candidateName} (${refNumber}) a déposé un dossier pour le laboratoire ${selectedSubject.laboratoryId.toUpperCase()}.`,
      category: 'candidature',
      link: '/administration/dossiers'
    });

    setSubmittedApp(newApp);
  };

  // SUCCESS CONFIRMATION & RECEIPT VIEW (Activity 8)
  if (submittedApp) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
        <div className="bg-white rounded-3xl border border-emerald-200 shadow-xl p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Activité N°8 — Confirmation de Dépôt Validée
              </span>
              <h1 className="text-2xl font-black text-slate-900 mt-1">
                Accusé de Réception de Candidature
              </h1>
            </div>
          </div>

          <div className="p-5 bg-emerald-50/80 rounded-2xl border border-emerald-200 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs text-emerald-800 font-medium">Numéro de dossier unique généré :</span>
              <span className="text-base font-mono font-black text-emerald-950 bg-white px-3 py-1 rounded-lg border border-emerald-300">
                {submittedApp.referenceNumber}
              </span>
            </div>
            <div className="text-xs text-emerald-800">
              Horodatage certifié : {new Date(submittedApp.submittedAt).toLocaleString('fr-FR')}
            </div>
          </div>

          {/* Receipt details */}
          <div className="space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 border-b pb-2">Récapitulatif de la soumission</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
              <div>
                <span className="text-slate-400 block font-semibold">Candidat</span>
                <span className="font-bold text-slate-900">{submittedApp.candidateName} (CIN: {submittedApp.cin})</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">E-mail de contact</span>
                <span className="font-bold text-slate-900">{submittedApp.candidateEmail}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-400 block font-semibold">Sujet de thèse sélectionné</span>
                <span className="font-bold text-slate-900">{submittedApp.subjectTitle}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Directeur de Thèse</span>
                <span className="font-bold text-slate-900">{submittedApp.supervisorName}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Total pièces téléversées</span>
                <span className="font-bold text-emerald-700">{submittedApp.documents.length} / {submittedApp.documents.length} (Complet)</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 leading-relaxed">
            <strong>Prochaine étape :</strong> Votre dossier entre en phase d'instruction administrative par le secrétariat du CEDoc. Vous recevrez une alerte en cas de demande de régularisation ou la convocation officielle à l'entretien dès validation de recevabilité.
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={() => window.print()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 px-5 py-2.5 rounded-xl text-xs font-bold transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimer l'accusé de réception</span>
            </button>

            <button
              onClick={() => navigate('/candidat/dashboard')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-colors shadow-xs"
            >
              <span>Accéder à mon tableau de bord</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-3xl p-8 text-white shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-400/40 px-3 py-1 rounded-full text-teal-300 text-xs font-semibold">
          <FileCheck2 className="w-3.5 h-3.5" />
          Dépôt Officiel de Candidature au Doctorat
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">
          Formulaire Officiel de Dépôt de Candidature
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
          Sélectionnez votre sujet de doctorat et joignez les pièces justificatives numérisées requises.
          Le système effectue un contrôle automatique de complétude avant soumission.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Choix du Sujet */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <span className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold">
              1
            </span>
            <h3 className="font-bold text-sm text-slate-900">Choix du Sujet de Thèse de Doctorat</h3>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Sélectionner un sujet parmi ceux validés par les laboratoires USMBA :
            </label>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  [{s.discipline}] {s.title} — Dir: {s.supervisorName}
                </option>
              ))}
            </select>
          </div>

          {selectedSubject && (
            <div className="p-4 bg-teal-50/50 rounded-2xl border border-teal-200 text-xs text-teal-900 space-y-1.5">
              <div className="font-bold text-sm text-teal-950">{selectedSubject.title}</div>
              <div className="text-slate-600">
                <strong>Laboratoire :</strong> {selectedSubject.laboratoryId.toUpperCase()} • <strong>Directeur :</strong> {selectedSubject.supervisorName}
              </div>
              <div className="text-slate-600">
                <strong>Prérequis attendus :</strong> {selectedSubject.prerequisites}
              </div>
            </div>
          )}
        </div>

        {/* Step 2: Cursus Académique Master */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <span className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold">
              2
            </span>
            <h3 className="font-bold text-sm text-slate-900">Cursus de Master ou Diplôme d'Ingénieur Équivalent</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Université d'origine du Master
              </label>
              <input
                type="text"
                required
                value={academicData.masterOriginUniversity}
                onChange={(e) => setAcademicData({ ...academicData, masterOriginUniversity: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Intitulé exact de la Spécialité / Filière
              </label>
              <input
                type="text"
                required
                value={academicData.masterSpecialty}
                onChange={(e) => setAcademicData({ ...academicData, masterSpecialty: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Année d'obtention
              </label>
              <input
                type="number"
                min="2015"
                max="2026"
                required
                value={academicData.masterGraduationYear}
                onChange={(e) => setAcademicData({ ...academicData, masterGraduationYear: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Mention obtenue
              </label>
              <select
                value={academicData.masterMention}
                onChange={(e) => setAcademicData({ ...academicData, masterMention: e.target.value as any })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="Très Bien">Très Bien (16/20 et plus)</option>
                <option value="Bien">Bien (14 à 15.99/20)</option>
                <option value="Assez Bien">Assez Bien (12 à 13.99/20)</option>
                <option value="Passable">Passable (10 à 11.99/20)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Step 3: Liste de contrôle des documents (Activity 7) */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold">
                3
              </span>
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  Liste de Contrôle des Pièces Justificatives (Activité N°7)
                </h3>
                <p className="text-[11px] text-slate-500">
                  Vérification automatique de conformité et détection amont des pièces manquantes.
                </p>
              </div>
            </div>

            <div className="text-xs font-bold text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              {documents.filter((d) => d.fileName).length} / {documents.length} pièces jointes
            </div>
          </div>

          <div className="space-y-3">
            {documents.map((doc) => (
              <DocumentUploader
                key={doc.id}
                document={doc}
                onUpload={handleDocumentUpload}
              />
            ))}
          </div>
        </div>

        {/* Submission confirmation bar */}
        <div className="bg-slate-900 p-6 rounded-3xl text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="text-xs space-y-1 text-center sm:text-left">
            <div className="font-bold text-sm text-teal-300">Prêt pour la soumission officielle ?</div>
            <p className="text-slate-300 text-[11px]">
              En soumettant ce formulaire, un numéro de dossier unique et un accusé de réception automatique vous seront délivrés.
            </p>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold px-8 py-3.5 rounded-xl text-xs transition-all shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2"
          >
            <span>Soumettre définitivement mon dossier</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
