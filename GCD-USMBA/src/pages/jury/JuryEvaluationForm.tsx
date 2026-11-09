import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  Building2,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { CandidateApplication, CandidateEvaluation } from '../../types';

export const JuryEvaluationForm: React.FC = () => {
  const { currentUser } = useAuth();
  const applications = storageService.getApplications().filter(
    (a) => a.status === 'entretien_programme' || a.status === 'en_cours_evaluation' || a.status === 'recevable'
  );
  const evaluations = storageService.getEvaluations();

  const [selectedAppId, setSelectedAppId] = useState<string>(applications[0]?.id || '');
  const [academicDossierScore, setAcademicDossierScore] = useState<number>(4.5);
  const [researchProposalScore, setResearchProposalScore] = useState<number>(4.5);
  const [interviewScore, setInterviewScore] = useState<number>(4.5);
  const [fitWithLaboratoryScore, setFitWithLaboratoryScore] = useState<number>(4.5);
  const [recommendation, setRecommendation] = useState<CandidateEvaluation['recommendation']>('favorable_fort');
  const [observations, setObservations] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const selectedApp = applications.find((a) => a.id === selectedAppId);
  const totalScore = Number(
    (academicDossierScore + researchProposalScore + interviewScore + fitWithLaboratoryScore).toFixed(2)
  );

  const handleSaveEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    const newEval: CandidateEvaluation = {
      id: `eval-${Date.now()}`,
      applicationId: selectedApp.id,
      evaluatorId: currentUser?.id || 'usr-jury-1',
      evaluatorName: `Pr. ${currentUser?.firstName} ${currentUser?.lastName}`,
      evaluatorRole: 'jury',
      academicDossierScore,
      researchProposalScore,
      interviewScore,
      fitWithLaboratoryScore,
      totalScore,
      recommendation,
      observations: observations || 'Candidat présentant un solide bagage théorique et une excellente motivation.',
      submittedAt: new Date().toISOString()
    };

    storageService.saveEvaluation(newEval, {
      id: currentUser?.id || 'jury',
      name: `Pr. ${currentUser?.firstName} ${currentUser?.lastName}`,
      role: 'jury'
    });

    // Update app with consolidated score and status
    const updatedApp: CandidateApplication = {
      ...selectedApp,
      score: totalScore,
      status: 'en_attente_decision',
      statusHistory: [
        {
          id: `sh-${Date.now()}`,
          status: 'en_attente_decision',
          comment: `Évaluation jury saisie (${totalScore}/20). Candidat prêt pour la délibération finale.`,
          changedBy: `Pr. ${currentUser?.firstName} ${currentUser?.lastName}`,
          timestamp: new Date().toISOString()
        },
        ...selectedApp.statusHistory
      ]
    };
    storageService.saveApplication(updatedApp, {
      id: currentUser?.id || 'jury',
      name: `Pr. ${currentUser?.firstName} ${currentUser?.lastName}`,
      role: 'jury'
    });

    setSubmittedSuccess(true);
    setTimeout(() => setSubmittedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-3xl p-8 text-white shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-400/40 px-3 py-1 rounded-full text-teal-300 text-xs font-semibold">
          <Award className="w-3.5 h-3.5" />
          Grille d'Évaluation Numérique Commune sur 20 Points
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">
          Saisie de la Grille d'Évaluation de Jury
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
          Standardisation des critères de notation pour garantir l'équité de traitement et la comparabilité des candidats lors des auditions orales.
        </p>
      </div>

      {submittedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Évaluation enregistrée avec succès ! La note a été transmise à l'espace de délibération.</span>
        </div>
      )}

      <form onSubmit={handleSaveEvaluation} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        {/* Candidate Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Candidat auditionné à évaluer
          </label>
          <select
            value={selectedAppId}
            onChange={(e) => setSelectedAppId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            {applications.map((a) => (
              <option key={a.id} value={a.id}>
                {a.candidateName} — {a.referenceNumber} ({a.discipline})
              </option>
            ))}
          </select>
        </div>

        {selectedApp && (
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <span className="text-slate-400 font-semibold block">Cursus Master</span>
              <span className="font-bold text-slate-900">{selectedApp.masterSpecialty}</span>
              <div className="text-teal-700 font-bold">Mention : {selectedApp.masterMention}</div>
            </div>
            <div className="sm:col-span-2">
              <span className="text-slate-400 font-semibold block">Sujet de thèse</span>
              <span className="font-bold text-slate-900">{selectedApp.subjectTitle}</span>
              <div className="text-slate-500">Directeur : {selectedApp.supervisorName}</div>
            </div>
          </div>
        )}

        {/* 4 Standardized Rubric Criteria (Activity 17) */}
        <div className="space-y-4 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">
              Barème Officiel des 4 Axes d'Évaluation (CEDoc USMBA)
            </h3>
            <div className="text-sm font-extrabold bg-teal-50 text-teal-900 px-3 py-1 rounded-xl border border-teal-200">
              Total : {totalScore} / 20
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* 1. Dossier Académique */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">1. Dossier Académique</span>
                <span className="font-bold text-teal-700">{academicDossierScore} / 5</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Cohérence du parcours, mentions au Master/Ingénieur, notes S1-S4.
              </p>
              <input
                type="range"
                min="0"
                max="5"
                step="0.25"
                value={academicDossierScore}
                onChange={(e) => setAcademicDossierScore(Number(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />
            </div>

            {/* 2. Projet de Recherche */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">2. Avant-Projet de Recherche</span>
                <span className="font-bold text-teal-700">{researchProposalScore} / 5</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Rigueur scientifique, originalité, problématique et état de l'art.
              </p>
              <input
                type="range"
                min="0"
                max="5"
                step="0.25"
                value={researchProposalScore}
                onChange={(e) => setResearchProposalScore(Number(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />
            </div>

            {/* 3. Audition Orale */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">3. Entretien & Soutenance Orale</span>
                <span className="font-bold text-teal-700">{interviewScore} / 5</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Aisance, clarté pédagogique de l'exposé, pertinence des réponses aux questions.
              </p>
              <input
                type="range"
                min="0"
                max="5"
                step="0.25"
                value={interviewScore}
                onChange={(e) => setInterviewScore(Number(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />
            </div>

            {/* 4. Adéquation Labo */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">4. Adéquation avec le Laboratoire</span>
                <span className="font-bold text-teal-700">{fitWithLaboratoryScore} / 5</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Compétences techniques du candidat par rapport aux plateformes et axes de l'équipe.
              </p>
              <input
                type="range"
                min="0"
                max="5"
                step="0.25"
                value={fitWithLaboratoryScore}
                onChange={(e) => setFitWithLaboratoryScore(Number(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Recommendation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Avis Collégial Global :
            </label>
            <select
              value={recommendation}
              onChange={(e) => setRecommendation(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="favorable_fort">Très Favorable (Admission recommandée)</option>
              <option value="favorable">Favorable</option>
              <option value="reserve">Sous réserve (Liste d'attente)</option>
              <option value="defavorable">Défavorable (Non retenu)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Observations qualitatives motivées :
            </label>
            <textarea
              rows={2}
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Excellente maîtrise des architectures Deep Learning, esprit critique aiguisé..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Évaluateur : <strong>Pr. {currentUser?.firstName} {currentUser?.lastName}</strong>
          </div>

          <button
            type="submit"
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 py-3 rounded-xl text-xs transition-colors shadow-xs flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Enregistrer la note numérique ({totalScore}/20)</span>
          </button>
        </div>
      </form>
    </div>
  );
};
