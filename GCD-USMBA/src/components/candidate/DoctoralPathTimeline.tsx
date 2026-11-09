import React from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  ArrowRight,
  Upload,
  Calendar,
  Award,
  FileText,
  UserCheck,
  Building2,
  BookOpen
} from 'lucide-react';
import { CandidateApplication, ApplicationStatus } from '../../types';

interface DoctoralPathTimelineProps {
  application?: CandidateApplication | null;
  candidateName?: string;
}

type StageStatus = 'termine' | 'en_cours' | 'en_attente' | 'a_completer' | 'refuse';

interface TimelineStage {
  id: string;
  number: number;
  title: string;
  description: string;
  status: StageStatus;
  statusLabel: string;
  actionText?: string;
  actionLink?: string;
  rejectionReason?: string;
  dateInfo?: string;
}

export const DoctoralPathTimeline: React.FC<DoctoralPathTimelineProps> = ({
  application,
  candidateName
}) => {
  const status: ApplicationStatus | undefined = application?.status;

  // Determine stage states dynamically based on real application data
  const hasApp = !!application;
  const isDraft = status === 'brouillon';
  const isCorrectionNeeded = status === 'correction_demandee' || status === 'incomplete';
  const isSubmitted = hasApp && !isDraft;
  const isAdminVerified = [
    'recevable',
    'en_cours_evaluation',
    'entretien_programme',
    'en_attente_decision',
    'admise',
    'liste_attente'
  ].includes(status || '');
  const isEligible = ['en_cours_evaluation', 'entretien_programme', 'en_attente_decision', 'admise'].includes(status || '');
  const isInterviewDone = ['en_attente_decision', 'admise'].includes(status || '');
  const isAdmitted = status === 'admise';
  const isWaitingList = status === 'liste_attente';
  const isRejected = status === 'non_admise';

  const stages: TimelineStage[] = [
    {
      id: 'stage-1',
      number: 1,
      title: 'Création du compte et validation des documents',
      description: 'Numérisation par caméra de la CIN et de la carte d\'étudiant, vérification OCR et authentification Google.',
      status: 'termine',
      statusLabel: 'Terminé',
      dateInfo: 'Vérifié'
    },
    {
      id: 'stage-2',
      number: 2,
      title: 'Dépôt de candidature',
      description: 'Sélection d\'un sujet doctoral validé, téléversement des diplômes, relevés de notes et projet de recherche.',
      status: isSubmitted ? 'termine' : 'en_cours',
      statusLabel: isSubmitted ? 'Dossier déposé' : 'En attente de soumission',
      actionText: !isSubmitted ? 'Déposer ma candidature' : undefined,
      actionLink: !isSubmitted ? '/candidat/postuler' : undefined,
      dateInfo: application?.submittedAt ? new Date(application.submittedAt).toLocaleDateString('fr-FR') : undefined
    },
    {
      id: 'stage-3',
      number: 3,
      title: 'Vérification administrative',
      description: 'Contrôle de la conformité des pièces par le service de scolarité du CEDoc.',
      status: isCorrectionNeeded
        ? 'a_completer'
        : isAdminVerified
        ? 'termine'
        : isSubmitted
        ? 'en_cours'
        : 'en_attente',
      statusLabel: isCorrectionNeeded
        ? 'Régularisation requise'
        : isAdminVerified
        ? 'Recevable'
        : isSubmitted
        ? 'En cours d\'instruction'
        : 'En attente',
      actionText: isCorrectionNeeded ? 'Régulariser les pièces' : undefined,
      actionLink: isCorrectionNeeded ? '/candidat/corrections' : undefined,
      rejectionReason: isCorrectionNeeded ? 'Certaines pièces sont manquantes ou non conformes.' : undefined
    },
    {
      id: 'stage-4',
      number: 4,
      title: 'Éligibilité et présélection',
      description: 'Analyse académique du cursus Master, équivalences et pertinence thématique.',
      status: isEligible
        ? 'termine'
        : isAdminVerified
        ? 'en_cours'
        : 'en_attente',
      statusLabel: isEligible ? 'Présélectionné' : isAdminVerified ? 'En cours' : 'En attente'
    },
    {
      id: 'stage-5',
      number: 5,
      title: 'Entretien / Commission',
      description: 'Audition orale devant la commission du jury doctoral.',
      status: isInterviewDone
        ? 'termine'
        : status === 'entretien_programme'
        ? 'en_cours'
        : 'en_attente',
      statusLabel: isInterviewDone
        ? 'Audition terminée'
        : status === 'entretien_programme'
        ? 'Convoqué'
        : 'En attente',
      actionText: status === 'entretien_programme' ? 'Voir ma convocation' : undefined,
      actionLink: status === 'entretien_programme' ? '/candidat/convocation' : undefined
    },
    {
      id: 'stage-6',
      number: 6,
      title: 'Décision et publication des résultats',
      description: 'Délibération du jury, établissement du procès-verbal et publication des listes.',
      status: isAdmitted
        ? 'termine'
        : isWaitingList
        ? 'en_cours'
        : isRejected
        ? 'refuse'
        : 'en_attente',
      statusLabel: isAdmitted
        ? 'Admis (Liste Principale)'
        : isWaitingList
        ? 'Liste d\'attente'
        : isRejected
        ? 'Non retenu'
        : 'En attente de délibération',
      actionText: isAdmitted || isWaitingList || isRejected ? 'Consulter le PV officiel' : undefined,
      actionLink: isAdmitted || isWaitingList || isRejected ? '/candidat/resultats' : undefined,
      rejectionReason: isRejected ? 'Dossier non retenu au regard du contingent et des notes de sélection.' : undefined
    },
    {
      id: 'stage-7',
      number: 7,
      title: 'Inscription administrative définitive',
      description: 'Dépôt des pièces originales au guichet CEDoc et signature de la Charte des Thèses.',
      status: isAdmitted ? 'en_cours' : 'en_attente',
      statusLabel: isAdmitted ? 'À finaliser' : 'En attente d\'admission',
      actionText: isAdmitted ? 'Dossier d\'inscription' : undefined,
      actionLink: isAdmitted ? '/candidat/inscription-administrative' : undefined
    },
    {
      id: 'stage-8',
      number: 8,
      title: 'Réinscriptions annuelles',
      description: 'Rapport annuel d\'avancement visé par le directeur et validation des 200 heures de formations.',
      status: 'en_attente',
      statusLabel: 'Années 2 et 3'
    },
    {
      id: 'stage-9',
      number: 9,
      title: 'Soutenance de Doctorat',
      description: 'Dépôt du manuscrit de thèse, désignation des rapporteurs et soutenance publique.',
      status: 'en_attente',
      statusLabel: 'Clôture du cycle'
    }
  ];

  const getStatusBadge = (stage: TimelineStage) => {
    switch (stage.status) {
      case 'termine':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            {stage.statusLabel}
          </span>
        );
      case 'en_cours':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 animate-pulse">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            {stage.statusLabel}
          </span>
        );
      case 'a_completer':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-300">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            {stage.statusLabel}
          </span>
        );
      case 'refuse':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-900 border border-rose-300">
            <XCircle className="w-3.5 h-3.5 text-rose-700" />
            {stage.statusLabel}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {stage.statusLabel}
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-1.5 text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full text-xs font-bold mb-1">
            <UserCheck className="w-3.5 h-3.5 text-teal-600" />
            Parcours Personnel Individualisé
          </div>
          <h2 className="text-xl font-bold text-slate-900">Mon parcours doctoral</h2>
          <p className="text-xs text-slate-500">
            Suivi chronologique transparent des 9 étapes fondamentales du cycle doctoral de l'Université Sidi Mohamed Ben Abdellah.
          </p>
        </div>

        {application?.referenceNumber && (
          <div className="text-left sm:text-right">
            <span className="text-[10px] text-slate-400 block font-mono">Dossier actif</span>
            <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
              {application.referenceNumber}
            </span>
          </div>
        )}
      </div>

      {/* Visual Timeline Stream */}
      <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {stages.map((stage) => {
          const isDone = stage.status === 'termine';
          const isCurrent = stage.status === 'en_cours';
          const isActionNeeded = stage.status === 'a_completer';
          const isFailed = stage.status === 'refuse';

          return (
            <div key={stage.id} className="relative group">
              {/* Stepper node dot */}
              <div
                className={`absolute -left-6 sm:-left-8 top-1 w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs transition-colors shadow-xs ${
                  isDone
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : isCurrent
                    ? 'bg-blue-600 border-blue-600 text-white ring-4 ring-blue-100'
                    : isActionNeeded
                    ? 'bg-rose-600 border-rose-600 text-white ring-4 ring-rose-100'
                    : isFailed
                    ? 'bg-rose-700 border-rose-700 text-white'
                    : 'bg-white border-slate-300 text-slate-400'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <span>{stage.number}</span>
                )}
              </div>

              {/* Stage Card */}
              <div
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  isActionNeeded
                    ? 'bg-rose-50/70 border-rose-200 shadow-xs'
                    : isCurrent
                    ? 'bg-blue-50/40 border-blue-200 shadow-xs'
                    : isDone
                    ? 'bg-slate-50/60 border-slate-200'
                    : 'bg-white border-slate-200 opacity-80'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">
                      Étape {stage.number} : {stage.title}
                    </span>
                  </div>
                  <div>{getStatusBadge(stage)}</div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {stage.description}
                </p>

                {stage.rejectionReason && (
                  <div className="mt-2 text-xs font-medium text-rose-700 bg-rose-100/70 p-2.5 rounded-xl border border-rose-200 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{stage.rejectionReason}</span>
                  </div>
                )}

                {stage.actionText && stage.actionLink && (
                  <div className="mt-3 flex justify-end">
                    <Link
                      to={stage.actionLink}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                        isActionNeeded
                          ? 'bg-rose-700 hover:bg-rose-800 text-white'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                    >
                      <span>{stage.actionText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
