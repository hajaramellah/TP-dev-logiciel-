import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Send,
  FileCheck,
  AlertCircle,
  Calendar,
  Award,
  GraduationCap,
  Users,
  ClipboardList,
  FileText,
  UserCheck,
  Shield,
  Layers,
  Inbox,
  History,
  FileSpreadsheet,
  CheckSquare,
  HelpCircle,
  FileSignature,
  Sliders
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { currentRole, currentUser } = useAuth();

  // Strict application lookup
  const candidateApp = storageService.getCandidateApplicationStrict(
    currentUser?.id,
    currentUser?.email,
    currentUser?.cin
  );
  const correctionsNeeded =
    candidateApp?.status === 'correction_demandee' || candidateApp?.status === 'incomplete';

  // Admin stats
  const applications = storageService.getApplications();
  const pendingAdminCount = applications.filter(
    (a) => a.status === 'soumise' || a.status === 'en_cours_verification' || a.status === 'corrigee'
  ).length;

  const subjects = storageService.getSubjects();
  const pendingLabSubjects = subjects.filter((s) => s.status === 'en_attente_validation').length;

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
      isActive
        ? 'bg-slate-900 text-white shadow-xs'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
    }`;

  return (
    <aside
      className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* CANDIDAT NAVIGATION */}
        {currentRole === 'candidat' && (
          <div className="space-y-1">
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Espace Candidat
            </div>
            <NavLink to="/candidat/dashboard" className={navItemClass} onClick={onClose}>
              <LayoutDashboard className="w-4 h-4 text-teal-600" />
              <span>Tableau de bord</span>
            </NavLink>
            <NavLink to="/sujets" className={navItemClass} onClick={onClose}>
              <BookOpen className="w-4 h-4 text-sky-600" />
              <span>Catalogue des Sujets</span>
            </NavLink>
            <NavLink to="/candidat/postuler" className={navItemClass} onClick={onClose}>
              <Send className="w-4 h-4 text-indigo-600" />
              <span>Déposer ma candidature</span>
            </NavLink>
            <NavLink to="/candidat/mon-dossier" className={navItemClass} onClick={onClose}>
              <FileCheck className="w-4 h-4 text-emerald-600" />
              <span>Accusé de réception</span>
            </NavLink>
            <NavLink to="/candidat/corrections" className={navItemClass} onClick={onClose}>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-4 h-4 text-rose-500" />
                  <span>Régularisation de pièces</span>
                </div>
                {correctionsNeeded && (
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                )}
              </div>
            </NavLink>
            <NavLink to="/candidat/convocation" className={navItemClass} onClick={onClose}>
              <Calendar className="w-4 h-4 text-amber-500" />
              <span>Convocation Entretien</span>
            </NavLink>
            <NavLink to="/candidat/resultats" className={navItemClass} onClick={onClose}>
              <Award className="w-4 h-4 text-purple-600" />
              <span>Résultats de Sélection</span>
            </NavLink>
            <NavLink to="/candidat/inscription-administrative" className={navItemClass} onClick={onClose}>
              <CheckSquare className="w-4 h-4 text-emerald-600" />
              <span>Inscription Définitive</span>
            </NavLink>
          </div>
        )}

        {/* ENSEIGNANT-CHERCHEUR NAVIGATION */}
        {currentRole === 'enseignant_chercheur' && (
          <div className="space-y-1">
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Espace Enseignant-Chercheur
            </div>
            <NavLink to="/chercheur/dashboard" className={navItemClass} onClick={onClose}>
              <LayoutDashboard className="w-4 h-4 text-emerald-600" />
              <span>Tableau de bord</span>
            </NavLink>
            <NavLink to="/chercheur/proposer-sujet" className={navItemClass} onClick={onClose}>
              <FileText className="w-4 h-4 text-teal-600" />
              <span>Proposer un Sujet</span>
            </NavLink>
            <NavLink to="/chercheur/candidatures" className={navItemClass} onClick={onClose}>
              <Users className="w-4 h-4 text-sky-600" />
              <span>Examiner les Dossiers</span>
            </NavLink>
          </div>
        )}

        {/* RESPONSABLE LABO NAVIGATION */}
        {currentRole === 'responsable_labo' && (
          <div className="space-y-1">
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Espace Direction Laboratoire
            </div>
            <NavLink to="/labo/dashboard" className={navItemClass} onClick={onClose}>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <LayoutDashboard className="w-4 h-4 text-purple-600" />
                  <span>Validation des Sujets</span>
                </div>
                {pendingLabSubjects > 0 && (
                  <span className="bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                    {pendingLabSubjects}
                  </span>
                )}
              </div>
            </NavLink>
          </div>
        )}

        {/* ADMINISTRATION NAVIGATION */}
        {currentRole === 'administration' && (
          <div className="space-y-1">
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Espace Administration & Scolarité
            </div>
            <NavLink to="/administration/dashboard" className={navItemClass} onClick={onClose}>
              <LayoutDashboard className="w-4 h-4 text-amber-600" />
              <span>Tableau de bord</span>
            </NavLink>
            <NavLink to="/administration/dossiers" className={navItemClass} onClick={onClose}>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <ClipboardList className="w-4 h-4 text-sky-600" />
                  <span>Module C — Gestion des Dossiers</span>
                </div>
                {pendingAdminCount > 0 && (
                  <span className="bg-sky-100 text-sky-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                    {pendingAdminCount}
                  </span>
                )}
              </div>
            </NavLink>
            <NavLink to="/administration/publication-resultats" className={navItemClass} onClick={onClose}>
              <Award className="w-4 h-4 text-purple-600" />
              <span>Publication des Résultats</span>
            </NavLink>
            <NavLink to="/administration/inscriptions" className={navItemClass} onClick={onClose}>
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>Inscriptions Administratives</span>
            </NavLink>
            <NavLink to="/administration/reinscriptions" className={navItemClass} onClick={onClose}>
              <FileSpreadsheet className="w-4 h-4 text-teal-600" />
              <span>File de Réinscriptions</span>
            </NavLink>
            <NavLink to="/messagerie" className={navItemClass} onClick={onClose}>
              <Inbox className="w-4 h-4 text-blue-600" />
              <span>Messagerie Institutionnelle</span>
            </NavLink>
          </div>
        )}

        {/* RESPONSABLE FORMATION DOCTORALE */}
        {currentRole === 'responsable_formation' && (
          <div className="space-y-1">
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Formation Doctorale CEDoc
            </div>
            <NavLink to="/formation/dashboard" className={navItemClass} onClick={onClose}>
              <LayoutDashboard className="w-4 h-4 text-indigo-600" />
              <span>Tableau de bord CEDoc</span>
            </NavLink>
            <NavLink to="/formation/entretiens" className={navItemClass} onClick={onClose}>
              <Calendar className="w-4 h-4 text-teal-600" />
              <span>Coordination des Entretiens</span>
            </NavLink>
            <NavLink to="/formation/pv-validation" className={navItemClass} onClick={onClose}>
              <FileSignature className="w-4 h-4 text-purple-600" />
              <span>Validation Procès-Verbal</span>
            </NavLink>
          </div>
        )}

        {/* JURY DE SÉLECTION */}
        {currentRole === 'jury' && (
          <div className="space-y-1">
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Jury de Sélection
            </div>
            <NavLink to="/jury/dashboard" className={navItemClass} onClick={onClose}>
              <LayoutDashboard className="w-4 h-4 text-fuchsia-600" />
              <span>Tableau de bord Jury</span>
            </NavLink>
            <NavLink to="/jury/evaluer" className={navItemClass} onClick={onClose}>
              <Award className="w-4 h-4 text-indigo-600" />
              <span>Grille d'Évaluation</span>
            </NavLink>
            <NavLink to="/jury/deliberations" className={navItemClass} onClick={onClose}>
              <FileSignature className="w-4 h-4 text-teal-600" />
              <span>Délibérations & PV</span>
            </NavLink>
          </div>
        )}

        {/* DOCTORANT */}
        {currentRole === 'doctorant' && (
          <div className="space-y-1">
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Espace Doctorant
            </div>
            <NavLink to="/doctorant/dashboard" className={navItemClass} onClick={onClose}>
              <LayoutDashboard className="w-4 h-4 text-teal-600" />
              <span>Mon Profil Doctoral</span>
            </NavLink>
            <NavLink to="/doctorant/reinscription" className={navItemClass} onClick={onClose}>
              <FileSpreadsheet className="w-4 h-4 text-sky-600" />
              <span>Réinscription Annuelle</span>
            </NavLink>
          </div>
        )}

        {/* DIRECTEUR DE THÈSE */}
        {currentRole === 'directeur_these' && (
          <div className="space-y-1">
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Direction de Thèse
            </div>
            <NavLink to="/directeur/dashboard" className={navItemClass} onClick={onClose}>
              <LayoutDashboard className="w-4 h-4 text-cyan-600" />
              <span>Tableau de bord</span>
            </NavLink>
            <NavLink to="/directeur/doctorants" className={navItemClass} onClick={onClose}>
              <Users className="w-4 h-4 text-teal-600" />
              <span>Suivi des Doctorants</span>
            </NavLink>
          </div>
        )}

        {/* RESPONSABLE PLATEFORME GCD (SUPER ADMIN) */}
        {currentRole === 'responsable_gcd' && (
          <div className="space-y-1">
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Supervision Opérationnelle GCD
            </div>
            <NavLink to="/superadmin/dashboard" className={navItemClass} onClick={onClose}>
              <LayoutDashboard className="w-4 h-4 text-slate-800" />
              <span>Indicateurs de Pilotage</span>
            </NavLink>
            <NavLink to="/superadmin/regles" className={navItemClass} onClick={onClose}>
              <Sliders className="w-4 h-4 text-teal-600" />
              <span>Module A — Règles de Gestion</span>
            </NavLink>
            <NavLink to="/superadmin/campagnes" className={navItemClass} onClick={onClose}>
              <Calendar className="w-4 h-4 text-indigo-600" />
              <span>Module B — Gestion Campagnes</span>
            </NavLink>
            <NavLink to="/administration/dossiers" className={navItemClass} onClick={onClose}>
              <ClipboardList className="w-4 h-4 text-sky-600" />
              <span>Module C — Gestion Dossiers</span>
            </NavLink>
            <NavLink to="/superadmin/coordination-processus" className={navItemClass} onClick={onClose}>
              <Shield className="w-4 h-4 text-purple-600" />
              <span>Module D — Gestion Opérations</span>
            </NavLink>
            <NavLink to="/superadmin/audit-logs" className={navItemClass} onClick={onClose}>
              <History className="w-4 h-4 text-rose-600" />
              <span>Traçabilité & Journal d'Audit</span>
            </NavLink>
            <NavLink to="/superadmin/utilisateurs" className={navItemClass} onClick={onClose}>
              <Users className="w-4 h-4 text-slate-600" />
              <span>Gestion des Comptes & Rôles</span>
            </NavLink>
          </div>
        )}

        {/* COMMON / GENERAL LINKS */}
        <div className="pt-4 border-t border-slate-100 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Ressources Universitaires
          </div>
          <NavLink to="/sujets" className={navItemClass} onClick={onClose}>
            <BookOpen className="w-4 h-4 text-slate-500" />
            <span>Catalogue des Sujets</span>
          </NavLink>
          <NavLink to="/faq-aide" className={navItemClass} onClick={onClose}>
            <HelpCircle className="w-4 h-4 text-slate-500" />
            <span>FAQ Réglementaire USMBA</span>
          </NavLink>
        </div>
      </div>

      {/* Footer info within sidebar */}
      <div className="p-4 bg-slate-50 border-t border-slate-200">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Shield className="w-4 h-4 text-teal-600 shrink-0" />
          <span className="truncate font-medium">Session sécurisée USMBA</span>
        </div>
      </div>
    </aside>
  );
};
