import React, { useState } from 'react';
import {
  FileSignature,
  CheckCircle2,
  History,
  Printer,
  ShieldCheck,
  Award,
  Layers,
  ArrowRight
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { SelectionReport } from '../../types';

export const ReportValidation: React.FC = () => {
  const { currentUser } = useAuth();
  const report = storageService.getSelectionReport();
  const applications = storageService.getApplications();

  const [currentVersion, setCurrentVersion] = useState(report.currentVersion);
  const [isApproved, setIsApproved] = useState(
    report.versions.find((v) => v.version === currentVersion)?.isApproved || false
  );
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const activeVersionData =
    report.versions.find((v) => v.version === currentVersion) || report.versions[0];

  const handleApprove = () => {
    const updatedVersions = report.versions.map((v) =>
      v.version === currentVersion
        ? {
            ...v,
            isApproved: true,
            approvedBy: `Pr. ${currentUser?.firstName} ${currentUser?.lastName} (Resp. Formation Doctorale)`,
            approvedAt: new Date().toISOString()
          }
        : v
    );

    const updatedReport: SelectionReport = {
      ...report,
      status: 'valide',
      versions: updatedVersions
    };

    storageService.saveSelectionReport(updatedReport, {
      id: currentUser?.id || 'formation',
      name: `Pr. ${currentUser?.firstName} ${currentUser?.lastName}`,
      role: 'responsable_formation'
    });

    setIsApproved(true);
    setSuccessMsg('Procès-verbal officiel vérifié et validé numériquement avec signature certifiée.');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-3xl p-8 text-white shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-400/40 px-3 py-1 rounded-full text-teal-300 text-xs font-semibold">
          <FileSignature className="w-3.5 h-3.5" />
          Gestion des Versions & Validation Numérique du Procès-Verbal
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">
          Visa & Homologation du Procès-Verbal de Concours
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
          Évite la prolifération de versions papier contradictoires : traçabilité stricte des révisions (v1.0, v1.1...), contrôle des quotas d'admission et signature numérique opposable.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Version selector bar (Activity 20) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <History className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-700">Versions archivées du PV :</span>
          <div className="flex items-center gap-1.5">
            {report.versions.map((ver) => (
              <button
                key={ver.version}
                onClick={() => {
                  setCurrentVersion(ver.version);
                  setIsApproved(ver.isApproved);
                }}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  currentVersion === ver.version
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Version {ver.version}.0 {ver.isApproved ? '(Homologué)' : '(Brouillon)'}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => window.print()}
          className="text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1.5"
        >
          <Printer className="w-4 h-4" />
          <span>Imprimer le document</span>
        </button>
      </div>

      {/* PV Document Sheet */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 sm:p-12 space-y-6">
        <div className="border-b-2 border-slate-900 pb-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-slate-800">
              UNIVERSITÉ SIDI MOHAMED BEN ABDELLAH — FÈS
            </div>
            <div className="text-[11px] text-teal-700 font-semibold">
              Centre d'Études Doctorales • Commission de Délibération
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono font-bold text-slate-500">PV N° {report.id}</span>
            <div className="text-[11px] text-slate-400 font-bold">Version {currentVersion}.0 certifiée</div>
          </div>
        </div>

        <div className="text-center space-y-1">
          <h2 className="text-lg font-black text-slate-900 uppercase">
            Procès-Verbal de Délibération du Concours Doctoral
          </h2>
          <p className="text-xs text-slate-500">Année Universitaire 2026-2027</p>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
          {activeVersionData.summary}
        </div>

        {/* Quotas Summary */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
            <div className="text-2xl font-black text-emerald-800">{activeVersionData.totalAdmitted}</div>
            <div className="text-[11px] text-emerald-900 font-bold mt-0.5">Admis Liste Principale</div>
          </div>
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200">
            <div className="text-2xl font-black text-amber-800">{activeVersionData.totalWaiting}</div>
            <div className="text-[11px] text-amber-900 font-bold mt-0.5">Liste d'Attente</div>
          </div>
          <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200">
            <div className="text-2xl font-black text-rose-800">{activeVersionData.totalRejected}</div>
            <div className="text-[11px] text-rose-900 font-bold mt-0.5">Non Retenus</div>
          </div>
        </div>

        {/* Electronic Signature Box (Activity 20) */}
        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-xs">
            <span className="font-bold text-slate-900">Visa & Homologation Électronique :</span>
            {isApproved ? (
              <div className="text-emerald-700 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  Validé et signé par {activeVersionData.approvedBy || 'Pr. Mustapha El Ouazzani'} le{' '}
                  {new Date(activeVersionData.approvedAt || activeVersionData.updatedAt).toLocaleDateString('fr-FR')}
                </span>
              </div>
            ) : (
              <div className="text-amber-700 font-medium flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>En attente de signature formelle par la direction de formation doctorale</span>
              </div>
            )}
          </div>

          {!isApproved && (
            <button
              onClick={handleApprove}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-colors shadow-xs flex items-center gap-2"
            >
              <FileSignature className="w-4 h-4" />
              <span>Valider & Signer Numériquement</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export const DoctoralManagerDashboard: React.FC = () => {
  return <ReportValidation />;
};
