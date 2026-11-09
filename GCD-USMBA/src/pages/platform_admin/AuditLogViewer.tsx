import React, { useState } from 'react';
import {
  History,
  Search,
  Filter,
  ShieldCheck,
  FileText,
  User,
  Clock,
  Download,
  Printer
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { RoleBadge } from '../../components/common/RoleBadge';

export const AuditLogViewer: React.FC = () => {
  const auditLogs = storageService.getAuditLogs();
  const [search, setSearch] = useState('');
  const [entityFilter, setEntityFilter] = useState('all');

  const filteredLogs = auditLogs.filter((log) => {
    const matchesEntity = entityFilter === 'all' || log.entityType === entityFilter;
    const q = search.toLowerCase();
    const matchesSearch =
      log.action.toLowerCase().includes(q) ||
      log.userName.toLowerCase().includes(q) ||
      log.details.toLowerCase().includes(q) ||
      log.entityId.toLowerCase().includes(q) ||
      log.ipAddress.includes(q);
    return matchesEntity && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-3xl p-8 text-white shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-400/40 px-3 py-1 rounded-full text-teal-300 text-xs font-semibold">
          <History className="w-3.5 h-3.5" />
          Journal d'Audit Système & Traçabilité des Statuts
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">
          Registre d'Audit des Opérations & Modifications
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
          Enregistrement certifié de chaque action sensible : horodatage à la seconde, identification de l'auteur, rôle exercé, ressource modifiée et adresse IP d'origine.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setEntityFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              entityFilter === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tous les événements ({auditLogs.length})
          </button>
          <button
            onClick={() => setEntityFilter('candidature')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              entityFilter === 'candidature'
                ? 'bg-teal-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Candidatures
          </button>
          <button
            onClick={() => setEntityFilter('sujet')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              entityFilter === 'sujet'
                ? 'bg-teal-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Sujets de Thèse
          </button>
          <button
            onClick={() => setEntityFilter('utilisateur')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              entityFilter === 'utilisateur'
                ? 'bg-teal-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Sécurité & Rôles
          </button>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Filtrer par auteur, action, IP..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Logs Table (Activity 34) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold text-slate-600 uppercase border-b">
                <th className="py-3 px-4">Horodatage & IP</th>
                <th className="py-3 px-4">Auteur & Rôle</th>
                <th className="py-3 px-4">Action Enregistrée</th>
                <th className="py-3 px-4">Cible / Ressource</th>
                <th className="py-3 px-4">Détails Opérationnels</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70">
                  <td className="py-3.5 px-4 font-mono">
                    <div className="font-bold text-slate-900">
                      {new Date(log.timestamp).toLocaleTimeString('fr-FR')}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {new Date(log.timestamp).toLocaleDateString('fr-FR')}
                    </div>
                    <div className="text-[10px] text-teal-700">{log.ipAddress}</div>
                  </td>

                  <td className="py-3.5 px-4 space-y-1">
                    <div className="font-bold text-slate-900">{log.userName}</div>
                    <RoleBadge role={log.userRole} size="sm" />
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-[11px] text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {log.action}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-mono font-semibold text-slate-600">
                    <span className="text-[10px] text-slate-400 block uppercase">
                      {log.entityType}
                    </span>
                    {log.entityId}
                  </td>

                  <td className="py-3.5 px-4 text-slate-600 leading-relaxed max-w-md">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
