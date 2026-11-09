import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  BookOpen,
  Building2,
  Users,
  Calendar,
  CheckCircle2,
  Tag,
  ArrowRight,
  X,
  FileText,
  Sparkles
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { ESTABLISHMENTS, LABORATORIES } from '../../data/seedData';
import { DoctoralSubject } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../../components/common/StatusBadge';

export const Catalog: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEstablishment, setSelectedEstablishment] = useState('all');
  const [selectedLaboratory, setSelectedLaboratory] = useState('all');
  const [selectedDiscipline, setSelectedDiscipline] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState<DoctoralSubject | null>(null);

  const { switchRoleQuick } = useAuth();
  const navigate = useNavigate();

  const allSubjects = storageService.getSubjects().filter((s) => s.status === 'valide');

  const disciplines = Array.from(new Set(allSubjects.map((s) => s.discipline)));

  const filteredSubjects = allSubjects.filter((sub) => {
    const matchesEstablishment =
      selectedEstablishment === 'all' || sub.establishmentId === selectedEstablishment;
    const matchesLab =
      selectedLaboratory === 'all' || sub.laboratoryId === selectedLaboratory;
    const matchesDiscipline =
      selectedDiscipline === 'all' || sub.discipline === selectedDiscipline;

    const q = searchQuery.toLowerCase();
    const matchesSearch =
      sub.title.toLowerCase().includes(q) ||
      sub.abstract.toLowerCase().includes(q) ||
      sub.supervisorName.toLowerCase().includes(q) ||
      sub.keywords.some((k) => k.toLowerCase().includes(q));

    return matchesEstablishment && matchesLab && matchesDiscipline && matchesSearch;
  });

  const handleApply = (subjectId: string) => {
    switchRoleQuick('candidat');
    navigate(`/candidat/postuler?subjectId=${subjectId}`);
  };

  const getEstablishmentName = (id: string) => {
    return ESTABLISHMENTS.find((e) => e.id === id)?.shortName || id;
  };

  const getLaboratoryName = (id: string) => {
    return LABORATORIES.find((l) => l.id === id)?.name || id;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-3xl p-8 text-white shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-400/40 px-3 py-1 rounded-full text-teal-300 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          Catalogue Officiel des Sujets de Doctorat
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">
          Catalogue des Sujets de Recherche 2026-2027
        </h1>
        <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
          Consultez l'ensemble des thématiques de recherche validées par les commissions des laboratoires accrédités de l'USMBA. Utilisez les filtres pour cibler les sujets en adéquation avec votre cursus.
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par titre, mots-clés (ex: Deep Learning, Solaire), directeur de thèse..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Établissement */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Établissement USMBA
            </label>
            <select
              value={selectedEstablishment}
              onChange={(e) => {
                setSelectedEstablishment(e.target.value);
                setSelectedLaboratory('all');
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
            >
              <option value="all">Tous les établissements</option>
              {ESTABLISHMENTS.map((est) => (
                <option key={est.id} value={est.id}>
                  {est.shortName} — {est.name}
                </option>
              ))}
            </select>
          </div>

          {/* Laboratoire */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Laboratoire de Recherche
            </label>
            <select
              value={selectedLaboratory}
              onChange={(e) => setSelectedLaboratory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
            >
              <option value="all">Tous les laboratoires</option>
              {LABORATORIES.filter(
                (l) => selectedEstablishment === 'all' || l.establishmentId === selectedEstablishment
              ).map((lab) => (
                <option key={lab.id} value={lab.id}>
                  {lab.code} — {lab.name}
                </option>
              ))}
            </select>
          </div>

          {/* Discipline */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Discipline / Spécialité
            </label>
            <select
              value={selectedDiscipline}
              onChange={(e) => setSelectedDiscipline(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
            >
              <option value="all">Toutes les disciplines</option>
              {disciplines.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active results counter */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <div>
            <strong>{filteredSubjects.length}</strong> sujet(s) de doctorat trouvé(s)
          </div>
          {(selectedEstablishment !== 'all' || selectedLaboratory !== 'all' || selectedDiscipline !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedEstablishment('all');
                setSelectedLaboratory('all');
                setSelectedDiscipline('all');
                setSearchQuery('');
              }}
              className="text-teal-700 hover:underline font-semibold"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSubjects.map((sub) => (
          <div
            key={sub.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md hover:border-slate-300 transition-all space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full">
                  {sub.discipline}
                </span>
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {getEstablishmentName(sub.establishmentId)}
                </span>
              </div>

              <h3 className="font-bold text-base text-slate-900 leading-snug line-clamp-2">
                {sub.title}
              </h3>

              <div className="text-xs text-slate-500 space-y-1">
                <div className="flex items-center gap-1.5 font-medium text-slate-700">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>Directeur : {sub.supervisorName}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{getLaboratoryName(sub.laboratoryId)}</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                {sub.abstract}
              </p>

              {/* Keywords */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {sub.keywords.map((kw, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
                  >
                    #{kw}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                onClick={() => setSelectedSubject(sub)}
                className="text-xs font-semibold text-slate-700 hover:text-slate-900 hover:underline inline-flex items-center gap-1"
              >
                <FileText className="w-3.5 h-3.5" />
                Voir la fiche complète
              </button>

              <button
                onClick={() => handleApply(sub.id)}
                className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl font-bold text-xs transition-colors shadow-xs"
              >
                <span>Choisir & Postuler</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {filteredSubjects.length === 0 && (
          <div className="col-span-2 text-center py-16 bg-white rounded-2xl border border-slate-200 space-y-3">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-800 text-sm">Aucun sujet ne correspond à vos critères</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Essayez de modifier votre recherche ou de réinitialiser les filtres pour consulter l'ensemble des sujets disponibles.
            </p>
          </div>
        )}
      </div>

      {/* Detailed Modal */}
      {selectedSubject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden">
            <div className="p-6 bg-slate-900 text-white flex items-start justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-teal-300 bg-teal-900/80 border border-teal-700 px-2.5 py-0.5 rounded-full">
                    {selectedSubject.discipline}
                  </span>
                  <span className="text-xs text-slate-300">Année : {selectedSubject.academicYear}</span>
                </div>
                <h2 className="text-lg sm:text-xl font-extrabold leading-tight">
                  {selectedSubject.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedSubject(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 font-semibold block">Établissement</span>
                  <span className="font-bold text-slate-900">{getEstablishmentName(selectedSubject.establishmentId)}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block">Laboratoire</span>
                  <span className="font-bold text-slate-900">{getLaboratoryName(selectedSubject.laboratoryId)}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block">Directeur de Thèse</span>
                  <span className="font-bold text-slate-900">{selectedSubject.supervisorName}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block">Places ouvertes</span>
                  <span className="font-bold text-teal-700">{selectedSubject.maxCandidates} candidat(s)</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-sm text-slate-900">Résumé et Contexte de la Thèse</h4>
                <p className="text-slate-600 leading-relaxed text-xs sm:text-sm bg-slate-50/50 p-3.5 rounded-xl border border-slate-100">
                  {selectedSubject.abstract}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-sm text-slate-900">Objectifs de la Recherche</h4>
                <p className="text-slate-600 leading-relaxed">
                  {selectedSubject.objectives}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-sm text-slate-900">Profil Recherché & Prérequis Exigés</h4>
                <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200 text-amber-900 leading-relaxed">
                  {selectedSubject.prerequisites}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-sm text-slate-900">Mots-clés</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedSubject.keywords.map((kw, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-slate-100 text-slate-800 font-medium px-3 py-1 rounded-lg border border-slate-200"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => setSelectedSubject(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Fermer
              </button>

              <button
                onClick={() => {
                  setSelectedSubject(null);
                  handleApply(selectedSubject.id);
                }}
                className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-colors flex items-center gap-2 shadow-xs"
              >
                <span>Choisir ce sujet et déposer ma candidature</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
