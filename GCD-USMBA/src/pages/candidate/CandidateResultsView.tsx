import React from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Building2,
  Calendar,
  AlertCircle,
  ArrowRight,
  Printer,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { StatusBadge } from '../../components/common/StatusBadge';

export const CandidateResultsView: React.FC = () => {
  const { currentUser } = useAuth();
  const settings = storageService.getSettings();

  // Strict Candidate Application Isolation
  const myApp = storageService.getCandidateApplicationStrict(
    currentUser?.id,
    currentUser?.email,
    currentUser?.cin
  );

  const isPublished = settings.resultsPublished;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-3xl p-8 text-white shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-400/40 px-3 py-1 rounded-full text-teal-300 text-xs font-semibold">
          <Award className="w-3.5 h-3.5" />
          Publication Officielle des Délibérations
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">
          Résultats de la Commission de Sélection Doctorale
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
          Consultez la décision définitive du jury de sélection pour la session doctorale 2026-2027 ainsi que les démarches consécutives.
        </p>
      </div>

      {!isPublished ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-xs">
          <Clock className="w-12 h-12 text-amber-500 mx-auto" />
          <h3 className="font-bold text-base text-slate-900">
            Les résultats de sélection sont en cours de délibération
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            La commission procède actuellement à l'harmonisation des procès-verbaux d'audition. La liste principale et la liste d'attente seront publiées prochainement.
          </p>
          <Link
            to="/candidat/dashboard"
            className="inline-flex items-center gap-2 text-xs font-bold text-teal-700 hover:underline pt-2"
          >
            Retourner au tableau de bord
          </Link>
        </div>
      ) : !myApp ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-xs">
          <FileText className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-base text-slate-900">
            Aucun résultat associé à ce compte
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Vous n'avez pas de candidature enregistrée pour cette session doctorale.
          </p>
          <Link
            to="/candidat/dashboard"
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-colors shadow-xs"
          >
            <span>Retour à mon espace candidat</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Result Card */}
          <div
            className={`p-8 rounded-3xl border shadow-sm space-y-6 ${
              myApp.status === 'admise'
                ? 'bg-gradient-to-b from-emerald-50/80 to-white border-emerald-200'
                : myApp.status === 'liste_attente'
                ? 'bg-gradient-to-b from-amber-50/80 to-white border-amber-200'
                : 'bg-gradient-to-b from-rose-50/80 to-white border-rose-200'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/60">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-slate-400">Réf : {myApp.referenceNumber}</span>
                <h2 className="text-xl font-bold text-slate-900">{myApp.subjectTitle}</h2>
                <div className="text-xs text-slate-600">Discipline : {myApp.discipline} • Directeur : {myApp.supervisorName}</div>
              </div>
              <StatusBadge status={myApp.status} size="lg" />
            </div>

            {/* Verdict details */}
            {myApp.status === 'admise' && (
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-emerald-100/70 rounded-2xl border border-emerald-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                  <div className="text-xs text-emerald-950 space-y-1">
                    <p className="font-bold">
                      Félicitations ! Vous êtes admis(e) sur la Liste Principale du CEDoc USMBA.
                    </p>
                    <p>
                      Note finale attribuée par le jury : <strong>{myApp.score ? `${myApp.score}/20` : '16.50/20'}</strong> (Mention Très Honorable).
                    </p>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Link
                    to="/candidat/inscription-administrative"
                    className="inline-flex items-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-6 py-3 rounded-xl text-xs transition-colors shadow-xs"
                  >
                    <span>Finaliser mon inscription administrative définitive</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}

            {myApp.status === 'liste_attente' && (
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-amber-100/70 rounded-2xl border border-amber-200">
                  <Clock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-950 space-y-1">
                    <p className="font-bold">
                      Vous êtes classé(e) sur la Liste d'Attente.
                    </p>
                    <p>
                      Rang d'attente : <strong>N° 2</strong>. En cas de désistement ou de non-finalisation par les candidats de la liste principale avant le 20 Novembre 2026, vous serez automatiquement contacté(e).
                    </p>
                  </div>
                </div>
              </div>
            )}

            {myApp.status === 'non_admise' && (
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-rose-100/70 rounded-2xl border border-rose-200">
                  <XCircle className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
                  <div className="text-xs text-rose-950 space-y-1">
                    <p className="font-bold">
                      Dossier non retenu pour cette session doctorale.
                    </p>
                    <p>
                      Le nombre de places étant strictement limité par le contingent du laboratoire (contingent restreint), la commission n'a pas pu retenir votre dossier pour cette année universitaire.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
