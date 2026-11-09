import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CheckSquare,
  FileCheck2,
  Download,
  Upload,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Printer,
  ShieldCheck,
  Building2,
  FileText
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { AdministrativeRegistration } from '../../types';

export const CandidateRegistrationChecklist: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const registrations = storageService.getAdministrativeRegistrations();

  // Strict Candidate Application Isolation
  const myApp = storageService.getCandidateApplicationStrict(
    currentUser?.id,
    currentUser?.email,
    currentUser?.cin
  );

  const existingReg = myApp
    ? registrations.find((r) => r.candidateId === myApp.candidateId || r.applicationId === myApp.id)
    : null;

  const [docsState, setDocsState] = useState([
    { id: 'cd-1', label: 'Originaux des Diplômes (Baccalauréat, Licence, Master) certifiés', fileName: 'Diplomes_Originaux_Scan.pdf', status: 'conforme', required: true },
    { id: 'cd-2', label: 'Charte des Thèses USMBA paraphée et signée par les encadrants', fileName: 'Charte_These_USMBA_Signee.pdf', status: 'conforme', required: true },
    { id: 'cd-3', label: '4 Photos d\'identité récentes (Format passeport)', fileName: 'Photos_Identite_2026.jpg', status: 'conforme', required: true },
    { id: 'cd-4', label: 'Attestation d\'assurance responsabilité civile étudiant en cours', fileName: 'Attestation_Assurance.pdf', status: 'fourni', required: true },
    { id: 'cd-5', label: 'Engagement sur l\'honneur de respect du règlement intérieur', fileName: 'Engagement_Honneur.pdf', status: 'fourni', required: true }
  ]);

  const [isSaved, setIsSaved] = useState(false);

  const handleSimulateUpload = (docId: string) => {
    setDocsState((prev) =>
      prev.map((d) => (d.id === docId ? { ...d, fileName: `Document_Televerse_${d.id}.pdf`, status: 'fourni' } : d))
    );
  };

  const handleSubmitRegistration = () => {
    if (!myApp) return;

    const newReg: AdministrativeRegistration = {
      id: existingReg?.id || `reg-${Date.now()}`,
      applicationId: myApp.id,
      candidateId: myApp.candidateId,
      studentName: myApp.candidateName,
      cin: myApp.cin,
      cne: myApp.cne,
      subjectTitle: myApp.subjectTitle,
      laboratoryId: myApp.laboratoryId,
      establishmentId: myApp.establishmentId,
      supervisorName: myApp.supervisorName,
      status: 'en_cours_verification',
      academicYear: '2026-2027',
      submittedAt: new Date().toISOString(),
      documents: docsState.map((d) => ({
        id: d.id,
        label: d.label,
        fileName: d.fileName,
        status: (d.status === 'conforme' ? 'conforme' : 'fourni') as 'conforme' | 'fourni' | 'manquant' | 'rejete',
        required: d.required
      }))
    };

    storageService.saveAdministrativeRegistration(newReg, {
      id: currentUser?.id || 'candidat',
      name: `${currentUser?.firstName} ${currentUser?.lastName}`,
      role: 'candidat'
    });

    storageService.addNotification({
      targetRole: 'administration',
      title: `Dossier d'inscription déposé — ${myApp.candidateName}`,
      message: `Le candidat admis ${myApp.candidateName} (${myApp.cin}) a validé sa checklist d'inscription administrative définitive.`,
      category: 'inscription',
      link: '/administration/inscriptions'
    });

    setIsSaved(true);
  };

  if (!myApp || myApp.status !== 'admise') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
          <CheckSquare className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-800">
          Espace d'inscription administrative définitive
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Cette démarche est réservée aux candidats déclarés admis sur la liste principale après délibération de la commission de sélection.
        </p>
        <Link
          to="/candidat/dashboard"
          className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-colors shadow-xs"
        >
          <span>Retour à mon espace candidat</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 rounded-3xl p-8 text-white shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/40 px-3 py-1 rounded-full text-emerald-300 text-xs font-semibold">
          <CheckSquare className="w-3.5 h-3.5" />
          Inscription Administrative Personnalisée
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">
          Checklist d'Inscription Définitive au Doctorat
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
          Vos informations validées lors de la candidature ont été automatiquement pré-remplies.
          Vérifiez vos données et déposez les pièces requises pour finaliser votre dossier.
        </p>
      </div>

      {isSaved ? (
        <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-3xl text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-bold text-emerald-950">
            Dossier d'inscription administrative transmis !
          </h2>
          <p className="text-xs text-emerald-800 max-w-md mx-auto leading-relaxed">
            Vos documents administratifs sont en cours de contrôle de conformité par le service de scolarité de l'établissement. Votre attestation d'inscription sera délivrée dès validation finale.
          </p>
          <div className="pt-2">
            <Link
              to="/candidat/dashboard"
              className="inline-flex items-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white px-6 py-2.5 rounded-xl font-bold text-xs transition-colors shadow-xs"
            >
              <span>Retour à mon tableau de bord</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Prefilled Profile Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-bold text-xs uppercase tracking-wider text-slate-500">
                1. Données civiles & universitaires pré-remplies
              </span>
              <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-md border border-emerald-200">
                Données authentifiées
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[10px]">Nom complet</span>
                <span className="font-bold text-slate-900">{myApp.candidateName}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[10px]">CIN / CNE</span>
                <span className="font-mono font-bold text-teal-800">{myApp.cin} / {myApp.cne}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[10px]">Adresse e-mail Google</span>
                <span className="font-mono text-slate-800 truncate block">{myApp.candidateEmail}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[10px]">Directeur de Thèse</span>
                <span className="font-bold text-slate-800">{myApp.supervisorName}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[10px]">Laboratoire d'accueil</span>
                <span className="font-bold text-slate-800 uppercase">{myApp.laboratoryId}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[10px]">Année universitaire</span>
                <span className="font-bold text-slate-800">2026-2027</span>
              </div>
            </div>
          </div>

          {/* Checklist of mandatory documents */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-bold text-xs uppercase tracking-wider text-slate-500">
                2. Pièces administratives obligatoires à fournir
              </span>
              <span className="text-xs text-slate-500">
                {docsState.filter((d) => d.status === 'conforme' || d.status === 'fourni').length} / {docsState.length} pièce(s) prête(s)
              </span>
            </div>

            <div className="space-y-3">
              {docsState.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-teal-600 shrink-0" />
                      <span className="font-bold text-slate-900">{doc.label}</span>
                    </div>
                    {doc.fileName && (
                      <span className="text-[11px] font-mono text-slate-500 block pl-6">
                        Fichier joint : {doc.fileName}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {doc.status === 'conforme' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Conforme
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSimulateUpload(doc.id)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 px-3 py-1.5 rounded-xl transition-colors shadow-2xs"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Téléverser</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <Link
                to="/candidat/dashboard"
                className="text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Retour
              </Link>

              <button
                type="button"
                onClick={handleSubmitRegistration}
                className="inline-flex items-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-colors shadow-xs"
              >
                <span>Confirmer et soumettre mon inscription</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
