import React from 'react';
import {
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Users,
  Building2,
  FileText,
  Layers,
  ArrowRight
} from 'lucide-react';
import { storageService } from '../../services/storageService';

export const PlatformIndicators: React.FC = () => {
  const metrics = storageService.getPlatformMetrics();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-3xl p-8 text-white shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-400/40 px-3 py-1 rounded-full text-teal-300 text-xs font-semibold">
          <TrendingUp className="w-3.5 h-3.5" />
          Tableau de Bord & Indicateurs de Pilotage Opérationnel
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">
          Indicateurs Clés & Surveillance Opérationnelle
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
          Diagnostic en direct des flux de traitement : identification des retards de validation en laboratoire, des engorgements d'instruction et des délais d'audition des candidats.
        </p>
      </div>

      {/* Bottlenecks Warning Panel (Activity 35) */}
      <div className="space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <span>Détecteur Automatique de Goulets & Points de Blocage</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {metrics.bottlenecks.map((bn) => (
            <div
              key={bn.id}
              className={`p-6 rounded-3xl border transition-all ${
                bn.severity === 'alert'
                  ? 'bg-rose-50/70 border-rose-300'
                  : bn.severity === 'warning'
                  ? 'bg-amber-50/70 border-amber-300'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        bn.severity === 'alert'
                          ? 'bg-rose-500 animate-pulse'
                          : bn.severity === 'warning'
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                    />
                    <h4 className="font-bold text-sm text-slate-900">{bn.title}</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{bn.description}</p>
                </div>
                <div
                  className={`text-2xl font-black px-3 py-1 rounded-xl shrink-0 ${
                    bn.severity === 'alert'
                      ? 'bg-rose-100 text-rose-800'
                      : bn.severity === 'warning'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {bn.count}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Operational Volumes Statistics */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="font-bold text-base text-slate-900">
            Répartition des Candidatures par Étape de Traitement
          </h3>
          <p className="text-xs text-slate-500">
            État réel des dossiers stockés dans la base de données
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100 text-center">
            <div className="text-2xl font-black text-sky-800">
              {metrics.applicationsByStatus.soumise}
            </div>
            <div className="text-[11px] text-sky-900 font-semibold mt-1">Dépôts récents</div>
          </div>

          <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 text-center">
            <div className="text-2xl font-black text-blue-800">
              {metrics.applicationsByStatus.en_verification}
            </div>
            <div className="text-[11px] text-blue-900 font-semibold mt-1">En vérification</div>
          </div>

          <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100 text-center">
            <div className="text-2xl font-black text-rose-800">
              {metrics.applicationsByStatus.correction_demandee}
            </div>
            <div className="text-[11px] text-rose-900 font-semibold mt-1">En régularisation</div>
          </div>

          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
            <div className="text-2xl font-black text-emerald-800">
              {metrics.applicationsByStatus.recevable}
            </div>
            <div className="text-[11px] text-emerald-900 font-semibold mt-1">Recevables</div>
          </div>

          <div className="p-4 bg-teal-50 rounded-2xl border border-teal-100 text-center">
            <div className="text-2xl font-black text-teal-800">
              {metrics.applicationsByStatus.entretien}
            </div>
            <div className="text-[11px] text-teal-900 font-semibold mt-1">En audition</div>
          </div>

          <div className="p-4 bg-green-50 rounded-2xl border border-green-200 text-center">
            <div className="text-2xl font-black text-green-900">
              {metrics.applicationsByStatus.admise}
            </div>
            <div className="text-[11px] text-green-950 font-bold mt-1">Admis définitifs</div>
          </div>
        </div>
      </div>
    </div>
  );
};
