import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileCheck2,
  Printer,
  Calendar,
  Building2,
  User,
  CheckCircle2,
  Clock,
  ArrowLeft,
  FileText,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { StatusBadge } from '../../components/common/StatusBadge';

export const CandidateApplicationDetail: React.FC = () => {
  const { currentUser } = useAuth();

  // Strict Candidate Application Isolation — strictly personal to currentUser
  const myApp = storageService.getCandidateApplicationStrict(
    currentUser?.id,
    currentUser?.email,
    currentUser?.cin
  );

  if (!myApp) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
          <FileText className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-800">Aucun dossier de candidature trouvé pour ce compte.</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Vous n'avez pas encore finalisé de candidature doctorale. Consultez le catalogue des sujets pour postuler.
        </p>
        <Link
          to="/candidat/postuler"
          className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-colors shadow-xs"
        >
          <span>Déposer une candidature</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <Link
          to="/candidat/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à mon espace candidat</span>
        </Link>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow-xs"
        >
          <Printer className="w-4 h-4" />
          <span>Imprimer mon accusé officiel</span>
        </button>
      </div>

      {/* Main Official Receipt Sheet */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-8">
        {/* Header */}
        <div className="border-b-2 border-slate-900 pb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-black text-slate-900">
              Accusé de Réception de Candidature Doctorale
            </h1>
            <p className="text-xs text-slate-500">
              Plateforme GCD • Université Sidi Mohamed Ben Abdellah
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-400">Numéro unique :</div>
            <div className="text-base font-mono font-black text-teal-800">
              {myApp.referenceNumber}
            </div>
          </div>
        </div>

        {/* Status banner */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-600 font-medium">Statut administratif de votre dossier :</span>
          <StatusBadge status={myApp.status} size="lg" />
        </div>

        {/* Information Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700">
          <div className="bg-slate-50/60 p-4 rounded-xl border border-slate-200">
            <span className="text-slate-400 font-semibold block">Identité Candidat</span>
            <span className="font-bold text-slate-900 text-sm">{myApp.candidateName}</span>
            <div className="text-slate-500 mt-1 font-mono">CIN : {myApp.cin} | CNE : {myApp.cne}</div>
            <div className="text-slate-500">{myApp.candidateEmail}</div>
          </div>

          <div className="bg-slate-50/60 p-4 rounded-xl border border-slate-200">
            <span className="text-slate-400 font-semibold block">Cursus Validé</span>
            <span className="font-bold text-slate-900 text-sm">{myApp.masterSpecialty}</span>
            <div className="text-slate-500 mt-1">{myApp.masterOriginUniversity}</div>
            <div className="text-teal-700 font-semibold">Promotion {myApp.masterGraduationYear} — Mention {myApp.masterMention}</div>
          </div>

          <div className="sm:col-span-2 bg-slate-50/60 p-4 rounded-xl border border-slate-200">
            <span className="text-slate-400 font-semibold block">Sujet de Thèse Retenu</span>
            <span className="font-bold text-slate-900 text-sm">{myApp.subjectTitle}</span>
            <div className="text-slate-500 mt-1">Discipline : {myApp.discipline} • Labo : {myApp.laboratoryId.toUpperCase()}</div>
            <div className="text-slate-700 font-medium">Directeur de Thèse : {myApp.supervisorName}</div>
          </div>
        </div>

        {/* Documents */}
        <div className="space-y-3">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">
            Pièces justificatives versées au dossier ({myApp.documents.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {myApp.documents.map((d) => (
              <div
                key={d.id}
                className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2 truncate">
                  <FileText className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span className="truncate text-slate-800 font-medium">{d.label}</span>
                </div>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold shrink-0">
                  {d.fileName ? 'Déposé' : 'Non joint'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Security watermark footer */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>Document numérique certifié par le Centre d'Études Doctorales USMBA</span>
          </div>
          <div>Généré le {new Date().toLocaleDateString('fr-FR')}</div>
        </div>
      </div>
    </div>
  );
};
