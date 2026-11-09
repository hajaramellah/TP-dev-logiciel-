import React, { useState } from 'react';
import {
  Users,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Send,
  Building2,
  FileText,
  Eye,
  Award
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { AnnualReRegistration } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';

export const SupervisorDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const reRegistrations = storageService.getAnnualReRegistrations();

  // Limited strictly to doctoral students supervised by this professor (Activity 30)
  const supervisedStudents = reRegistrations.filter(
    (r) =>
      r.supervisorId === currentUser?.id ||
      r.supervisorName.toLowerCase().includes(currentUser?.lastName.toLowerCase() || '')
  );

  const [selectedStudent, setSelectedStudent] = useState<AnnualReRegistration | null>(null);
  const [opinion, setOpinion] = useState<'favorable' | 'defavorable'>('favorable');
  const [opinionComment, setOpinionComment] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSaveOpinion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    const updated: AnnualReRegistration = {
      ...selectedStudent,
      supervisorApproval: opinion,
      supervisorComment: opinionComment || 'Avis très favorable. Travaux conformes aux objectifs prévisionnels de la thèse.',
      status: 'avis_directeur_donne'
    };

    storageService.saveAnnualReRegistration(updated, {
      id: currentUser?.id || 'directeur',
      name: `Pr. ${currentUser?.firstName} ${currentUser?.lastName}`,
      role: 'directeur_these'
    });

    // Notify student & administration
    storageService.addNotification({
      targetRole: 'doctorant',
      userId: selectedStudent.studentId,
      title: `Avis de Réinscription accordé par le Directeur`,
      message: `Le Pr. ${currentUser?.lastName} a visé favorablement votre rapport de réinscription.`,
      category: 'reinscription',
      link: '/doctorant/dashboard'
    });

    setSuccessMsg(`Avis de direction de thèse enregistré avec succès pour ${selectedStudent.studentName}.`);
    setSelectedStudent(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-400/40 px-3 py-1 rounded-full text-teal-300 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            Espace de Suivi Autorisé aux Directeurs de Thèse
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Direction de Recherche : Pr. {currentUser?.firstName} {currentUser?.lastName}
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm">
            Accès confidentiel restreint aux seuls doctorants sous votre encadrement direct.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/10 text-center">
          <div className="text-2xl font-black text-teal-300">{supervisedStudents.length}</div>
          <div className="text-xs text-slate-300">Doctorant(s) Encadré(s)</div>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Supervised Students Table (Activity 30) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="font-bold text-base text-slate-900">
            Suivi Administratif & Avancement Scientifique des Doctorants
          </h3>
          <p className="text-xs text-slate-500">
            Vérifiez l'état d'avancement des démarches de réinscription annuelle et délivrez votre visa motivé.
          </p>
        </div>

        <div className="space-y-4">
          {supervisedStudents.map((st) => (
            <div
              key={st.id}
              className="p-6 rounded-2xl border border-slate-200 hover:border-slate-300 bg-white transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base text-slate-900">{st.studentName}</span>
                  <span className="text-xs text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full font-bold">
                    {st.thesisYear}ème Année
                  </span>
                  <StatusBadge status={st.status} size="sm" />
                </div>

                <div className="text-xs text-slate-700 font-medium">
                  <strong>Thèse :</strong> {st.thesisTitle}
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  <strong>Rapport d'avancement :</strong> {st.progressSummary}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                  <span>Articles publiés : <strong>{st.articlesPublishedCount}</strong></span>
                  <span>•</span>
                  <span>Heures formations validées : <strong>{st.trainingHoursCompleted} h</strong></span>
                  <span>•</span>
                  <span className="text-teal-700 font-bold">
                    Avis actuel : {st.supervisorApproval === 'favorable' ? 'Favorable' : 'En attente'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    setSelectedStudent(st);
                    setOpinion(st.supervisorApproval === 'defavorable' ? 'defavorable' : 'favorable');
                    setOpinionComment(st.supervisorComment || '');
                  }}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Délivrer mon avis</span>
                </button>
              </div>
            </div>
          ))}

          {supervisedStudents.length === 0 && (
            <div className="p-8 text-center text-xs text-slate-500">
              Aucun doctorant rattaché actuellement à votre profil d'encadrement.
            </div>
          )}
        </div>
      </div>

      {/* Opinion Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 space-y-4">
            <div>
              <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                Avis Annuel du Directeur de Thèse
              </span>
              <h3 className="font-extrabold text-base text-slate-900 mt-1">
                {selectedStudent.studentName} ({selectedStudent.thesisYear}ème Année)
              </h3>
            </div>

            <form onSubmit={handleSaveOpinion} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Décision motivée de réinscription :
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setOpinion('favorable')}
                    className={`p-3 rounded-xl font-bold border transition-all text-center ${
                      opinion === 'favorable'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Avis Favorable
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpinion('defavorable')}
                    className={`p-3 rounded-xl font-bold border transition-all text-center ${
                      opinion === 'defavorable'
                        ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Avis Défavorable
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Observations et justifications académiques :
                </label>
                <textarea
                  rows={4}
                  required
                  value={opinionComment}
                  onChange={(e) => setOpinionComment(e.target.value)}
                  placeholder="Travaux de qualité, bon respect de l'échéancier prévisionnel de thèse..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedStudent(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-colors shadow-xs"
                >
                  Enregistrer et Transmettre à l'Administration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
