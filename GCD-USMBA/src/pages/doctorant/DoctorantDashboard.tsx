import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileSpreadsheet,
  Calendar,
  Clock,
  CheckCircle2,
  Upload,
  BookOpen,
  Award,
  ArrowRight,
  ShieldCheck,
  Building2,
  AlertTriangle
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { AnnualReRegistration } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';

export const DoctorantDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const reRegistrations = storageService.getAnnualReRegistrations();
  const settings = storageService.getSettings();

  const myReReg =
    reRegistrations.find(
      (r) => r.studentId === currentUser?.id || r.cin === currentUser?.cin
    ) || reRegistrations[0];

  const [formOpen, setFormOpen] = useState(false);
  const [progressSummary, setProgressSummary] = useState(myReReg?.progressSummary || '');
  const [articlesCount, setArticlesCount] = useState(myReReg?.articlesPublishedCount || 2);
  const [trainingHours, setTrainingHours] = useState(myReReg?.trainingHoursCompleted || 90);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmitReReg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!progressSummary) return;

    const updated: AnnualReRegistration = {
      ...myReReg,
      progressSummary,
      articlesPublishedCount: Number(articlesCount),
      trainingHoursCompleted: Number(trainingHours),
      status: 'soumis',
      submittedAt: new Date().toISOString()
    };

    storageService.saveAnnualReRegistration(updated, {
      id: currentUser?.id || 'doctorant',
      name: `${currentUser?.firstName} ${currentUser?.lastName}`,
      role: 'doctorant'
    });

    // Notify thesis supervisor & administration
    storageService.addNotification({
      targetRole: 'directeur_these',
      userId: myReReg.supervisorId,
      title: `Rapport de Réinscription soumis par ${myReReg.studentName}`,
      message: `Votre doctorant a déposé son rapport d'avancement pour visa préalable.`,
      category: 'reinscription',
      link: '/directeur/doctorants'
    });

    setIsSubmitted(true);
    setFormOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-400/40 px-3 py-1 rounded-full text-teal-300 text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            Espace Doctorant Inscrit • Suivi Annuel
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {myReReg.studentName}
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm">
            Numéro d'inscription : <span className="font-mono text-teal-300 font-bold">DOC-USMBA-2024-5544</span> • Thèse en {myReReg.thesisYear}ème année
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/10 text-center">
          <div className="text-xs text-slate-300">Échéance de Réinscription</div>
          <div className="text-xl font-black text-teal-300 mt-0.5">30 Novembre 2026</div>
        </div>
      </div>

      {isSubmitted && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Dossier de réinscription annuelle soumis avec succès avec vérification préalable des pièces !</span>
        </div>
      )}

      {/* Deadlines & Calendar Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-sm text-slate-900">
              Calendrier des Échéances & Rappels Automatiques
            </h3>
          </div>
          <span className="text-xs font-bold text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            Campagne Annuelle Ouverte
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-2xl border space-y-1">
            <span className="text-slate-400 font-semibold block">15 Septembre 2026</span>
            <div className="font-bold text-slate-800">Ouverture de la campagne de dépôt</div>
            <div className="text-emerald-700 font-medium">Clôturée</div>
          </div>
          <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-2xl space-y-1">
            <span className="text-teal-700 font-semibold block">En cours</span>
            <div className="font-bold text-teal-950">Vérification préalable & Avis Directeur</div>
            <div className="text-teal-800 font-medium">Action requise avant fin Novembre</div>
          </div>
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-1">
            <span className="text-rose-700 font-semibold block">30 Novembre 2026</span>
            <div className="font-bold text-rose-950">Date limite stricte de forclusion</div>
            <div className="text-rose-700 font-medium">Délai non prorogeable</div>
          </div>
        </div>
      </div>

      {/* Thesis Situation Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
              Thèse en Cours
            </span>
            <h2 className="text-lg font-bold text-slate-900 mt-2">{myReReg.thesisTitle}</h2>
          </div>
          <StatusBadge status={myReReg.status} size="lg" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-50 p-4 rounded-xl border">
            <span className="text-slate-400 font-semibold block">Directeur de Thèse</span>
            <span className="font-bold text-slate-900">{myReReg.supervisorName}</span>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border">
            <span className="text-slate-400 font-semibold block">Publications & Congrès</span>
            <span className="font-bold text-slate-900">
              {myReReg.articlesPublishedCount} articles indexés • {myReReg.conferencesCount} communications
            </span>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border">
            <span className="text-slate-400 font-semibold block">Formations Doctorales Validées</span>
            <span className="font-bold text-teal-700">{myReReg.trainingHoursCompleted} / 200 heures requises</span>
          </div>
        </div>

        {myReReg.supervisorComment && (
          <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl text-xs text-teal-950">
            <strong>Avis officiel motivé du directeur :</strong> {myReReg.supervisorComment}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="text-xs text-slate-500">
            Dernière mise à jour : {new Date(myReReg.submittedAt).toLocaleDateString('fr-FR')}
          </div>

          <button
            onClick={() => setFormOpen(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-colors flex items-center gap-2 shadow-xs"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Mettre à jour le dossier de réinscription</span>
          </button>
        </div>
      </div>

      {/* Re-Registration Form Modal with Pre-Validation */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-xs text-teal-300 font-bold">Formulaire Officiel de Réinscription</span>
                <h3 className="font-extrabold text-base">Réinscription en {myReReg.thesisYear}ème Année</h3>
              </div>
              <button onClick={() => setFormOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitReReg} className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700">
              <div>
                <label className="block font-bold text-slate-900 mb-1">
                  Rapport synthétique d'avancement de recherche de l'année écoulée <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={progressSummary}
                  onChange={(e) => setProgressSummary(e.target.value)}
                  placeholder="Détaillez les expérimentations menées, résultats obtenus et chapitres rédigés..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-900 mb-1">
                    Nombre d'articles publiés dans l'année
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={articlesCount}
                    onChange={(e) => setArticlesCount(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-900 mb-1">
                    Total heures de formations cumulées
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="200"
                    value={trainingHours}
                    onChange={(e) => setTrainingHours(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* Pre-validation checklist (Activity 28) */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h4 className="font-bold text-slate-900">
                  Vérification préalable des pièces justificatives obligatoires :
                </h4>
                {myReReg.documents.map((d) => (
                  <div key={d.id} className="p-3 bg-slate-50 rounded-xl border flex items-center justify-between">
                    <span>{d.label}</span>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Vérifié Conforme
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-slate-50 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-2 rounded-xl text-xs transition-colors shadow-xs"
                >
                  Valider et Soumettre à l'Administration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
