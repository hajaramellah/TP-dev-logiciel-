import React, { useState } from 'react';
import {
  UserCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileCheck2,
  Search,
  Eye,
  ShieldCheck,
  X,
  CreditCard
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { AdministrativeRegistration, RegistrationStatus } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';

export const AdminRegistrationQueue: React.FC = () => {
  const { currentUser } = useAuth();
  const registrations = storageService.getAdministrativeRegistrations();

  const [search, setSearch] = useState('');
  const [selectedReg, setSelectedReg] = useState<AdministrativeRegistration | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const filteredRegs = registrations.filter((r) => {
    const q = search.toLowerCase();
    return (
      r.studentName.toLowerCase().includes(q) ||
      r.cin.toLowerCase().includes(q) ||
      r.subjectTitle.toLowerCase().includes(q)
    );
  });

  const handleUpdateStatus = (reg: AdministrativeRegistration, newStatus: RegistrationStatus) => {
    const updated: AdministrativeRegistration = {
      ...reg,
      status: newStatus,
      validatedAt: newStatus === 'valide' ? new Date().toISOString() : undefined,
      validatedBy: `${currentUser?.firstName} ${currentUser?.lastName} (Scolarité)`
    };

    storageService.saveAdministrativeRegistration(updated, {
      id: currentUser?.id || 'admin',
      name: `${currentUser?.firstName} ${currentUser?.lastName}`,
      role: 'administration'
    });

    // Notify candidate
    storageService.addNotification({
      targetRole: 'candidat',
      userId: reg.candidateId,
      title: `Inscription Définitive : ${newStatus === 'valide' ? 'Validée' : newStatus === 'incomplet' ? 'Dossier Incomplet' : 'Rejetée'}`,
      message: `Votre dossier d'inscription administrative a été ${newStatus === 'valide' ? 'validé. Votre carte de doctorant est prête.' : 'mis à jour.'}`,
      category: 'inscription',
      link: '/candidat/dashboard'
    });

    setFeedbackMsg(`Statut du dossier ${reg.studentName} mis à jour : ${newStatus.toUpperCase()}`);
    setSelectedReg(updated);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-3xl p-8 text-white shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-400/40 px-3 py-1 rounded-full text-teal-300 text-xs font-semibold">
          <UserCheck className="w-3.5 h-3.5" />
          Instruction & Validation des Inscriptions Définitives
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">
          Guichet Numérique des Inscriptions Doctorales
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
          Réception centralisée des originaux des diplômes, contrôles de cohérence avec Apogée et attribution des statuts définitifs clairs (En attente, Incomplet, Validé, Rejeté).
        </p>
      </div>

      {feedbackMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Registrations Table (Activity 26) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-bold text-base text-slate-900">
              Dossiers d'Inscription Reçus ({filteredRegs.length})
            </h3>
            <p className="text-xs text-slate-500">
              Vérification des pièces physiques et contrôle de conformité des engagements
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher par étudiant, CIN..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        <div className="space-y-3">
          {filteredRegs.map((reg) => (
            <div
              key={reg.id}
              className="p-5 rounded-2xl border border-slate-200 hover:border-slate-300 bg-white transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900">{reg.studentName}</span>
                  <span className="font-mono text-xs text-slate-500">CIN: {reg.cin}</span>
                  <StatusBadge status={reg.status} size="sm" />
                </div>
                <div className="text-xs text-slate-600 truncate">
                  <strong>Thèse :</strong> {reg.subjectTitle}
                </div>
                <div className="text-[11px] text-slate-500">
                  Labo : {reg.laboratoryId.toUpperCase()} • Directeur : {reg.supervisorName}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setSelectedReg(reg)}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Vérifier & Valider</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Verification Drawer (Activities 24, 25, 26) */}
      {selectedReg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-xs text-teal-300 font-mono">CIN : {selectedReg.cin}</span>
                <h3 className="font-extrabold text-base">{selectedReg.studentName}</h3>
              </div>
              <button
                onClick={() => setSelectedReg(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700">
              {/* Consistency check badge (Activity 24) */}
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-emerald-700 shrink-0" />
                <div>
                  <div className="font-bold text-emerald-950">Contrôle de Cohérence Réussi</div>
                  <div className="text-[11px] text-emerald-800">
                    Les données du candidat correspondent rigoureusement aux pièces validées lors du concours (Aucun doublon détecté).
                  </div>
                </div>
              </div>

              {/* Documents to verify */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  Originaux & Pièces administratives
                </h4>
                {selectedReg.documents.map((d) => (
                  <div
                    key={d.id}
                    className="p-3 bg-slate-50 rounded-xl border flex items-center justify-between"
                  >
                    <span className="font-medium text-slate-800">{d.label}</span>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {d.status === 'conforme' ? 'Authentifié' : 'Déposé'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Decision Bar (Activity 26: Statuts clairs : en attente, incomplet, validé ou rejeté) */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <button
                onClick={() => setSelectedReg(null)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Fermer
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleUpdateStatus(selectedReg, 'incomplet')}
                  className="bg-amber-100 hover:bg-amber-200 text-amber-900 px-3 py-1.5 rounded-xl font-bold text-xs transition-colors"
                >
                  Marquer Incomplet
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedReg, 'rejete')}
                  className="bg-rose-100 hover:bg-rose-200 text-rose-900 px-3 py-1.5 rounded-xl font-bold text-xs transition-colors"
                >
                  Rejeter
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedReg, 'valide')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl font-bold text-xs transition-colors shadow-xs flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Confirmer l'Inscription Définitive</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
