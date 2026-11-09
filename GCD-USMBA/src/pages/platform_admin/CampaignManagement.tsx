import React, { useState } from 'react';
import {
  Calendar,
  Plus,
  Edit2,
  CheckCircle2,
  XCircle,
  Clock,
  Layers,
  Save,
  Building2,
  Users,
  Search,
  Filter,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { DoctoralCampaign } from '../../types';
import { ESTABLISHMENTS } from '../../data/seedData';

export const CampaignManagement: React.FC = () => {
  const { currentUser } = useAuth();
  const [campaigns, setCampaigns] = useState<DoctoralCampaign[]>(() => storageService.getCampaigns());
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingCampaign, setEditingCampaign] = useState<Partial<DoctoralCampaign> | null>(null);

  const refreshCampaigns = () => {
    setCampaigns(storageService.getCampaigns());
  };

  const handleToggleStatus = (campaign: DoctoralCampaign) => {
    const nextStatus = campaign.status === 'ouverte' ? 'cloturee' : 'ouverte';
    const updated = { ...campaign, status: nextStatus as any };
    storageService.saveCampaign(updated, {
      id: currentUser?.id || 'admin',
      name: `${currentUser?.firstName} ${currentUser?.lastName}`,
      role: 'responsable_gcd'
    });
    refreshCampaigns();
  };

  const handleOpenCreate = () => {
    setEditingCampaign({
      id: `camp-${Date.now()}`,
      code: `CAMP-USMBA-${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
      title: `Campagne Doctorale ${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
      academicYear: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 60 * 24 * 3600 * 1000).toISOString().split('T')[0],
      status: 'en_preparation',
      totalQuota: 200,
      openEstablishments: ESTABLISHMENTS.map((e) => e.id),
      currentApplicationsCount: 0,
      admittedCount: 0,
      description: 'Campagne officielle d\'admission et de sélection au cycle doctoral CEDoc USMBA.'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (camp: DoctoralCampaign) => {
    setEditingCampaign({ ...camp });
    setIsModalOpen(true);
  };

  const handleSaveCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCampaign || !editingCampaign.title || !editingCampaign.code) return;

    const fullCampaign: DoctoralCampaign = {
      id: editingCampaign.id || `camp-${Date.now()}`,
      code: editingCampaign.code.toUpperCase(),
      title: editingCampaign.title,
      academicYear: editingCampaign.academicYear || '2026-2027',
      startDate: editingCampaign.startDate || new Date().toISOString().split('T')[0],
      endDate: editingCampaign.endDate || new Date().toISOString().split('T')[0],
      status: editingCampaign.status || 'en_preparation',
      totalQuota: Number(editingCampaign.totalQuota || 150),
      openEstablishments: editingCampaign.openEstablishments || ESTABLISHMENTS.map((e) => e.id),
      currentApplicationsCount: editingCampaign.currentApplicationsCount || 0,
      admittedCount: editingCampaign.admittedCount || 0,
      description: editingCampaign.description || '',
      createdAt: editingCampaign.createdAt || new Date().toISOString()
    };

    storageService.saveCampaign(fullCampaign, {
      id: currentUser?.id || 'admin',
      name: `${currentUser?.firstName} ${currentUser?.lastName}`,
      role: 'responsable_gcd'
    });

    setIsModalOpen(false);
    setEditingCampaign(null);
    refreshCampaigns();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-400/40 px-3 py-1 rounded-full text-teal-300 text-xs font-semibold">
            <Calendar className="w-3.5 h-3.5" />
            Module B — Pilotage des Campagnes Doctorales USMBA
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Gestion des Campagnes Doctorales
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
            Créez les sessions annuelles d'admission, fixez les calendriers d'ouverture et de clôture, définissez les quotas d'accueil et supervisez les flux de candidatures.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-5 py-3 rounded-2xl text-xs transition-all shadow-md flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4 text-slate-950" />
          <span>Nouvelle Campagne Doctorale</span>
        </button>
      </div>

      {/* Campaigns list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {campaigns.map((camp) => {
          const isOpen = camp.status === 'ouverte';
          const isClosed = camp.status === 'cloturee';

          return (
            <div
              key={camp.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200 px-2.5 py-0.5 rounded-md">
                    {camp.code}
                  </span>

                  <button
                    onClick={() => handleToggleStatus(camp)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-colors flex items-center gap-1.5 ${
                      isOpen
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                        : isClosed
                        ? 'bg-slate-100 text-slate-600 border border-slate-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-300'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                    <span>
                      {isOpen ? 'Campagne Ouverte' : isClosed ? 'Campagne Clôturée' : 'En préparation'}
                    </span>
                  </button>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900">{camp.title}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{camp.description}</p>
                </div>

                {/* Dates and Quota Grid */}
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Début</span>
                    <span className="font-bold text-slate-800">{camp.startDate}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Clôture</span>
                    <span className="font-bold text-slate-800">{camp.endDate}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Quota général</span>
                    <span className="font-bold text-teal-800">{camp.totalQuota} places</span>
                  </div>
                </div>

                {/* Progress metrics */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>Dossiers reçus : {camp.currentApplicationsCount}</span>
                    <span>Admis validés : {camp.admittedCount}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-teal-600 h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, Math.round((camp.admittedCount / (camp.totalQuota || 1)) * 100))}%`
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs">
                <span className="text-slate-500">Année : {camp.academicYear}</span>
                <button
                  onClick={() => handleOpenEdit(camp)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3.5 py-1.5 rounded-xl transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Modifier le paramétrage</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {isModalOpen && editingCampaign && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">
                Paramétrage de la Campagne Doctorale
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCampaign} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Code Campagne *</label>
                  <input
                    type="text"
                    required
                    value={editingCampaign.code || ''}
                    onChange={(e) => setEditingCampaign({ ...editingCampaign, code: e.target.value.toUpperCase() })}
                    placeholder="CAMP-USMBA-2026-2027"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono uppercase font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Année Universitaire *</label>
                  <input
                    type="text"
                    required
                    value={editingCampaign.academicYear || ''}
                    onChange={(e) => setEditingCampaign({ ...editingCampaign, academicYear: e.target.value })}
                    placeholder="2026-2027"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Titre officiel de la campagne *</label>
                <input
                  type="text"
                  required
                  value={editingCampaign.title || ''}
                  onChange={(e) => setEditingCampaign({ ...editingCampaign, title: e.target.value })}
                  placeholder="Ex : Campagne Doctorale Officielle 2026-2027"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date d'ouverture *</label>
                  <input
                    type="date"
                    required
                    value={editingCampaign.startDate || ''}
                    onChange={(e) => setEditingCampaign({ ...editingCampaign, startDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date de clôture *</label>
                  <input
                    type="date"
                    required
                    value={editingCampaign.endDate || ''}
                    onChange={(e) => setEditingCampaign({ ...editingCampaign, endDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Quota général de places *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={editingCampaign.totalQuota || 200}
                    onChange={(e) => setEditingCampaign({ ...editingCampaign, totalQuota: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Statut initial *</label>
                  <select
                    value={editingCampaign.status || 'en_preparation'}
                    onChange={(e) => setEditingCampaign({ ...editingCampaign, status: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  >
                    <option value="ouverte">Ouverte (Candidatures permises)</option>
                    <option value="en_preparation">En préparation</option>
                    <option value="cloturee">Clôturée</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description & Consignes</label>
                <textarea
                  rows={2}
                  value={editingCampaign.description || ''}
                  onChange={(e) => setEditingCampaign({ ...editingCampaign, description: e.target.value })}
                  placeholder="Instructions destinées aux directeurs de thèse et candidats..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Enregistrer la campagne</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
