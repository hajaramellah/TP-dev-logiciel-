import React, { useState } from 'react';
import {
  HelpCircle,
  Search,
  BookOpen,
  Sparkles,
  ChevronDown,
  ChevronUp,
  FileCheck,
  Building,
  GraduationCap,
  MessageSquare,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { FAQItem } from '../../types';
import { FAQAssistantModal } from '../../components/faq/FAQAssistantModal';

export const FaqHelp: React.FC = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({ 'faq-1': true, 'faq-2': true });
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  const faqs = storageService.getFAQ();

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const categories = [
    { id: 'all', label: 'Toutes les questions' },
    { id: 'candidature', label: 'Dépôt de candidature' },
    { id: 'selection', label: 'Sélection & Barème' },
    { id: 'inscription', label: 'Inscription administrative' },
    { id: 'reinscription', label: 'Réinscriptions annuelles' },
    { id: 'technique', label: 'Support technique & pièces' }
  ];

  const filteredFaqs = faqs.filter((item) => {
    const matchesCat = activeCategory === 'all' || item.category === activeCategory;
    const q = search.toLowerCase();
    const matchesSearch =
      item.question.toLowerCase().includes(q) ||
      item.answer.toLowerCase().includes(q) ||
      item.keywords.some((kw) => kw.toLowerCase().includes(q));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 text-teal-300 bg-teal-500/20 border border-teal-400/40 px-3 py-1 rounded-full text-xs font-semibold">
            <HelpCircle className="w-4 h-4" />
            Foire Aux Questions & Guide Réglementaire Officiel
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Base Officielle de Connaissances & FAQ
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Trouvez les réponses directes aux interrogations fréquentes relatives aux candidatures, critères de notation, pièces justificatives et réinscriptions à l'USMBA.
          </p>
        </div>

        <button
          onClick={() => setIsAssistantOpen(true)}
          className="shrink-0 inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-teal-400 text-slate-950 font-bold px-5 py-3 rounded-2xl text-xs shadow-lg hover:scale-102 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>Ouvrir l'Assistant Officiel</span>
        </button>
      </div>

      {/* Search and Category Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par mot-clé (ex: mention, pièces requises, barème, réinscription)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeCategory === c.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Accordion Questions List */}
      <div className="space-y-3">
        {filteredFaqs.map((faq) => {
          const isOpen = !!openItems[faq.id];
          return (
            <div
              key={faq.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleItem(faq.id)}
                className="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xs shrink-0">
                    ?
                  </span>
                  <span className="font-bold text-slate-900 text-xs sm:text-sm">
                    {faq.question}
                  </span>
                </div>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="px-6 pb-5 pt-1 text-xs text-slate-600 space-y-3 border-t border-slate-100 bg-slate-50/30">
                  <p className="leading-relaxed text-slate-800">{faq.answer}</p>
                  {faq.officialRef && (
                    <div className="flex items-center gap-2 text-[11px] font-semibold text-teal-800 bg-teal-50/80 p-2.5 rounded-xl border border-teal-200/60">
                      <GraduationCap className="w-4 h-4 text-teal-600 shrink-0" />
                      <span>Référence officielle : {faq.officialRef}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {filteredFaqs.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
            <HelpCircle className="w-8 h-8 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-800 text-xs">Aucune réponse exacte trouvée</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Posez directement votre question à l'assistant officiel ou contactez le secrétariat du CEDoc.
            </p>
            <button
              onClick={() => setIsAssistantOpen(true)}
              className="text-xs font-bold text-teal-700 hover:underline inline-flex items-center gap-1"
            >
              <span>Consulter l'Assistant Réglementaire</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      <FAQAssistantModal isOpen={isAssistantOpen} onClose={() => setIsAssistantOpen(false)} />
    </div>
  );
};
