import React, { useState } from 'react';
import {
  Layers,
  CheckCircle2,
  Cpu,
  RefreshCw,
  Database,
  ArrowRight,
  Shield,
  Workflow
} from 'lucide-react';
import { storageService } from '../../services/storageService';

export const ProcessCoordination: React.FC = () => {
  const [autoEmail, setAutoEmail] = useState(true);
  const [autoPrefill, setAutoPrefill] = useState(true);
  const [antiDuplicate, setAntiDuplicate] = useState(true);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSaveAutomations = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const pipelineStages = [
    { step: 1, name: 'Sujets & Validation Labo', desc: 'Formulaire standardisé → Visa numérique immédiat par directeur de laboratoire.' },
    { step: 2, name: 'Candidature & Contrôle Amont', desc: 'Checklist des pièces → Génération de référence unique et accusé instantané.' },
    { step: 3, name: 'Instruction Scolarité', desc: 'Vérification automatique du format → Détection des anomalies et notifications ciblées.' },
    { step: 4, name: 'Audition & Délibération', desc: 'Planification sans conflit → Grille commune sur 20 → Projet de PV automatique.' },
    { step: 5, name: 'Inscription Administrative', desc: 'Préremplissage Apogée sans double saisie → Contrôle de conformité des originaux.' },
    { step: 6, name: 'Réinscriptions & Diplomation', desc: 'File ordonnée par priorité et forclusion → Suivi confidentiel du directeur.' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-3xl p-8 text-white shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-400/40 px-3 py-1 rounded-full text-teal-300 text-xs font-semibold">
          <Workflow className="w-3.5 h-3.5" />
          Module D — Pilotage & Continuité des Opérations Doctorales
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">
          Coordination & Continuité du Cycle Doctoral
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
          Éradication des ressaisies redondantes : un modèle de données unifié interconnectant les propositions de sujets, les dossiers de candidatures, les délibérations de jury et le suivi pluriannuel.
        </p>
      </div>

      {savedNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Règles d'automatisation et paramètres du pipeline enregistrés avec succès.</span>
        </div>
      )}

      {/* End-to-End Pipeline Visualization (Activity 36) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="font-bold text-base text-slate-900">
            Pipeline Centralisé en 6 Étapes Interconnectées
          </h3>
          <p className="text-xs text-slate-500">
            Les données validées à une étape sont automatiquement injectées dans la suivante
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pipelineStages.map((st) => (
            <div
              key={st.step}
              className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2 text-xs"
            >
              <div className="flex items-center gap-2 font-bold text-teal-900">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs">
                  {st.step}
                </span>
                <span className="text-sm text-slate-900">{st.name}</span>
              </div>
              <p className="text-slate-600 leading-relaxed">{st.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Automation Rules Configuration */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="font-bold text-base text-slate-900">
            Règles d'Automatisation & Prévention des Doublons
          </h3>
          <p className="text-xs text-slate-500">
            Contrôles algorithmiques actifs sur la plateforme GCD
          </p>
        </div>

        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-2xl border border-slate-200 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="font-bold text-slate-900">
                Préremplissage automatique des dossiers d'inscription définitive
              </div>
              <p className="text-slate-500 text-[11px]">
                Réinjecte immédiatement le nom, CIN, CNE, parcours Master et sujet de thèse sans ressaisie par le candidat ou la scolarité.
              </p>
            </div>
            <input
              type="checkbox"
              checked={autoPrefill}
              onChange={(e) => setAutoPrefill(e.target.checked)}
              className="w-5 h-5 accent-teal-600 cursor-pointer"
            />
          </div>

          <div className="p-4 rounded-2xl border border-slate-200 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="font-bold text-slate-900">
                Contrôle d'intégrité anti-doublon lors du dépôt
              </div>
              <p className="text-slate-500 text-[11px]">
                Interdit à un même candidat de déposer plus de deux candidatures ou de soumettre des fichiers identiques en doublon.
              </p>
            </div>
            <input
              type="checkbox"
              checked={antiDuplicate}
              onChange={(e) => setAntiDuplicate(e.target.checked)}
              className="w-5 h-5 accent-teal-600 cursor-pointer"
            />
          </div>

          <div className="p-4 rounded-2xl border border-slate-200 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="font-bold text-slate-900">
                Notifications push automatiques à chaque changement de statut
              </div>
              <p className="text-slate-500 text-[11px]">
                Déclenche instantanément une alerte personnalisée pour convocation, demande de correction ou publication des résultats.
              </p>
            </div>
            <input
              type="checkbox"
              checked={autoEmail}
              onChange={(e) => setAutoEmail(e.target.checked)}
              className="w-5 h-5 accent-teal-600 cursor-pointer"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleSaveAutomations}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-colors shadow-xs"
          >
            Enregistrer la configuration des règles
          </button>
        </div>
      </div>
    </div>
  );
};

export const PlatformAdminDashboard: React.FC = () => {
  return <ProcessCoordination />;
};
