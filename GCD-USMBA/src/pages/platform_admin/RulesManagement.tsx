import React, { useState } from 'react';
import {
  Sliders,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Clock,
  Layers,
  Search,
  Filter,
  Save,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { DoctoralRule, DocumentType } from '../../types';

export const RulesManagement: React.FC = () => {
  const { currentUser } = useAuth();
  const [rules, setRules] = useState<DoctoralRule[]>(() => storageService.getRules());
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Create / Edit modal state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingRule, setEditingRule] = useState<Partial<DoctoralRule> | null>(null);

  const refreshRules = () => {
    setRules(storageService.getRules());
  };

  const handleToggle = (id: string) => {
    storageService.toggleRuleStatus(id, {
      id: currentUser?.id || 'admin',
      name: `${currentUser?.firstName} ${currentUser?.lastName}`,
      role: 'responsable_gcd'
    });
    refreshRules();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Confirmez-vous la suppression de cette règle de gestion ?')) {
      storageService.deleteRule(id, {
        id: currentUser?.id || 'admin',
        name: `${currentUser?.firstName} ${currentUser?.lastName}`,
        role: 'responsable_gcd'
      });
      refreshRules();
    }
  };

  const handleOpenCreate = () => {
    setEditingRule({
      id: `rule-${Date.now()}`,
      code: `REG-${Math.floor(100 + Math.random() * 900)}`,
      title: '',
      category: 'admission',
      description: '',
      conditionDescription: '',
      minimumScoreThreshold: 12,
      isActive: true,
      mandatoryDocuments: ['cin', 'bac', 'licence', 'master'],
      createdBy: `${currentUser?.firstName} ${currentUser?.lastName}`
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (rule: DoctoralRule) => {
    setEditingRule({ ...rule });
    setIsModalOpen(true);
  };

  const handleSaveRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRule || !editingRule.title || !editingRule.code) return;

    const fullRule: DoctoralRule = {
      id: editingRule.id || `rule-${Date.now()}`,
      code: editingRule.code.toUpperCase(),
      title: editingRule.title,
      category: editingRule.category || 'admission',
      description: editingRule.description || '',
      conditionDescription: editingRule.conditionDescription || '',
      minimumScoreThreshold: editingRule.minimumScoreThreshold ? Number(editingRule.minimumScoreThreshold) : undefined,
      deadlineDate: editingRule.deadlineDate || undefined,
      mandatoryDocuments: editingRule.mandatoryDocuments || [],
      isActive: editingRule.isActive ?? true,
      applicableEstablishments: editingRule.applicableEstablishments || [],
      createdBy: editingRule.createdBy || 'CEDoc USMBA',
      updatedAt: new Date().toISOString()
    };

    storageService.saveRule(fullRule, {
      id: currentUser?.id || 'admin',
      name: `${currentUser?.firstName} ${currentUser?.lastName}`,
      role: 'responsable_gcd'
    });

    setIsModalOpen(false);
    setEditingRule(null);
    refreshRules();
  };

  const filteredRules = rules.filter((r) => {
    const matchesCategory = filterCategory === 'all' || r.category === filterCategory;
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-400/40 px-3 py-1 rounded-full text-teal-300 text-xs font-semibold">
            <Sliders className="w-3.5 h-3.5" />
            Module A — Moteur de Règles Opérationnelles GCD
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Gestion des Règles Doctorales
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
            Définissez, paramétrez et activez en temps réel les conditions d'admission, délais limites, pièces obligatoires et seuils minimaux appliqués sur l'ensemble du cycle.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-5 py-3 rounded-2xl text-xs transition-all shadow-md flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4 text-slate-950" />
          <span>Nouvelle Règle de Gestion</span>
        </button>
      </div>

      {/* Filters and search */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par code, intitulé..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          {['all', 'admission', 'delais', 'pieces_justificatives', 'seuils_selection', 'reinscription'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                filterCategory === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'all'
                ? 'Toutes les catégories'
                : cat === 'admission'
                ? 'Admission'
                : cat === 'delais'
                ? 'Délais'
                : cat === 'pieces_justificatives'
                ? 'Pièces'
                : cat === 'seuils_selection'
                ? 'Seuils'
                : 'Réinscription'}
            </button>
          ))}
        </div>
      </div>

      {/* Rules list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRules.map((rule) => (
          <div
            key={rule.id}
            className={`p-6 rounded-3xl border transition-all shadow-xs flex flex-col justify-between space-y-4 ${
              rule.isActive ? 'bg-white border-slate-200' : 'bg-slate-50/70 border-slate-200 opacity-70'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded">
                    {rule.code}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                    {rule.category}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleToggle(rule.id)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 transition-colors ${
                      rule.isActive
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${rule.isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                    {rule.isActive ? 'Active' : 'Désactivée'}
                  </button>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-sm text-slate-900">{rule.title}</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{rule.description}</p>
              </div>

              {rule.conditionDescription && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-700 font-medium">
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">Condition d'application :</span>
                  {rule.conditionDescription}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-500 font-mono">
                {rule.minimumScoreThreshold && (
                  <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-semibold text-teal-800">
                    Seuil minimal : {rule.minimumScoreThreshold}/20
                  </span>
                )}
                {rule.deadlineDate && (
                  <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    Date limite : {rule.deadlineDate}
                  </span>
                )}
                {rule.mandatoryDocuments && rule.mandatoryDocuments.length > 0 && (
                  <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {rule.mandatoryDocuments.length} pièces obligatoires
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
              <span className="text-[10px] text-slate-400">
                Auteur : {rule.createdBy}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(rule)}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-slate-900"
                  title="Modifier la règle"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(rule.id)}
                  className="p-1.5 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600"
                  title="Supprimer la règle"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Create Modal */}
      {isModalOpen && editingRule && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">
                {editingRule.id ? 'Paramétrage de la Règle' : 'Créer une Nouvelle Règle'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveRule} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Code Règle *</label>
                  <input
                    type="text"
                    required
                    value={editingRule.code || ''}
                    onChange={(e) => setEditingRule({ ...editingRule, code: e.target.value.toUpperCase() })}
                    placeholder="REG-ADMISSION-01"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono uppercase font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Catégorie *</label>
                  <select
                    value={editingRule.category || 'admission'}
                    onChange={(e) => setEditingRule({ ...editingRule, category: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  >
                    <option value="admission">Conditions d'admission</option>
                    <option value="delais">Délais limites</option>
                    <option value="pieces_justificatives">Pièces obligatoires</option>
                    <option value="seuils_selection">Seuils minimaux de sélection</option>
                    <option value="reinscription">Réinscription & Formations</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Intitulé de la règle *</label>
                <input
                  type="text"
                  required
                  value={editingRule.title || ''}
                  onChange={(e) => setEditingRule({ ...editingRule, title: e.target.value })}
                  placeholder="Ex : Seuil d'admissibilité au Master"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description réglementaire</label>
                <textarea
                  rows={2}
                  value={editingRule.description || ''}
                  onChange={(e) => setEditingRule({ ...editingRule, description: e.target.value })}
                  placeholder="Énoncé légal ou universitaire officiel..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Condition technique d'application</label>
                <input
                  type="text"
                  value={editingRule.conditionDescription || ''}
                  onChange={(e) => setEditingRule({ ...editingRule, conditionDescription: e.target.value })}
                  placeholder="Ex : Note finale >= 14/20 ou pièces complètes sous 5 jours..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Seuil minimal (note /20)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="20"
                    value={editingRule.minimumScoreThreshold ?? ''}
                    onChange={(e) => setEditingRule({ ...editingRule, minimumScoreThreshold: Number(e.target.value) })}
                    placeholder="14"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date limite si applicable</label>
                  <input
                    type="date"
                    value={editingRule.deadlineDate || ''}
                    onChange={(e) => setEditingRule({ ...editingRule, deadlineDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActiveCheck"
                  checked={editingRule.isActive ?? true}
                  onChange={(e) => setEditingRule({ ...editingRule, isActive: e.target.checked })}
                  className="rounded text-teal-600"
                />
                <label htmlFor="isActiveCheck" className="text-xs font-semibold text-slate-700">
                  Activer immédiatement cette règle dans les calculs et filtres
                </label>
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
                  <span>Enregistrer la règle</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
