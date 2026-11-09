import React, { useState } from 'react';
import {
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Eye,
  Filter,
  Search,
  UserCheck,
  Building2,
  Calendar,
  X
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { AnnualReRegistration, ReRegistrationStatus } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';

export const AdminReRegistrationQueue: React.FC = () => {
  const { currentUser } = useAuth();
  const reRegistrations = storageService.getAnnualReRegistrations();

  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<AnnualReRegistration | null>(null);

  const filteredList = reRegistrations.filter((r) => {
    const matchesPriority = filterPriority === 'all' || r.priority === filterPriority;
    const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
    return matchesPriority && matchesStatus;
  });

  const handleValidate = (reReg: AnnualReRegistration) => {
    const updated: AnnualReRegistration = {
      ...reReg,
      status: 'valide'
    };
    storageService.saveAnnualReRegistration(updated, {
      id: currentUser?.id || 'admin',
      name: `${currentUser?.firstName} ${currentUser?.lastName}`,
      role: 'administration'
    });

    storageService.addNotification({
      targetRole: 'doctorant',
      userId: reReg.studentId,
      title: `Réinscription Annuelle Validée (${reReg.thesisYear}ème année)`,
      message: `Votre réinscription pour l'année universitaire ${reReg.academicYear} a été visée et validée par l'administration.`,
      category: 'reinscription',
      link: '/doctorant/dashboard'
    });

    setSelectedItem(updated);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-3xl p-8 text-white shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-400/40 px-3 py-1 rounded-full text-teal-300 text-xs font-semibold">
          <FileSpreadsheet className="w-3.5 h-3.5" />
          Instruction & Suivi des Réinscriptions Annuelles
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">
          Instruction des Réinscriptions Annuelles (2e à 6e Année)
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
          Traitement optimisé évitant l'accumulation des dossiers : priorisation automatique par échéance de forclusion, vérification des avis de directeurs et validation des heures de formation doctorale.
        </p>
      </div>

      {/* Filters by Priority & Status (Activity 29) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Priorité :</span>
          <button
            onClick={() => setFilterPriority('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filterPriority === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Toutes les priorités
          </button>
          <button
            onClick={() => setFilterPriority('critique')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filterPriority === 'critique'
                ? 'bg-rose-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Critique (&lt; 5j)
          </button>
          <button
            onClick={() => setFilterPriority('urgente')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filterPriority === 'urgente'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Urgente
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Statut :</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="avis_directeur_donne">Avis Directeur Accordé</option>
            <option value="en_cours_verification">En Vérification</option>
            <option value="valide">Validé</option>
          </select>
        </div>
      </div>

      {/* Queue Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 text-[11px] font-bold text-slate-600 uppercase border-b">
              <th className="py-3 px-4">Doctorant (Année Thèse)</th>
              <th className="py-3 px-4">Directeur & Laboratoire</th>
              <th className="py-3 px-4">Avancement / Heures</th>
              <th className="py-3 px-4">Priorité</th>
              <th className="py-3 px-4">Statut</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filteredList.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/70">
                <td className="py-3.5 px-4 space-y-0.5">
                  <div className="font-bold text-slate-900">{item.studentName}</div>
                  <div className="text-[11px] text-teal-700 font-semibold">
                    Inscription en {item.thesisYear}ème année
                  </div>
                  <div className="font-mono text-[10px] text-slate-400">CIN: {item.cin}</div>
                </td>

                <td className="py-3.5 px-4 space-y-0.5">
                  <div className="font-medium text-slate-900">{item.supervisorName}</div>
                  <div className="text-[11px] text-slate-500">Labo : {item.laboratoryId.toUpperCase()}</div>
                </td>

                <td className="py-3.5 px-4 space-y-0.5">
                  <div className="font-bold text-slate-900">
                    {item.trainingHoursCompleted} h validées
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {item.articlesPublishedCount} article(s) • {item.conferencesCount} conf.
                  </div>
                </td>

                <td className="py-3.5 px-4">
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                      item.priority === 'critique'
                        ? 'bg-rose-100 text-rose-800'
                        : item.priority === 'urgente'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {item.priority}
                  </span>
                </td>

                <td className="py-3.5 px-4">
                  <StatusBadge status={item.status} size="sm" />
                </td>

                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => setSelectedItem(item)}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs transition-colors inline-flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Examiner</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-xs text-teal-300 font-bold">
                  Réinscription {selectedItem.thesisYear}ème Année
                </span>
                <h3 className="font-extrabold text-base">{selectedItem.studentName}</h3>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700">
              <div className="bg-slate-50 p-4 rounded-xl border space-y-1">
                <span className="text-slate-400 font-semibold block">Sujet de thèse</span>
                <div className="font-bold text-slate-900">{selectedItem.thesisTitle}</div>
                <div className="text-slate-500">Directeur : {selectedItem.supervisorName}</div>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-slate-900">Rapport d'avancement synthétique</span>
                <p className="bg-slate-50 p-3 rounded-xl border leading-relaxed">
                  {selectedItem.progressSummary}
                </p>
              </div>

              {selectedItem.supervisorComment && (
                <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-teal-900">
                  <strong>Avis du directeur de thèse :</strong> {selectedItem.supervisorComment}
                </div>
              )}

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900">Pièces justificatives jointes</h4>
                {selectedItem.documents.map((d) => (
                  <div key={d.id} className="p-2.5 bg-slate-50 rounded-lg border flex items-center justify-between">
                    <span>{d.label}</span>
                    <span className="font-bold text-emerald-700">{d.status}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t flex items-center justify-between">
              <button
                onClick={() => setSelectedItem(null)}
                className="text-xs text-slate-500 font-semibold"
              >
                Fermer
              </button>

              <button
                onClick={() => handleValidate(selectedItem)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2 rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Valider la Réinscription Annuelle</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
