import React, { useState } from 'react';
import {
  Inbox,
  Send,
  Mail,
  User,
  CheckCircle2,
  Clock,
  Search,
  MessageSquare,
  ShieldCheck
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { PlatformMessage } from '../../types';

export const AdminMessaging: React.FC = () => {
  const { currentUser } = useAuth();
  const messages = storageService.getMessages();
  const users = storageService.getUsers().filter((u) => u.roles.includes('candidat') || u.roles.includes('doctorant'));

  const [activeMessage, setActiveMessage] = useState<PlatformMessage | null>(messages[0] || null);
  const [recipientId, setRecipientId] = useState(users[0]?.id || '');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [relatedEntityId, setRelatedEntityId] = useState('USMBA-DOC-2026-7842');
  const [sendSuccess, setSendSuccess] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientId || !subject || !content) return;

    const recipient = users.find((u) => u.id === recipientId);

    storageService.sendMessage({
      senderId: currentUser?.id || 'admin',
      senderName: `${currentUser?.firstName} ${currentUser?.lastName} (Administration Scolarité)`,
      senderRole: 'administration',
      recipientId,
      recipientName: recipient ? `${recipient.firstName} ${recipient.lastName}` : 'Candidat USMBA',
      subject,
      content,
      relatedEntityId
    });

    // Notify recipient
    storageService.addNotification({
      targetRole: recipient?.currentRole || 'candidat',
      userId: recipientId,
      title: `Nouveau message officiel : ${subject}`,
      message: `L'administration du CEDoc vous a adressé une communication relative au dossier ${relatedEntityId}.`,
      category: 'systeme',
      link: '/messagerie'
    });

    setSubject('');
    setContent('');
    setSendSuccess(true);
    setTimeout(() => setSendSuccess(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-3xl p-8 text-white shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-400/40 px-3 py-1 rounded-full text-teal-300 text-xs font-semibold">
          <Inbox className="w-3.5 h-3.5" />
          Messagerie & Communications Institutionnelles
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">
          Canal de Communication Officiel Candidats & Doctorants
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
          Fin de la dispersion des échanges par e-mails informels : toutes les communications sont tracées et directement rattachées aux numéros de dossiers académiques.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Mail className="w-4 h-4 text-teal-600" />
              <span>Communications échangées ({messages.length})</span>
            </h3>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {messages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => setActiveMessage(msg)}
                className={`p-4 rounded-2xl border text-xs cursor-pointer transition-all ${
                  activeMessage?.id === msg.id
                    ? 'border-teal-500 bg-teal-50/40 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900 truncate max-w-[180px]">
                    {msg.recipientName}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(msg.createdAt).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <div className="font-semibold text-slate-800 line-clamp-1">{msg.subject}</div>
                <div className="text-slate-500 line-clamp-2 mt-1">{msg.content}</div>
                {msg.relatedEntityId && (
                  <span className="inline-block mt-2 text-[10px] font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                    Réf : {msg.relatedEntityId}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Compose Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Send className="w-4 h-4 text-teal-600" />
              <span>Nouvelle Communication Officielle</span>
            </h3>
            {sendSuccess && (
              <span className="text-xs text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Message transmis !
              </span>
            )}
          </div>

          <form onSubmit={handleSendMessage} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Destinataire (Candidat ou Doctorant)
              </label>
              <select
                value={recipientId}
                onChange={(e) => setRecipientId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.firstName} {u.lastName} ({u.email} — CIN: {u.cin})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Référence du dossier rattaché
                </label>
                <input
                  type="text"
                  value={relatedEntityId}
                  onChange={(e) => setRelatedEntityId(e.target.value)}
                  placeholder="ex: USMBA-DOC-2026-7842"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-mono uppercase focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Objet du message officiel
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="ex: Demande de précision sur relevé S4..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Contenu du message
              </label>
              <textarea
                rows={6}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Rédigez votre directive officielle..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 leading-relaxed"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-colors flex items-center gap-2 shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Envoyer la communication certifiée</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
