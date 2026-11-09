import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  Calendar,
  Globe,
  Lock,
  ArrowRight,
  ShieldCheck,
  Printer,
  Sparkles
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../../components/common/StatusBadge';

export const AdminPublishResults: React.FC = () => {
  const { currentUser } = useAuth();
  const settings = storageService.getSettings();
  const selectionReport = storageService.getSelectionReport();
  const applications = storageService.getApplications();

  const [isPublished, setIsPublished] = useState(settings.resultsPublished);
  const [publicationDate, setPublicationDate] = useState('2026-10-16');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const admittedApps = applications.filter(
    (a) => a.status === 'admise' || selectionReport.admittedApplicationIds.includes(a.id)
  );

  const waitingApps = applications.filter((a) => a.status === 'liste_attente');

  const handleTogglePublication = () => {
    const newState = !isPublished;
    setIsPublished(newState);
    storageService.updateSettings({ resultsPublished: newState });

    storageService.logAction(
      {
        id: currentUser?.id || 'admin',
        name: `${currentUser?.firstName} ${currentUser?.lastName}`,
        role: 'administration'
      },
      newState ? 'PUBLICATION_RESULTATS' : 'RETRAIT_RESULTATS',
      'pv',
      selectionReport.id,
      newState
        ? `Publication officielle des résultats de sélection (Session 2026-2027)`
        : `Dépublication temporaire des résultats de sélection`
    );

    if (newState) {
      storageService.addNotification({
        targetRole: 'candidat',
        title: 'Publication officielle des résultats du concours doctoral',
        message: 'Les résultats d\'admission du CEDoc USMBA sont désormais consultables dans votre espace candidat.',
        category: 'resultat',
        link: '/candidat/resultats'
      });
      setSuccessMsg('Les résultats ont été officiellement publiés et notifiés à l\'ensemble des candidats.');
    } else {
      setSuccessMsg('Les résultats ont été retirés de la visibilité publique.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-3xl p-8 text-white shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-400/40 px-3 py-1 rounded-full text-teal-300 text-xs font-semibold">
          <Award className="w-3.5 h-3.5" />
          Diffusion Officielle des Résultats
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">
          Gestion & Diffusion des Résultats du Concours Doctoral
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
          Validation et diffusion officielle des listes des admis et des listes d'attente certifiées par les procès-verbaux de jurys avec date d'effet opposable.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Control Card (Activity 21) */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <h3 className="font-bold text-base text-slate-900">
              Statut Officiel de la Diffusion Publique
            </h3>
            <p className="text-xs text-slate-500">
              Lorsque la publication est active, chaque candidat peut consulter son résultat dans son espace individuel.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`text-xs font-bold px-3 py-1.5 rounded-full border flex items-center gap-1.5 ${
                isPublished
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}
            >
              {isPublished ? <Globe className="w-3.5 h-3.5 text-emerald-600" /> : <Lock className="w-3.5 h-3.5 text-amber-600" />}
              {isPublished ? 'Résultats Actuellement Publiés' : 'Diffusion Fermée / En Délibération'}
            </span>

            <button
              onClick={handleTogglePublication}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                isPublished
                  ? 'bg-rose-600 hover:bg-rose-700 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {isPublished ? 'Dépublier / Suspendre' : 'Publier Officiellement'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
            <span className="text-slate-400 font-semibold block">Date d'effet officielle de la délibération :</span>
            <div className="font-bold text-slate-800 text-sm">{publicationDate}</div>
            <div className="text-[11px] text-slate-500">Procès-verbal de référence : {selectionReport.id}</div>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
            <span className="text-slate-400 font-semibold block">Candidats admis déclarés :</span>
            <div className="font-bold text-emerald-700 text-sm">{admittedApps.length} candidat(s) sur liste principale</div>
            <div className="text-[11px] text-slate-500">{waitingApps.length} candidat(s) sur liste d'attente</div>
          </div>
        </div>
      </div>

      {/* Admitted Candidates List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-base text-slate-900">
            Liste Principale des Admis au Cycle Doctoral 2026-2027
          </h3>
          <span className="text-xs font-bold text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            {admittedApps.length} admis
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold text-slate-600 uppercase border-b">
                <th className="py-3 px-4">Rang</th>
                <th className="py-3 px-4">Candidat</th>
                <th className="py-3 px-4">CIN</th>
                <th className="py-3 px-4">Sujet de Thèse & Labo</th>
                <th className="py-3 px-4">Note /20</th>
                <th className="py-3 px-4 text-right">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {admittedApps.map((a, i) => (
                <tr key={a.id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4 font-bold text-teal-700">{i + 1}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{a.candidateName}</td>
                  <td className="py-3 px-4 font-mono">{a.cin}</td>
                  <td className="py-3 px-4 max-w-xs truncate">{a.subjectTitle}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{a.score || 18.5}</td>
                  <td className="py-3 px-4 text-right">
                    <StatusBadge status="admise" size="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
