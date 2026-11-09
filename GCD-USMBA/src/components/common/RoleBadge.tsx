import React from 'react';
import { UserRole } from '../../types';

interface RoleBadgeProps {
  role: UserRole;
  size?: 'sm' | 'md';
}

export const ROLE_LABELS: Record<UserRole, string> = {
  candidat: 'Candidat',
  enseignant_chercheur: 'Enseignant-Chercheur',
  responsable_labo: 'Resp. Laboratoire',
  administration: 'Administration / Scolarité',
  responsable_formation: 'Resp. Formation Doctorale',
  jury: 'Jury de Sélection',
  doctorant: 'Doctorant',
  directeur_these: 'Directeur de Thèse',
  responsable_gcd: 'Resp. Plateforme GCD'
};

export const ROLE_COLORS: Record<UserRole, string> = {
  candidat: 'bg-sky-50 text-sky-800 border-sky-200',
  enseignant_chercheur: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  responsable_labo: 'bg-purple-50 text-purple-800 border-purple-200',
  administration: 'bg-amber-50 text-amber-800 border-amber-200',
  responsable_formation: 'bg-indigo-50 text-indigo-800 border-indigo-200',
  jury: 'bg-fuchsia-50 text-fuchsia-800 border-fuchsia-200',
  doctorant: 'bg-teal-50 text-teal-800 border-teal-200',
  directeur_these: 'bg-cyan-50 text-cyan-800 border-cyan-200',
  responsable_gcd: 'bg-slate-900 text-white border-slate-700'
};

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role, size = 'md' }) => {
  const label = ROLE_LABELS[role] || role;
  const colorClass = ROLE_COLORS[role] || 'bg-slate-100 text-slate-800 border-slate-200';
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span className={`inline-flex items-center rounded-md font-medium border ${colorClass} ${sizeClass}`}>
      {label}
    </span>
  );
};
