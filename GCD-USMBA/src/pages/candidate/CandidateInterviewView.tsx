import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Building2,
  Users,
  Printer,
  Download,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';

export const CandidateInterviewView: React.FC = () => {
  const { currentUser } = useAuth();

  // Strict Candidate Application Isolation
  const myApp = storageService.getCandidateApplicationStrict(
    currentUser?.id,
    currentUser?.email,
    currentUser?.cin
  );

  const interviewSlots = storageService.getInterviews();
  const slot = myApp ? interviewSlots.find((s) => s.applicationId === myApp.id) : null;

  if (!myApp || !slot) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
          <Calendar className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-800">Aucune convocation d'audition programmée</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Votre dossier est en cours d'instruction ou l'évaluation de recevabilité n'a pas encore déterminé la date d'entretien avec le jury.
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
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-3xl p-8 text-white shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-400/40 px-3 py-1 rounded-full text-teal-300 text-xs font-semibold">
          <Calendar className="w-3.5 h-3.5" />
          Convocation Officielle & Calendrier d'Audition
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">
          Convocation Officielle à l'Audition Orale
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
          Votre dossier a été déclaré recevable par la commission. Veuillez vous présenter muni de votre convocation imprimée et de votre pièce d'identité originale.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <Link
          to="/candidat/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour au tableau de bord</span>
        </Link>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs"
        >
          <Printer className="w-4 h-4" />
          <span>Imprimer ma convocation officielle</span>
        </button>
      </div>

      {/* Convocation Sheet */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-8">
        <div className="border-b-2 border-slate-900 pb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-slate-900">
              Convocation à l'Épreuve Orale de Sélection
            </h2>
            <p className="text-xs text-slate-500">
              Centre d'Études Doctorales (CEDoc) • Université Sidi Mohamed Ben Abdellah
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block font-mono">Dossier N°</span>
            <span className="text-sm font-mono font-bold text-teal-800">{myApp.referenceNumber}</span>
          </div>
        </div>

        {/* Date and Place Highlight Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-teal-50 rounded-2xl border border-teal-200 space-y-1">
            <span className="text-xs font-semibold text-teal-800 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-teal-600" />
              Date de l'audition
            </span>
            <div className="text-base font-bold text-teal-950">
              {new Date(slot.date).toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>

          <div className="p-4 bg-teal-50 rounded-2xl border border-teal-200 space-y-1">
            <span className="text-xs font-semibold text-teal-800 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-teal-600" />
              Horaire de passage
            </span>
            <div className="text-base font-bold text-teal-950">
              {slot.startTime} à {slot.endTime}
            </div>
          </div>

          <div className="p-4 bg-teal-50 rounded-2xl border border-teal-200 space-y-1">
            <span className="text-xs font-semibold text-teal-800 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-teal-600" />
              Lieu & Salle
            </span>
            <div className="text-base font-bold text-teal-950">{slot.roomOrLink}</div>
          </div>
        </div>

        {/* Candidate & Subject details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-slate-400 font-semibold block">Candidat Convoqué</span>
            <div className="font-bold text-slate-900 text-sm">{myApp.candidateName}</div>
            <div className="font-mono text-slate-500">CIN : {myApp.cin} • CNE : {myApp.cne}</div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-slate-400 font-semibold block">Formation Doctorale & Discipline</span>
            <div className="font-bold text-slate-900 text-sm">{myApp.discipline}</div>
            <div className="text-slate-500">Directeur de Thèse : {myApp.supervisorName}</div>
          </div>

          <div className="sm:col-span-2 p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-slate-400 font-semibold block">Intitulé du Sujet de Thèse</span>
            <div className="font-bold text-slate-900">{myApp.subjectTitle}</div>
          </div>
        </div>

        {/* Instructions */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Consignes importantes pour l'épreuve orale :
          </h3>
          <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <li>Présentation obligatoire de la Carte Nationale d'Identité (CIN) originale à l'entrée.</li>
            <li>Prévoir une présentation PowerPoint de 10 à 15 minutes résumant votre projet de recherche et votre parcours.</li>
            <li>Les entretiens débutent à l'heure précise indiquée ; tout retard peut entraîner le passage en fin de session.</li>
          </ul>
        </div>

        {/* Signature & Seal placeholder */}
        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>Document numérique officiel USMBA</span>
          </div>
          <div className="text-center sm:text-right">
            <div className="font-bold text-slate-800">Le Directeur du Centre d'Études Doctorales</div>
            <div className="text-[10px] text-slate-400 mt-1">Visa électronique certifié</div>
          </div>
        </div>
      </div>
    </div>
  );
};
