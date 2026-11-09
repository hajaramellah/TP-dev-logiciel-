import React from 'react';
import { ApplicationStatus, SubjectStatus, RegistrationStatus, ReRegistrationStatus } from '../../types';

interface StatusBadgeProps {
  status: ApplicationStatus | SubjectStatus | RegistrationStatus | ReRegistrationStatus | string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  let label = status;
  let bgClass = 'bg-slate-100 text-slate-700 border-slate-200';
  let dotClass = 'bg-slate-400';

  switch (status) {
    // Candidatures
    case 'brouillon':
      label = 'Brouillon';
      bgClass = 'bg-slate-50 text-slate-700 border-slate-200';
      dotClass = 'bg-slate-400';
      break;
    case 'soumise':
      label = 'Soumise — En attente';
      bgClass = 'bg-sky-50 text-sky-700 border-sky-200';
      dotClass = 'bg-sky-500';
      break;
    case 'en_cours_verification':
      label = 'En vérification formelle';
      bgClass = 'bg-blue-50 text-blue-700 border-blue-200';
      dotClass = 'bg-blue-500';
      break;
    case 'incomplete':
      label = 'Dossier Incomplet';
      bgClass = 'bg-amber-50 text-amber-800 border-amber-200';
      dotClass = 'bg-amber-500';
      break;
    case 'correction_demandee':
      label = 'Correction demandée';
      bgClass = 'bg-rose-50 text-rose-700 border-rose-200';
      dotClass = 'bg-rose-500 animate-pulse';
      break;
    case 'corrigee':
      label = 'Régularisé / Corrigé';
      bgClass = 'bg-indigo-50 text-indigo-700 border-indigo-200';
      dotClass = 'bg-indigo-500';
      break;
    case 'recevable':
      label = 'Recevable / Conforme';
      bgClass = 'bg-emerald-50 text-emerald-800 border-emerald-200';
      dotClass = 'bg-emerald-500';
      break;
    case 'en_cours_evaluation':
      label = 'En évaluation jury';
      bgClass = 'bg-purple-50 text-purple-700 border-purple-200';
      dotClass = 'bg-purple-500';
      break;
    case 'entretien_programme':
      label = 'Entretien programmé';
      bgClass = 'bg-teal-50 text-teal-800 border-teal-200';
      dotClass = 'bg-teal-500';
      break;
    case 'en_attente_decision':
      label = 'En délibération';
      bgClass = 'bg-orange-50 text-orange-800 border-orange-200';
      dotClass = 'bg-orange-500';
      break;
    case 'admise':
      label = 'Admis(e) — Liste Principale';
      bgClass = 'bg-green-100 text-green-900 border-green-300 font-semibold';
      dotClass = 'bg-green-600';
      break;
    case 'liste_attente':
      label = 'Liste d\'attente';
      bgClass = 'bg-amber-100 text-amber-900 border-amber-300';
      dotClass = 'bg-amber-600';
      break;
    case 'non_admise':
      label = 'Non retenu(e)';
      bgClass = 'bg-rose-50 text-rose-700 border-rose-200';
      dotClass = 'bg-rose-500';
      break;

    // Sujets doctoraux
    case 'en_attente_validation':
      label = 'En attente validation labo';
      bgClass = 'bg-amber-50 text-amber-800 border-amber-200';
      dotClass = 'bg-amber-500';
      break;
    case 'valide':
      label = 'Validé & Publié';
      bgClass = 'bg-emerald-50 text-emerald-800 border-emerald-200';
      dotClass = 'bg-emerald-500';
      break;
    case 'rejete':
      label = 'Rejeté';
      bgClass = 'bg-red-50 text-red-700 border-red-200';
      dotClass = 'bg-red-500';
      break;

    // Re-inscriptions
    case 'avis_directeur_donne':
      label = 'Avis Directeur Favorable';
      bgClass = 'bg-blue-50 text-blue-700 border-blue-200';
      dotClass = 'bg-blue-500';
      break;
    default:
      label = status;
  }

  const sizeClasses =
    size === 'sm'
      ? 'text-xs px-2 py-0.5'
      : size === 'lg'
      ? 'text-sm px-3.5 py-1.5'
      : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${bgClass} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
      <span>{label}</span>
    </span>
  );
};
