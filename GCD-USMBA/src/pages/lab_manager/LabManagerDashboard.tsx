import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckSquare,
  Building2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Eye,
  History,
  FileText,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { DoctoralSubject } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';

export const LabManagerDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const subjects = storageService.getSubjects();

  const [decisionModalSubject, setDecisionModalSubject] = useState<DoctoralSubject | null>(null);
  const [decisionAction, setDecisionAction] = useState<'valider' | 'rejeter' | 'corriger'>('valider');
  const [decisionComment, setDecisionComment] = useState('');

  // All subjects belonging to the lab manager's laboratory
  const labSubjects = subjects.filter(
    (s) => s.laboratoryId === currentUser?.laboratoryId || s.establishmentId === currentUser?.establishmentId
  );

  const pendingSubjects = labSubjects.filter((s) => s.status === 'en_attente_validation');
  const validatedSubjects = labSubjects.filter((s) => s.status === 'valide');
  const correctionSubjects = labSubjects.filter((s) => s.status === 'correction_demandee');

  const handleApplyDecision = () => {
    if (!decisionModalSubject) return;

    let newStatus = decisionModalSubject.status;
    if (decisionAction === 'valider') newStatus = 'valide';
    if (decisionAction === 'rejeter') newStatus = 'rejete';
    if (decisionAction === 'corriger') newStatus = 'correction_demandee';

    const updated = {
      ...decisionModalSubject,
      status: newStatus,
      correctionComment: decisionAction === 'corriger' ? decisionComment : undefined,
      rejectionReason: decisionAction === 'rejeter' ? decisionComment : undefined,
      validationDate: decisionAction === 'valider' ? new Date().toISOString() : undefined
    };

    storageService.saveSubject(updated, {
      id: currentUser?.id || 'labo',
      name: `Pr. ${currentUser?.firstName} ${currentUser?.lastName}`,
      role: 'responsable_labo'
    });

    // Notify researcher
    storageService.addNotification({
      targetRole: 'enseignant_chercheur',
      userId: decisionModalSubject.supervisorId,
      title: `Décision Laboratoire : Sujet "${decisionModalSubject.title.substring(0, 30)}..."`,
      message: `Votre proposition a été ${decisionAction === 'valider' ? 'validée et publiée' : decisionAction === 'corriger' ? 'renvoyée pour correction' : 'rejetée'}. ${decisionComment ? `Commentaire : ${decisionComment}` : ''}`,
      category: 'sujet',
      link: '/chercheur/dashboard'
    });

    setDecisionModalSubject(null);
    setDecisionComment('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-teal-300 bg-teal-500/20 border border-teal-400/40 px-3 py-1 rounded-full text-xs font-semibold">
            <Building2 className="w-3.5 h-3.5" />
            Circuit de Validation des Sujets de Thèse
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Direction du Laboratoire {currentUser?.laboratoryId?.toUpperCase() || 'LERMA'}
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm">
            Responsable : <span className="font-bold text-teal-300">Pr. {currentUser?.firstName} {currentUser?.lastName}</span> • Suivi formel des thématiques doctorales
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/10 text-center">
          <div className="text-2xl font-black text-teal-300">{pendingSubjects.length}</div>
          <div className="text-xs text-slate-300">En attente de visa labo</div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-2xs">
          <div className="text-2xl font-black text-amber-800">{pendingSubjects.length}</div>
          <div className="text-xs text-amber-900 mt-1 font-semibold">En attente de délibération labo</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-2xs">
          <div className="text-2xl font-black text-emerald-800">{validatedSubjects.length}</div>
          <div className="text-xs text-emerald-900 mt-1 font-semibold">Validés & Ouverts au concours</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-rose-200 bg-rose-50/20 shadow-2xs">
          <div className="text-2xl font-black text-rose-800">{correctionSubjects.length}</div>
          <div className="text-xs text-rose-900 mt-1 font-semibold">Demandes de révision en cours</div>
        </div>
      </div>

      {/* Main Validation List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="font-bold text-base text-slate-900">
            Sujets Doctoraux Soumis par les Chercheurs du Laboratoire
          </h3>
          <p className="text-xs text-slate-500">
            Approuvez, rejetez ou demandez des modifications motivées en un clic avec traçabilité complète.
          </p>
        </div>

        <div className="space-y-4">
          {labSubjects.map((sub) => (
            <div
              key={sub.id}
              className={`p-6 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                sub.status === 'en_attente_validation'
                  ? 'border-amber-300 bg-amber-50/30'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2">
                  <StatusBadge status={sub.status} />
                  <span className="text-xs text-slate-500 font-semibold">{sub.discipline}</span>
                  <span className="text-xs text-slate-400 font-mono">Réf: {sub.id}</span>
                </div>

                <h4 className="font-bold text-base text-slate-900 leading-snug">{sub.title}</h4>

                <div className="text-xs text-slate-600">
                  <strong>Proposé par :</strong> {sub.supervisorName} • <strong>Places :</strong> {sub.maxCandidates}
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{sub.abstract}</p>

                {sub.correctionComment && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
                    <strong>Motif de la demande de révision :</strong> {sub.correctionComment}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    setDecisionModalSubject(sub);
                    setDecisionAction('valider');
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow-2xs flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Valider (Visa)</span>
                </button>

                <button
                  onClick={() => {
                    setDecisionModalSubject(sub);
                    setDecisionAction('corriger');
                  }}
                  className="bg-white border border-amber-300 text-amber-800 hover:bg-amber-50 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Demander révision</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Decision Modal */}
      {decisionModalSubject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 space-y-4">
            <h3 className="font-black text-base text-slate-900">
              Décision de Laboratoire sur le Sujet
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-semibold">
              « {decisionModalSubject.title} »
            </p>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Action choisie :</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setDecisionAction('valider')}
                  className={`p-2.5 rounded-xl text-xs font-bold border transition-colors ${
                    decisionAction === 'valider'
                      ? 'bg-emerald-700 text-white border-emerald-700'
                      : 'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  Approuver & Publier
                </button>
                <button
                  type="button"
                  onClick={() => setDecisionAction('corriger')}
                  className={`p-2.5 rounded-xl text-xs font-bold border transition-colors ${
                    decisionAction === 'corriger'
                      ? 'bg-amber-600 text-white border-amber-600'
                      : 'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  Demander Révision
                </button>
                <button
                  type="button"
                  onClick={() => setDecisionAction('rejeter')}
                  className={`p-2.5 rounded-xl text-xs font-bold border transition-colors ${
                    decisionAction === 'rejeter'
                      ? 'bg-rose-700 text-white border-rose-700'
                      : 'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  Rejeter
                </button>
              </div>
            </div>

            {decisionAction !== 'valider' && (
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  Commentaire / Motif explicatif obligatoire :
                </label>
                <textarea
                  rows={3}
                  required
                  value={decisionComment}
                  onChange={(e) => setDecisionComment(e.target.value)}
                  placeholder="Précisez les points à enrichir (ex: méthodologie, convention de partenariat)..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDecisionModalSubject(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleApplyDecision}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-colors shadow-xs"
              >
                Confirmer la décision formelle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
