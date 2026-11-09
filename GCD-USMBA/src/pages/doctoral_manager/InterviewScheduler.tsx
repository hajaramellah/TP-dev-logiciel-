import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  PlusCircle,
  CheckCircle2,
  AlertTriangle,
  Send,
  Video,
  FileSignature
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { InterviewSlot } from '../../types';

export const InterviewScheduler: React.FC = () => {
  const { currentUser } = useAuth();
  const slots = storageService.getInterviews();
  const applications = storageService.getApplications().filter((a) => a.status === 'recevable' || a.status === 'entretien_programme');

  const [date, setDate] = useState('2026-11-14');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('09:45');
  const [room, setRoom] = useState('Salle des Thèses 1 — Bâtiment Recherche FSDM');
  const [selectedJuryMembers, setSelectedJuryMembers] = useState('Pr. Abdelhafid EL ALAOUI, Pr. Mohammed ZOUHAIR');
  const [targetAppId, setTargetAppId] = useState(applications[0]?.id || '');
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const checkConflict = (checkDate: string, checkStart: string, checkRoom: string) => {
    return slots.find(
      (s) => s.date === checkDate && s.startTime === checkStart && s.roomOrLink.includes(checkRoom)
    );
  };

  const handleCreateSlot = (e: React.FormEvent) => {
    e.preventDefault();
    setConflictWarning(null);
    setSuccessMsg(null);

    // Conflict detection (Activity 15)
    const conflict = checkConflict(date, startTime, room);
    if (conflict) {
      setConflictWarning(`Conflit d'horaire détecté : La salle ou le créneau ${date} à ${startTime} est déjà réservé.`);
      return;
    }

    const app = applications.find((a) => a.id === targetAppId);
    const juryArray = selectedJuryMembers.split(',').map((j) => j.trim()).filter(Boolean);

    const newSlot: InterviewSlot = {
      id: `slot-${Date.now()}`,
      date,
      startTime,
      endTime,
      roomOrLink: room,
      juryMemberNames: juryArray,
      applicationId: app?.id,
      candidateName: app?.candidateName,
      subjectTitle: app?.subjectTitle,
      isBooked: !!app,
      notificationSent: true
    };

    storageService.saveInterviewSlot(newSlot, {
      id: currentUser?.id || 'formation',
      name: `Pr. ${currentUser?.firstName} ${currentUser?.lastName}`,
      role: 'responsable_formation'
    });

    // Update application status to "entretien_programme"
    if (app) {
      const updatedApp = {
        ...app,
        status: 'entretien_programme' as const,
        statusHistory: [
          {
            id: `sh-${Date.now()}`,
            status: 'entretien_programme' as const,
            comment: `Entretien oral programmé le ${date} à ${startTime}. Convocation envoyée.`,
            changedBy: `Pr. ${currentUser?.firstName} ${currentUser?.lastName} (Resp. Formation Doctorale)`,
            timestamp: new Date().toISOString()
          },
          ...app.statusHistory
        ]
      };
      storageService.saveApplication(updatedApp, {
        id: currentUser?.id || 'formation',
        name: `Pr. ${currentUser?.firstName} ${currentUser?.lastName}`,
        role: 'responsable_formation'
      });

      // Send digital convocation notification (Activity 16)
      storageService.addNotification({
        targetRole: 'candidat',
        userId: app.candidateId,
        title: 'Convocation Officielle à l\'Audition Orale',
        message: `Votre entretien aura lieu le ${date} à ${startTime} (${room}). Téléchargez votre convocation.`,
        category: 'entretien',
        link: '/candidat/convocation'
      });
    }

    setSuccessMsg('Créneau d\'audition programmé sans conflit et convocation transmise au candidat !');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-teal-300 bg-teal-500/20 border border-teal-400/40 px-3 py-1 rounded-full text-xs font-semibold">
            <Calendar className="w-3.5 h-3.5" />
            Planification & Calendrier des Auditions
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Coordination des Entretiens de Sélection
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Planification unifiée évitant les chevauchements de salles et d'horaires des membres de jury. Envoi automatisé des convocations aux candidats déclarés recevables.
          </p>
        </div>

        <Link
          to="/formation/pv-validation"
          className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-5 py-2.5 rounded-xl text-xs font-bold transition-colors backdrop-blur-xs flex items-center gap-2"
        >
          <FileSignature className="w-4 h-4 text-teal-300" />
          <span>Validation du Procès-Verbal</span>
        </Link>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {conflictWarning && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{conflictWarning}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Scheduling Form */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-teal-600" />
              <span>Programmer une Audition Orale</span>
            </h3>
            <p className="text-[11px] text-slate-500">
              Détection automatique des conflits de disponibilité
            </p>
          </div>

          <form onSubmit={handleCreateSlot} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Candidat recevable à convoquer
              </label>
              <select
                value={targetAppId}
                onChange={(e) => setTargetAppId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
              >
                {applications.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.candidateName} — {a.referenceNumber} ({a.discipline})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Début</label>
                <input
                  type="time"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Fin</label>
                <input
                  type="time"
                  required
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Lieu physique ou lien de visioconférence
              </label>
              <input
                type="text"
                required
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                placeholder="Salle des Thèses / Google Meet"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Composition du Jury (séparés par des virgules)
              </label>
              <input
                type="text"
                required
                value={selectedJuryMembers}
                onChange={(e) => setSelectedJuryMembers(e.target.value)}
                placeholder="Pr. Nom 1, Pr. Nom 2..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-xs transition-colors shadow-xs flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Valider le créneau & Émettre la convocation</span>
            </button>
          </form>
        </div>

        {/* Existing Slots Calendar */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-600" />
              <span>Planning Centralisé des Auditions ({slots.length})</span>
            </h3>
            <span className="text-xs text-slate-500">
              {slots.filter((s) => s.isBooked).length} créneau(x) assigné(s)
            </span>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {slots.map((s) => (
              <div
                key={s.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-teal-900">
                    {new Date(s.date).toLocaleDateString('fr-FR', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short'
                    })}{' '}
                    • {s.startTime} - {s.endTime}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      s.isBooked ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {s.isBooked ? 'Assigné' : 'Libre'}
                  </span>
                </div>

                {s.candidateName && (
                  <div className="font-bold text-slate-900 text-sm">
                    {s.candidateName}
                  </div>
                )}

                <div className="text-slate-600 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{s.roomOrLink}</span>
                </div>

                <div className="text-[11px] text-slate-500">
                  <strong>Jury :</strong> {s.juryMemberNames.join(' • ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
