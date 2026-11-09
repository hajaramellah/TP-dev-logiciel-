import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  AlertTriangle,
  Calendar,
  Award,
  CheckCircle2,
  Clock,
  ArrowRight,
  Send,
  Upload,
  BookOpen,
  CheckSquare,
  HelpCircle,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { StatusBadge } from '../../components/common/StatusBadge';
import { DoctoralPathTimeline } from '../../components/candidate/DoctoralPathTimeline';

export const CandidateDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Strict Candidate Application Isolation — never falls back to another candidate
  const myApp = storageService.getCandidateApplicationStrict(
    currentUser?.id,
    currentUser?.email,
    currentUser?.cin
  );

  const interviewSlots = storageService.getInterviews();
  const myInterview = myApp ? interviewSlots.find((s) => s.applicationId === myApp.id) : null;

  const hasCorrectionRequest =
    myApp?.status === 'correction_demandee' || myApp?.status === 'incomplete';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-teal-300 bg-teal-500/20 border border-teal-400/40 px-3 py-1 rounded-full text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Espace Candidat Doctorat USMBA
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Bienvenue, {currentUser?.firstName} {currentUser?.lastName}
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm">
            Numéro CIN : <span className="font-mono text-teal-300">{currentUser?.cin}</span> • Compte Google : <span className="font-mono text-slate-200">{currentUser?.email}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/sujets"
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2.5 rounded-xl font-bold text-xs transition-colors backdrop-blur-xs flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4 text-teal-300" />
            <span>Catalogue des Sujets</span>
          </Link>
          <Link
            to="/candidat/postuler"
            className="bg-teal-500 hover:bg-teal-400 text-slate-950 px-5 py-2.5 rounded-xl font-bold text-xs transition-colors shadow-xs flex items-center gap-2"
          >
            <Send className="w-4 h-4 text-slate-950" />
            <span>{myApp ? 'Mettre à jour mon dossier' : 'Déposer une candidature'}</span>
          </Link>
        </div>
      </div>

      {/* Primary Feature: Mon parcours doctoral */}
      <DoctoralPathTimeline application={myApp} candidateName={currentUser?.firstName} />

      {/* Urgent Correction Notification Card */}
      {hasCorrectionRequest && (
        <div className="p-6 bg-rose-50 border-2 border-rose-300 rounded-3xl space-y-4 animate-in fade-in shadow-xs">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base text-rose-900">
                  Régularisation requise sur votre dossier de candidature
                </h3>
                <span className="text-[10px] font-bold bg-rose-200 text-rose-800 px-2 py-0.5 rounded-full">
                  Action Urgente
                </span>
              </div>
              <p className="text-xs text-rose-700 leading-relaxed">
                Le service d'instruction administrative a détecté des pièces justificatives non conformes ou manquantes.
                Veuillez les remplacer dans votre espace de correction avant la date limite.
              </p>
            </div>
          </div>
          <div className="flex justify-end">
            <Link
              to="/candidat/corrections"
              className="inline-flex items-center gap-2 bg-rose-700 hover:bg-rose-800 text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-colors shadow-xs"
            >
              <span>Accéder à mon espace de correction</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Interview scheduled alert */}
      {myApp?.status === 'entretien_programme' && (
        <div className="p-6 bg-teal-50 border border-teal-300 rounded-3xl space-y-4 shadow-xs">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base text-teal-950">
                  Convocation officielle à l'audition orale du jury
                </h3>
              </div>
              <p className="text-xs text-teal-800 leading-relaxed">
                Votre dossier a été déclaré <strong>Recevable</strong>. Votre audition de sélection est programmée
                {myInterview ? ` pour le ${myInterview.date} à ${myInterview.startTime} (${myInterview.roomOrLink})` : '.'}
              </p>
            </div>
          </div>
          <div className="flex justify-end">
            <Link
              to="/candidat/convocation"
              className="inline-flex items-center gap-2 bg-teal-800 hover:bg-teal-900 text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-colors shadow-xs"
            >
              <span>Télécharger ma convocation officielle</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Admitted celebration card */}
      {myApp?.status === 'admise' && (
        <div className="p-6 bg-emerald-50 border-2 border-emerald-300 rounded-3xl space-y-4 shadow-xs">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base text-emerald-950">
                  Félicitations ! Vous êtes admis(e) au cycle doctoral (Liste Principale)
                </h3>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Le jury de sélection et la direction du CEDoc ont validé votre admission avec la note de{' '}
                <strong>{myApp.score ? `${myApp.score}/20` : 'Très Honorable'}</strong>.
                Consultez immédiatement votre checklist d'inscription administrative définitive.
              </p>
            </div>
          </div>
          <div className="flex justify-end">
            <Link
              to="/candidat/inscription-administrative"
              className="inline-flex items-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-colors shadow-xs"
            >
              <span>Préparer mon inscription définitive</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Active Application Card */}
      {myApp ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-md">
                  Réf : {myApp.referenceNumber}
                </span>
                <StatusBadge status={myApp.status} />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-2">
                {myApp.subjectTitle}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/candidat/mon-dossier"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Accusé de réception</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-slate-400 font-semibold block">Discipline</span>
              <span className="font-bold text-slate-800">{myApp.discipline}</span>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-slate-400 font-semibold block">Directeur de Thèse</span>
              <span className="font-bold text-slate-800">{myApp.supervisorName}</span>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-slate-400 font-semibold block">Date de Soumission</span>
              <span className="font-bold text-slate-800">
                {new Date(myApp.submittedAt).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
            </div>
          </div>

          {/* Documents summary */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900">
                Pièces justificatives versées ({myApp.documents.length})
              </span>
              <span className="text-slate-500">
                {myApp.documents.filter((d) => d.status === 'valide').length} conforme(s) /{' '}
                {myApp.documents.length}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
              {myApp.documents.map((doc) => (
                <div
                  key={doc.id}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-2 ${
                    doc.status === 'valide'
                      ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900'
                      : doc.status === 'rejete'
                      ? 'bg-rose-50 border-rose-200 text-rose-900 font-semibold'
                      : doc.status === 'manquant'
                      ? 'bg-amber-50 border-amber-200 text-amber-900 font-semibold'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <span className="truncate">{doc.label}</span>
                  {doc.status === 'valide' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                  {doc.status === 'rejete' && <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />}
                  {doc.status === 'manquant' && <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-base text-slate-900">Aucune candidature déposée pour le moment</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Votre compte est actif et vos pièces d'identité sont validées. Consultez le catalogue des sujets de recherche pour déposer votre candidature doctorale.
          </p>
          <Link
            to="/sujets"
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3 rounded-xl text-xs transition-colors shadow-xs"
          >
            <span>Choisir un sujet de thèse</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
};
