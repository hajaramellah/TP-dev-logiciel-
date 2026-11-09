import React from 'react';
import { Link } from 'react-router-dom';
import {
  ClipboardList,
  UserCheck,
  Award,
  FileSpreadsheet,
  Inbox,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  FileCheck2
} from 'lucide-react';
import { storageService } from '../../services/storageService';

export const AdminDashboard: React.FC = () => {
  const metrics = storageService.getPlatformMetrics();
  const applications = storageService.getApplications();
  const registrations = storageService.getAdministrativeRegistrations();
  const reRegistrations = storageService.getAnnualReRegistrations();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-teal-300 bg-teal-500/20 border border-teal-400/40 px-3 py-1 rounded-full text-xs font-semibold">
            <ClipboardList className="w-3.5 h-3.5" />
            Administration Scolarité & Études Doctorales
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Bureau d'Instruction & Scolarité CEDoc
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm">
            Université Sidi Mohamed Ben Abdellah • Session Doctorale 2026-2027
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/administration/dossiers"
            className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs transition-colors shadow-xs flex items-center gap-2"
          >
            <ClipboardList className="w-4 h-4" />
            <span>File des Candidatures ({applications.length})</span>
          </Link>
          <Link
            to="/administration/inscriptions"
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2.5 rounded-xl font-bold text-xs transition-colors backdrop-blur-xs flex items-center gap-2"
          >
            <UserCheck className="w-4 h-4 text-teal-300" />
            <span>Inscriptions Définitives ({registrations.length})</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-2xl font-black text-slate-900">{metrics.totalApplications}</div>
          <div className="text-xs text-slate-500 mt-1 font-medium">Dossiers de Candidature Reçus</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-rose-200 bg-rose-50/20 shadow-2xs">
          <div className="text-2xl font-black text-rose-700">
            {metrics.applicationsByStatus.correction_demandee}
          </div>
          <div className="text-xs text-rose-800 mt-1 font-semibold">Dossiers en Demande de Régularisation</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-2xs">
          <div className="text-2xl font-black text-emerald-700">
            {metrics.applicationsByStatus.recevable}
          </div>
          <div className="text-xs text-emerald-800 mt-1 font-semibold">Dossiers Recevables Validés</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-indigo-200 bg-indigo-50/20 shadow-2xs">
          <div className="text-2xl font-black text-indigo-700">
            {reRegistrations.length}
          </div>
          <div className="text-xs text-indigo-800 mt-1 font-semibold">Réinscriptions Annuelles en Cours</div>
        </div>
      </div>

      {/* Direct Administrative Workflows Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/administration/dossiers"
          className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-teal-500 hover:shadow-md transition-all group space-y-3"
        >
          <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold">
            <ClipboardList className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900 group-hover:text-teal-900">
            Instruction des Dossiers de Candidature
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Contrôle automatique du format des documents, détection des pièces manquantes et notification des demandes de régularisation.
          </p>
          <div className="text-xs font-semibold text-teal-700 flex items-center gap-1">
            <span>Ouvrir la file d'instruction</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        <Link
          to="/administration/publication-resultats"
          className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-teal-500 hover:shadow-md transition-all group space-y-3"
        >
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900 group-hover:text-teal-900">
            Publication Officielle des Résultats
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Contrôle centralisé de publication des listes principales et d'attente avec date d'effet opposable et instructions d'inscription.
          </p>
          <div className="text-xs font-semibold text-teal-700 flex items-center gap-1">
            <span>Gérer la publication</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        <Link
          to="/administration/inscriptions"
          className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-teal-500 hover:shadow-md transition-all group space-y-3"
        >
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <UserCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900 group-hover:text-teal-900">
            Inscriptions Administratives & Titres
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Vérification des originaux des diplômes, contrôles de cohérence, pré-remplissage automatique et délivrance des numéros Apogée.
          </p>
          <div className="text-xs font-semibold text-teal-700 flex items-center gap-1">
            <span>Guichet des inscriptions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        <Link
          to="/administration/reinscriptions"
          className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-teal-500 hover:shadow-md transition-all group space-y-3"
        >
          <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900 group-hover:text-teal-900">
            File des Réinscriptions Annuelles
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Traitement ordonné par priorité et statut des rapports d'avancement des doctorants de 2ème à 6ème année.
          </p>
          <div className="text-xs font-semibold text-teal-700 flex items-center gap-1">
            <span>Traiter les réinscriptions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        <Link
          to="/messagerie"
          className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-teal-500 hover:shadow-md transition-all group space-y-3"
        >
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <Inbox className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900 group-hover:text-teal-900">
            Messagerie & Notifications Centralisées
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Canal de communication direct rattaché aux numéros de dossiers sans dispersion des échanges par e-mail.
          </p>
          <div className="text-xs font-semibold text-teal-700 flex items-center gap-1">
            <span>Ouvrir la messagerie</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>
      </div>
    </div>
  );
};
