import React, { useState } from 'react';
import {
  ClipboardList,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileCheck2,
  Send,
  Eye,
  UserCheck,
  Calendar,
  X,
  Clock,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { CandidateApplication, ApplicationStatus, DocumentType } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';

export const AdminApplicationsQueue: React.FC = () => {
  const { currentUser } = useAuth();
  const applications = storageService.getApplications();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedApp, setSelectedApp] = useState<CandidateApplication | null>(null);

  // Correction request modal state (Activity 11)
  const [correctionModalOpen, setCorrectionModalOpen] = useState(false);
  const [correctionComment, setCorrectionComment] = useState('');
  const [correctionDeadline, setCorrectionDeadline] = useState('2026-11-20');
  const [selectedDeficientDocs, setSelectedDeficientDocs] = useState<DocumentType[]>([]);

  const filteredApps = applications.filter((app) => {
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const q = search.toLowerCase();
    const matchesSearch =
      app.candidateName.toLowerCase().includes(q) ||
      app.referenceNumber.toLowerCase().includes(q) ||
      app.cin.toLowerCase().includes(q) ||
      app.discipline.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  // Action: Validate dossier as "Recevable" (Activity 13)
  const handleValidateRecevable = (app: CandidateApplication) => {
    const updated: CandidateApplication = {
      ...app,
      status: 'recevable',
      assignedReviewerId: currentUser?.id,
      assignedReviewerName: `${currentUser?.firstName} ${currentUser?.lastName}`,
      statusHistory: [
        {
          id: `sh-${Date.now()}`,
          status: 'recevable',
          comment: 'Conformité des pièces justificatives validée. Dossier déclaré recevable pour audition.',
          changedBy: `${currentUser?.firstName} ${currentUser?.lastName}`,
          timestamp: new Date().toISOString()
        },
        ...app.statusHistory
      ],
      updatedAt: new Date().toISOString()
    };

    storageService.saveApplication(updated, {
      id: currentUser?.id || 'admin',
      name: `${currentUser?.firstName} ${currentUser?.lastName}`,
      role: 'administration'
    });

    // Notify candidate
    storageService.addNotification({
      targetRole: 'candidat',
      userId: app.candidateId,
      title: `Candidature Recevable — ${app.referenceNumber}`,
      message: 'Félicitations, l\'instruction administrative de vos pièces est validée. Votre dossier est transmis à la commission de sélection.',
      category: 'candidature',
      link: '/candidat/dashboard'
    });

    setSelectedApp(updated);
  };

  // Action: Send correction notice (Activity 11)
  const handleSendCorrectionNotice = () => {
    if (!selectedApp) return;

    const newCorrection = {
      id: `corr-${Date.now()}`,
      applicationId: selectedApp.id,
      requestedBy: `${currentUser?.firstName} ${currentUser?.lastName} (Administration Scolarité)`,
      requestedAt: new Date().toISOString(),
      deadline: `${correctionDeadline}T23:59:59Z`,
      comment: correctionComment || 'Des pièces justificatives sont manquantes ou non conformes.',
      missingOrInvalidDocs: selectedDeficientDocs,
      isResolved: false
    };

    const updated: CandidateApplication = {
      ...selectedApp,
      status: 'correction_demandee',
      assignedReviewerId: currentUser?.id,
      assignedReviewerName: `${currentUser?.firstName} ${currentUser?.lastName}`,
      correctionRequests: [newCorrection, ...selectedApp.correctionRequests],
      statusHistory: [
        {
          id: `sh-${Date.now()}`,
          status: 'correction_demandee',
          comment: `Demande de correction formelle envoyée au candidat (Échéance: ${correctionDeadline}).`,
          changedBy: `${currentUser?.firstName} ${currentUser?.lastName}`,
          timestamp: new Date().toISOString()
        },
        ...selectedApp.statusHistory
      ],
      updatedAt: new Date().toISOString()
    };

    storageService.saveApplication(updated, {
      id: currentUser?.id || 'admin',
      name: `${currentUser?.firstName} ${currentUser?.lastName}`,
      role: 'administration'
    });

    // Automatic push notification to candidate (Activity 11)
    storageService.addNotification({
      targetRole: 'candidat',
      userId: selectedApp.candidateId,
      title: `Régularisation requise — Dossier ${selectedApp.referenceNumber}`,
      message: `Attention : des pièces de votre dossier nécessitent une correction avant le ${correctionDeadline}. Consultez votre espace de correction.`,
      category: 'candidature',
      link: '/candidat/corrections'
    });

    setCorrectionModalOpen(false);
    setSelectedApp(updated);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-3xl p-8 text-white shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-400/40 px-3 py-1 rounded-full text-teal-300 text-xs font-semibold">
          <ClipboardList className="w-3.5 h-3.5" />
          Module C — Gestion des Dossiers de Candidature
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">
          File d'Instruction Administrative des Candidatures
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
          Classement automatique, détection en temps réel des documents non conformes, envoi immédiat des demandes de régularisation et validation numérique de recevabilité.
        </p>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              statusFilter === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tous les dossiers ({applications.length})
          </button>
          <button
            onClick={() => setStatusFilter('soumise')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              statusFilter === 'soumise'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Nouveaux / À instruire ({applications.filter((a) => a.status === 'soumise').length})
          </button>
          <button
            onClick={() => setStatusFilter('correction_demandee')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              statusFilter === 'correction_demandee'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Corrections en cours ({applications.filter((a) => a.status === 'correction_demandee').length})
          </button>
          <button
            onClick={() => setStatusFilter('recevable')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              statusFilter === 'recevable'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Recevables ({applications.filter((a) => a.status === 'recevable').length})
          </button>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par référence, CIN, nom..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Applications Table (Activity 9) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">Réf & Date</th>
                <th className="py-3 px-4">Candidat (CIN/CNE)</th>
                <th className="py-3 px-4">Sujet & Labo</th>
                <th className="py-3 px-4">Contrôle Pièces</th>
                <th className="py-3 px-4">Statut & Instructeur</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredApps.map((app) => {
                const totalDocs = app.documents.length;
                const validDocs = app.documents.filter((d) => d.status === 'valide').length;
                const invalidDocs = app.documents.filter((d) => d.status === 'rejete' || d.status === 'manquant').length;

                return (
                  <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-slate-900">{app.referenceNumber}</div>
                      <div className="text-[10px] text-slate-400">
                        {new Date(app.submittedAt).toLocaleDateString('fr-FR')}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 space-y-0.5">
                      <div className="font-bold text-slate-900">{app.candidateName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">CIN: {app.cin}</div>
                      <div className="text-[10px] text-slate-400">{app.masterSpecialty}</div>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs truncate">
                      <div className="font-medium text-slate-900 truncate">{app.subjectTitle}</div>
                      <div className="text-[10px] text-teal-700 font-semibold">
                        Labo : {app.laboratoryId.toUpperCase()} • Dir : {app.supervisorName}
                      </div>
                    </td>

                    {/* Automatic document format and presence check (Activity 10) */}
                    <td className="py-3.5 px-4">
                      {invalidDocs > 0 ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          {invalidDocs} anomalie(s) détectée(s)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {validDocs}/{totalDocs} conformes
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 space-y-0.5">
                      <StatusBadge status={app.status} size="sm" />
                      <div className="text-[10px] text-slate-400">
                        Resp: {app.assignedReviewerName || 'En attente d\'attribution'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs transition-colors shadow-2xs inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Instruire</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Instruction Drawer / Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-teal-300">
                    {selectedApp.referenceNumber}
                  </span>
                  <StatusBadge status={selectedApp.status} size="sm" />
                </div>
                <h3 className="font-extrabold text-base mt-1">{selectedApp.candidateName}</h3>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
              {/* Identity & Master details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-slate-400 font-semibold block">Identité & Contact</span>
                  <span className="font-bold text-slate-900">{selectedApp.candidateName}</span>
                  <div className="text-slate-500 font-mono">CIN : {selectedApp.cin}</div>
                  <div className="text-slate-500">{selectedApp.candidateEmail}</div>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block">Master & Mention</span>
                  <span className="font-bold text-slate-900">{selectedApp.masterSpecialty}</span>
                  <div className="text-slate-500">{selectedApp.masterOriginUniversity}</div>
                  <div className="text-emerald-700 font-bold">Mention : {selectedApp.masterMention}</div>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block">Affectation & Thèse</span>
                  <span className="font-bold text-slate-900">{selectedApp.discipline}</span>
                  <div className="text-slate-500">Labo : {selectedApp.laboratoryId.toUpperCase()}</div>
                  <div className="text-slate-500">Dir : {selectedApp.supervisorName}</div>
                </div>
              </div>

              {/* Document verification controls (Activity 10) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                    Contrôle des pièces justificatives ({selectedApp.documents.length})
                  </h4>
                  <span className="text-slate-400 text-[11px]">
                    Vérification de présence et de format
                  </span>
                </div>

                <div className="space-y-2">
                  {selectedApp.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between gap-3"
                    >
                      <div className="space-y-0.5">
                        <div className="font-bold text-slate-900">{doc.label}</div>
                        <div className="text-[11px] text-slate-500">
                          Fichier : <span className="font-mono text-slate-700">{doc.fileName || 'Non fourni'}</span>
                          {doc.rejectionReason && (
                            <span className="text-rose-600 block mt-0.5">
                              Motif : {doc.rejectionReason}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        {doc.status === 'valide' ? (
                          <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Conforme
                          </span>
                        ) : doc.status === 'rejete' ? (
                          <span className="text-xs text-rose-700 font-bold bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200 flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5" /> Rejeté
                          </span>
                        ) : (
                          <span className="text-xs text-amber-700 font-bold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> En cours
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status History */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                  Historique d'instruction
                </h4>
                <div className="space-y-1.5">
                  {selectedApp.statusHistory.map((sh) => (
                    <div key={sh.id} className="text-[11px] text-slate-500 flex items-center justify-between bg-slate-50 p-2 rounded-lg">
                      <span><strong>{sh.changedBy}</strong> : {sh.comment || sh.status}</span>
                      <span className="font-mono">{new Date(sh.timestamp).toLocaleTimeString('fr-FR')}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={() => setSelectedApp(null)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Fermer
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {/* Button: Correction demandée (Activity 11) */}
                <button
                  onClick={() => {
                    setSelectedDeficientDocs(['releves_notes', 'attestation_non_travail']);
                    setCorrectionModalOpen(true);
                  }}
                  className="bg-white border border-rose-300 text-rose-700 hover:bg-rose-50 px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Demander régularisation (Activité 11)</span>
                </button>

                {/* Button: Valider recevable (Activity 13) */}
                <button
                  onClick={() => handleValidateRecevable(selectedApp)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Valider comme Recevable (Activité 13)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Correction Notice Modal (Activity 11) */}
      {correctionModalOpen && selectedApp && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>Notification de Dossier Incomplet (Activité N°11)</span>
            </div>
            <p className="text-xs text-slate-600">
              Régularisation adressée au candidat {selectedApp.candidateName} pour le dossier {selectedApp.referenceNumber}.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Date limite de correction impérative :
                </label>
                <input
                  type="date"
                  value={correctionDeadline}
                  onChange={(e) => setCorrectionDeadline(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Message explicatif des pièces à rectifier / motifs du rejet :
                </label>
                <textarea
                  rows={4}
                  required
                  value={correctionComment}
                  onChange={(e) => setCorrectionComment(e.target.value)}
                  placeholder="Ex : Relevé de notes S4 non authentifié par le cachet de la faculté. Merci de fournir un duplicata légalisé..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCorrectionModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleSendCorrectionNotice}
                className="bg-rose-700 hover:bg-rose-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-colors shadow-xs flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Envoyer la notification automatique</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
