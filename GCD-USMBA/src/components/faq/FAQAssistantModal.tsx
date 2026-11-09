import React, { useState } from 'react';
import { MessageSquare, Send, Bot, User as UserIcon, X, Sparkles, HelpCircle, AlertCircle, PhoneCall } from 'lucide-react';
import { storageService } from '../../services/storageService';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  officialRef?: string;
  timestamp: string;
}

export const FAQAssistantModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose
}) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'bot',
      text: 'Bonjour ! Je suis l\'Assistant Officiel du CEDoc USMBA. Je réponds exclusivement à partir de la réglementation en vigueur, des textes ministériels et des guides d\'admission de l\'Université Sidi Mohamed Ben Abdellah. Comment puis-je vous renseigner aujourd\'hui ?',
      officialRef: 'Source : Référentiel Officiel CEDoc USMBA 2026',
      timestamp: 'À l\'instant'
    }
  ]);

  if (!isOpen) return null;

  const faqs = storageService.getFAQ();

  const handleSend = (queryText?: string) => {
    const textToSend = (queryText || input).trim();
    if (!textToSend) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // Strictly grounded search against official FAQ items
    const lower = textToSend.toLowerCase();
    const matchedFaq = faqs.find((f) => {
      const qLower = f.question.toLowerCase();
      const aLower = f.answer.toLowerCase();
      const keywordHit = f.keywords.some((kw) => lower.includes(kw.toLowerCase()));
      return qLower.includes(lower) || aLower.includes(lower) || keywordHit;
    });

    setTimeout(() => {
      let botResponse: ChatMessage;

      if (matchedFaq) {
        botResponse = {
          id: `b-${Date.now()}`,
          sender: 'bot',
          text: matchedFaq.answer,
          officialRef: matchedFaq.officialRef || 'Règlement Intérieur du CEDoc USMBA',
          timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
        };
      } else {
        botResponse = {
          id: `b-${Date.now()}`,
          sender: 'bot',
          text: 'Information non répertoriée dans le référentiel officiel actuel. Afin de ne pas vous induire en erreur sur une règle ou un délai non validé, nous vous invitons à contacter directement le secrétariat du Centre d\'Études Doctorales (CEDoc) ou votre établissement de rattachement.',
          officialRef: 'Contact officiel : cedoc@usmba.ac.ma | Tél : +212 5 35 60 80 10',
          timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
        };
      }

      setMessages((prev) => [...prev, botResponse]);
    }, 400);
  };

  const quickQuestions = [
    'Quelles sont les conditions pour postuler ?',
    'Combien de sujets puis-je choisir ?',
    'Comment fonctionne le barème sur 20 ?',
    'Quelles pièces pour l\'inscription définitive ?',
    'Date limite pour la réinscription annuelle'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl flex flex-col h-[600px] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-900 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base">Assistant Réglementaire GCD</h3>
                <span className="text-[10px] bg-teal-500/30 text-teal-200 border border-teal-400/30 px-2 py-0.5 rounded-full font-medium">
                  Informations Officielles
                </span>
              </div>
              <p className="text-xs text-slate-300">Garantie sans hallucination — Base CEDoc USMBA</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'bot' && (
                <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl p-3.5 text-sm ${
                  m.sender === 'user'
                    ? 'bg-slate-900 text-white rounded-br-none shadow-xs'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-xs'
                }`}
              >
                <p className="leading-relaxed whitespace-pre-line">{m.text}</p>
                {m.officialRef && (
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-xs text-teal-700 font-medium">
                    <Sparkles className="w-3.5 h-3.5 shrink-0" />
                    <span>{m.officialRef}</span>
                  </div>
                )}
                <div className="mt-1 text-[10px] text-right opacity-60">{m.timestamp}</div>
              </div>
              {m.sender === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-slate-700 text-white flex items-center justify-center shrink-0">
                  <UserIcon className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick questions chips */}
        <div className="px-4 py-2 bg-slate-100/70 border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto text-xs scrollbar-none">
          <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-slate-500 font-medium shrink-0">Suggestions :</span>
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="shrink-0 bg-white hover:bg-teal-50 hover:text-teal-800 hover:border-teal-300 text-slate-600 px-2.5 py-1 rounded-full border border-slate-200 transition-colors shadow-2xs"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Posez votre question sur les démarches doctorales..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white px-4 py-2.5 rounded-xl font-medium text-sm flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <span>Envoyer</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
