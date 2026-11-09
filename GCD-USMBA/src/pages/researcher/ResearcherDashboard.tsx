import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  PlusCircle,
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { StatusBadge } from '../../components/common/StatusBadge';

export const ResearcherDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const subjects = storageService.getSubjects();
  const applications = storageService.getApplications();

  const mySubjects = subjects.filter(
    (s) => s.supervisorId === currentUser?.id || s.supervisorName.toLowerCase().includes(currentUser?.lastName.toLowerCase() || '')
  );

  const pendingCount = mySubjects.filter((s) => s.status === 'en_attente_validation').length;
  const validatedCount = mySubjects.filter((s) => s.status === 'valide').length;
  const correctionCount = mySubjects.filter((s) => s.status === 'correction_demandee').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-teal-300 bg-teal-500/20 border border-teal-400/40 px-3 py-1 rounded-full text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Espace Enseignant-Chercheur & Encadrant
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Pr. {currentUser?.firstName} {currentUser?.lastName}
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm">
            Laboratoire de rattachement : <span className="font-bold text-teal-300">{currentUser?.laboratoryId?.toUpperCase() || 'LISAC'}</span> • Session 2026-2027
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/chercheur/proposer-sujet"
            className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs transition-colors shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Proposer un Sujet de Thèse</span>
          </Link>

          <Link
            to="/chercheur/candidatures"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2.5 rounded-xl font-bold text-xs transition-colors backdrop-blur-xs"
          >
            <Users className="w-4 h-4 text-teal-300" />
            <span>Examiner les Candidatures</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-2xl font-black text-slate-900">{mySubjects.length}</div>
          <div className="text-xs text-slate-500 mt-1 font-medium">Sujets Proposés au Total</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-2xs">
          <div className="text-2xl font-black text-emerald-700">{validatedCount}</div>
          <div className="text-xs text-emerald-800 mt-1 font-semibold">Validés par le Laboratoire</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-2xs">
          <div className="text-2xl font-black text-amber-700">{pendingCount}</div>
          <div className="text-xs text-amber-800 mt-1 font-semibold">En Attente de Visa Labo</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-rose-200 bg-rose-50/20 shadow-2xs">
          <div className="text-2xl font-black text-rose-700">{correctionCount}</div>
          <div className="text-xs text-rose-800 mt-1 font-semibold">Corrections Demandées</div>
        </div>
      </div>

      {/* My Subjects Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-6 sm:p-8">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-bold text-base text-slate-900">Mes Propositions de Sujets Doctoraux</h3>
            <p className="text-xs text-slate-500">Statut de validation par le laboratoire et candidatures reçues</p>
          </div>
          <Link
            to="/chercheur/proposer-sujet"
            className="text-xs font-bold text-teal-700 hover:underline inline-flex items-center gap-1"
          >
            <PlusCircle className="w-4 h-4" />
            Nouveau sujet
          </Link>
        </div>

        <div className="space-y-3">
          {mySubjects.map((sub) => {
            const subjectApps = applications.filter((a) => a.subjectId === sub.id);
            return (
              <div
                key={sub.id}
                className="p-5 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={sub.status} />
                    <span className="text-xs text-slate-400 font-medium">{sub.discipline}</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">{sub.title}</h4>
                  <p className="text-xs text-slate-600 line-clamp-2">{sub.abstract}</p>

                  {sub.correctionComment && (
                    <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 mt-2">
                      <strong>Remarque du directeur de laboratoire :</strong> {sub.correctionComment}
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
                  <div className="text-right text-xs">
                    <span className="text-slate-400 block font-medium">Candidats</span>
                    <span className="font-bold text-slate-900">{subjectApps.length} dossier(s)</span>
                  </div>

                  <Link
                    to="/chercheur/candidatures"
                    className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-colors"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Examiner ({subjectApps.length})</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
