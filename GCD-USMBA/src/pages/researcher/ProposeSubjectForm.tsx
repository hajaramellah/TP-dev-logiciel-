import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Users,
  Send,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { ESTABLISHMENTS, LABORATORIES } from '../../data/seedData';
import { DoctoralSubject } from '../../types';

export const ProposeSubjectForm: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    discipline: 'Informatique & IA',
    establishmentId: currentUser?.establishmentId || 'fsdm',
    laboratoryId: currentUser?.laboratoryId || 'lisac',
    coSupervisorName: '',
    maxCandidates: 1,
    abstract: '',
    objectives: '',
    methodology: '',
    prerequisites: '',
    keywordsInput: 'Edge AI, Deep Learning, IoT'
  });

  const [submittedSubject, setSubmittedSubject] = useState<DoctoralSubject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.title || !formData.abstract || !formData.objectives || !formData.prerequisites) {
      setErrorMsg('Veuillez compléter l\'ensemble des champs obligatoires marqués d\'un astérisque.');
      return;
    }

    const keywords = formData.keywordsInput
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);

    const newSubject: DoctoralSubject = {
      id: `suj-${Date.now()}`,
      title: formData.title,
      discipline: formData.discipline,
      establishmentId: formData.establishmentId,
      laboratoryId: formData.laboratoryId,
      supervisorId: currentUser?.id || 'usr-chercheur-1',
      supervisorName: `Pr. ${currentUser?.firstName} ${currentUser?.lastName}`,
      coSupervisorName: formData.coSupervisorName || undefined,
      abstract: formData.abstract,
      objectives: formData.objectives,
      methodology: formData.methodology,
      prerequisites: formData.prerequisites,
      keywords,
      maxCandidates: Number(formData.maxCandidates),
      status: 'en_attente_validation',
      submissionDate: new Date().toISOString(),
      academicYear: '2026-2027'
    };

    storageService.saveSubject(newSubject, {
      id: currentUser?.id || 'chercheur',
      name: `Pr. ${currentUser?.firstName} ${currentUser?.lastName}`,
      role: 'enseignant_chercheur'
    });

    // Notify lab manager
    storageService.addNotification({
      targetRole: 'responsable_labo',
      title: 'Nouveau sujet doctoral soumis pour visa',
      message: `Le Pr. ${currentUser?.lastName} a soumis le sujet "${newSubject.title.substring(0, 40)}..." pour validation par le laboratoire.`,
      category: 'sujet',
      link: '/labo/validation-sujets'
    });

    setSubmittedSubject(newSubject);
  };

  if (submittedSubject) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-6">
        <div className="bg-white rounded-3xl border border-emerald-200 shadow-xl p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-emerald-950">
            Proposition de Sujet Enregistrée avec Succès !
          </h2>
          <p className="text-xs text-emerald-800 max-w-md mx-auto leading-relaxed">
            Votre proposition est transmise dans le circuit numérique de validation du laboratoire{' '}
            <strong>{submittedSubject.laboratoryId.toUpperCase()}</strong>. Dès approbation par le directeur du laboratoire, le sujet sera automatiquement publié au catalogue général.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/chercheur/dashboard"
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-colors shadow-xs"
            >
              Retour à mon tableau de bord
            </Link>
            <Link
              to="/labo/dashboard"
              className="bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-50 font-bold px-5 py-2.5 rounded-xl text-xs transition-colors"
            >
              Voir la vue Direction de Laboratoire
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-3xl p-8 text-white shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-400/40 px-3 py-1 rounded-full text-teal-300 text-xs font-semibold">
          <FileText className="w-3.5 h-3.5" />
          Formulaire Standardisé de Proposition de Sujet
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">
          Proposition d'un Sujet de Recherche Doctorale
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
          Norme de saisie unifiée garantissant l'exhaustivité des informations (objectifs, méthodologie, prérequis) avant soumission au circuit de validation du laboratoire.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Intitulé complet du sujet de thèse <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            placeholder="ex: Sécurisation Post-Quantique des Systèmes IoT Médicaux..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 font-semibold"
          />
        </div>

        {/* Establishments & Lab & Discipline */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Discipline / Spécialité <span className="text-rose-500">*</span>
            </label>
            <select
              name="discipline"
              value={formData.discipline}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="Informatique & IA">Informatique & IA</option>
              <option value="Physique des Matériaux">Physique des Matériaux</option>
              <option value="Cybersécurité">Cybersécurité</option>
              <option value="Économie Appliquée">Économie Appliquée</option>
              <option value="Biologie Moléculaire">Biologie Moléculaire</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Établissement USMBA <span className="text-rose-500">*</span>
            </label>
            <select
              name="establishmentId"
              value={formData.establishmentId}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {ESTABLISHMENTS.map((est) => (
                <option key={est.id} value={est.id}>
                  {est.shortName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Laboratoire de Rattachement <span className="text-rose-500">*</span>
            </label>
            <select
              name="laboratoryId"
              value={formData.laboratoryId}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {LABORATORIES.map((lab) => (
                <option key={lab.id} value={lab.id}>
                  {lab.code} ({lab.establishmentId.toUpperCase()})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Co-supervisor & Max Candidates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Co-Directeur de Thèse (Facultatif)
            </label>
            <input
              type="text"
              name="coSupervisorName"
              value={formData.coSupervisorName}
              onChange={handleChange}
              placeholder="ex: Pr. Fatima-Zahra BENCHEIKH"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Nombre de bourses / places maximales <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              max="3"
              name="maxCandidates"
              value={formData.maxCandidates}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Abstract */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Résumé synthétique & Problématique scientifique <span className="text-rose-500">*</span>
          </label>
          <textarea
            name="abstract"
            rows={4}
            required
            value={formData.abstract}
            onChange={handleChange}
            placeholder="Décrivez le contexte scientifique, la problématique et l'état de l'art..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Objectives */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Objectifs de recherche attendus <span className="text-rose-500">*</span>
          </label>
          <textarea
            name="objectives"
            rows={3}
            required
            value={formData.objectives}
            onChange={handleChange}
            placeholder="1. Développement d'un cadre algorithmique. 2. Expérimentations et validations comparatives..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Methodology */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Méthodologie de recherche envisagée
          </label>
          <textarea
            name="methodology"
            rows={3}
            value={formData.methodology}
            onChange={handleChange}
            placeholder="Démarche expérimentale, outils numériques, plateformes matérielles ou cohortes..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Prerequisites */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Profil du candidat et prérequis académiques <span className="text-rose-500">*</span>
          </label>
          <textarea
            name="prerequisites"
            rows={3}
            required
            value={formData.prerequisites}
            onChange={handleChange}
            placeholder="Master ou diplôme d'ingénieur en... Solides compétences en... Maîtrise des outils..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Keywords */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Mots-clés (séparés par des virgules) <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="keywordsInput"
            required
            value={formData.keywordsInput}
            onChange={handleChange}
            placeholder="ex: Deep Learning, Cybersécurité, Vision"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <Link
            to="/chercheur/dashboard"
            className="text-xs font-semibold text-slate-500 hover:text-slate-800"
          >
            Annuler
          </Link>

          <button
            type="submit"
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 py-3 rounded-xl text-xs transition-colors shadow-xs flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Soumettre pour validation au laboratoire (Activité 5)</span>
          </button>
        </div>
      </form>
    </div>
  );
};
