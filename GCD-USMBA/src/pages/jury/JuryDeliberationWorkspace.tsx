import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileSignature,
  Award,
  CheckCircle2,
  Printer,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Users
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { CandidateApplication, SelectionReport } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';

export const JuryDeliberationWorkspace: React.FC = () => {
  const { currentUser } = useAuth();
  const applications = storageService.getApplications();
  const existingReport = storageService.getSelectionReport();

  const [deliberationApps, setDeliberationApps] = useState<CandidateApplication[]>(applications);
  const [generatedDraftPV, setGeneratedDraftPV] = useState<SelectionReport | null>(existingReport);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const handleSetDecision = (appId: string, newStatus: 'admise' | 'liste_attente' | 'non_admise') => {
    setDeliberationApps((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a))
    );
  };

  // Activity 19: Automatic generation of draft Procès-Verbal from consolidated deliberation
  const handleGenerateDraftPV = () => {
    const admittedIds = deliberationApps.filter((a) => a.status === 'admise').map((a) => a.id);
    const waitingIds = deliberationApps.filter((a) => a.status === 'liste_attente').map((a) => a.id);
    const rejectedIds = deliberationApps.filter((a) => a.status === 'non_admise').map((a) => a.id);

    const newVersion = (existingReport?.currentVersion || 1) + 1;

    const draftReport: SelectionReport = {
      id: `pv-cedoc-2026-${String(newVersion).padStart(2, '0')}`,
      establishmentId: 'fsdm',
      laboratoryId: 'lisac',
      academicYear: '2026-2027',
      status: 'en_validation',
      currentVersion: newVersion,
      versions: [
        {
          version: newVersion,
          updatedAt: new Date().toISOString(),
          updatedBy: `Pr. ${currentUser?.firstName} ${currentUser?.lastName} (Président de Jury)`,
          summary: `Projet de Procès-Verbal généré automatiquement suite aux délibérations du ${new Date().toLocaleDateString('fr-FR')}. Examen collégial de ${deliberationApps.length} candidatures.`,
          totalAdmitted: admittedIds.length,
          totalWaiting: waitingIds.length,
          totalRejected: rejectedIds.length,
          isApproved: false
        },
        ...(existingReport?.versions || [])
      ],
      admittedApplicationIds: admittedIds,
      waitingApplicationIds: waitingIds,
      rejectedApplicationIds: rejectedIds
    };

    // Save report & sync apps
    storageService.saveSelectionReport(draftReport, {
      id: currentUser?.id || 'jury',
      name: `Pr. ${currentUser?.firstName} ${currentUser?.lastName}`,
      role: 'jury'
    });

    deliberationApps.forEach((a) => {
      storageService.saveApplication(a, {
        id: currentUser?.id || 'jury',
        name: `Pr. ${currentUser?.firstName} ${currentUser?.lastName}`,
        role: 'jury'
      });
    });

    setGeneratedDraftPV(draftReport);
    setSuccessNotice('Projet de Procès-Verbal généré automatiquement et transmis pour visa numérique au Responsable de Formation Doctorale !');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-400/40 px-3 py-1 rounded-full text-teal-300 text-xs font-semibold">
            <Award className="w-3.5 h-3.5" />
            Délibération Sécurisée & Génération Automatique du PV
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Salle de Délibération & Consolidation des Évaluations
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Consolidation en temps réel des notes attribuées par les jurys, classement automatisé des candidats et génération sans erreur matérielle du projet officiel de procès-verbal.
          </p>
        </div>

        <button
          onClick={handleGenerateDraftPV}
          className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-black px-6 py-3 rounded-2xl text-xs transition-all shadow-lg flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Générer le Projet de PV (Activité 19)</span>
        </button>
      </div>

      {successNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* Deliberations Ranking Table (Activity 18) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-bold text-base text-slate-900">
              Classement Consolidé des Candidats
            </h3>
            <p className="text-xs text-slate-500">
              Notes moyennes issues de la grille commune sur 20 points
            </p>
          </div>

          <div className="text-xs font-bold text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            {deliberationApps.length} candidats en délibération
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold text-slate-600 uppercase border-b">
                <th className="py-3 px-4">Réf Dossier</th>
                <th className="py-3 px-4">Candidat</th>
                <th className="py-3 px-4">Cursus Master</th>
                <th className="py-3 px-4">Note /20</th>
                <th className="py-3 px-4">Décision Collégiale</th>
                <th className="py-3 px-4 text-right">Statut Actuel</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {deliberationApps.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50/70">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    {a.referenceNumber}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{a.candidateName}</td>
                  <td className="py-3.5 px-4">{a.masterSpecialty} (Mention {a.masterMention})</td>
                  <td className="py-3.5 px-4 font-black text-teal-800 text-sm">
                    {a.score ? `${a.score}/20` : '18.25/20'}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleSetDecision(a.id, 'admise')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                          a.status === 'admise'
                            ? 'bg-emerald-600 text-white shadow-2xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-emerald-50'
                        }`}
                      >
                        Admis (LP)
                      </button>
                      <button
                        onClick={() => handleSetDecision(a.id, 'liste_attente')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                          a.status === 'liste_attente'
                            ? 'bg-amber-600 text-white shadow-2xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-amber-50'
                        }`}
                      >
                        Attente (LA)
                      </button>
                      <button
                        onClick={() => handleSetDecision(a.id, 'non_admise')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                          a.status === 'non_admise'
                            ? 'bg-rose-600 text-white shadow-2xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-rose-50'
                        }`}
                      >
                        Non retenu
                      </button>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <StatusBadge status={a.status} size="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Draft PV Preview Sheet (Activity 19) */}
      {generatedDraftPV && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 sm:p-12 space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-2">
              <FileSignature className="w-5 h-5 text-teal-600" />
              <h3 className="font-extrabold text-base text-slate-900">
                Projet de Procès-Verbal de Délibération (Version {generatedDraftPV.currentVersion}.0)
              </h3>
            </div>
            <Link
              to="/formation/pv-validation"
              className="text-xs font-bold text-teal-700 hover:underline flex items-center gap-1"
            >
              <span>Accéder à la validation officielle</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
              <div className="text-2xl font-black text-emerald-800">
                {generatedDraftPV.admittedApplicationIds.length}
              </div>
              <div className="text-xs text-emerald-900 font-bold mt-1">Candidats Retenus (Admis)</div>
            </div>
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200">
              <div className="text-2xl font-black text-amber-800">
                {generatedDraftPV.waitingApplicationIds.length}
              </div>
              <div className="text-xs text-amber-900 font-bold mt-1">Liste d'Attente</div>
            </div>
            <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200">
              <div className="text-2xl font-black text-rose-800">
                {generatedDraftPV.rejectedApplicationIds.length}
              </div>
              <div className="text-xs text-rose-900 font-bold mt-1">Non Retenus</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const JuryDashboard: React.FC = () => {
  return <JuryDeliberationWorkspace />;
};
