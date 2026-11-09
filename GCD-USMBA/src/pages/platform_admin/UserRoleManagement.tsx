import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  PlusCircle,
  Building2,
  Lock,
  Unlock,
  Edit2
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { User, UserRole } from '../../types';
import { RoleBadge, ROLE_LABELS } from '../../components/common/RoleBadge';

const ALL_ROLES: UserRole[] = [
  'candidat',
  'enseignant_chercheur',
  'responsable_labo',
  'administration',
  'responsable_formation',
  'jury',
  'doctorant',
  'directeur_these',
  'responsable_gcd'
];

export const UserRoleManagement: React.FC = () => {
  const { currentUser, refreshUserData } = useAuth();
  const [users, setUsers] = useState<User[]>(storageService.getUsers());
  const [search, setSearch] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.firstName.toLowerCase().includes(q) ||
      u.lastName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.cin.toLowerCase().includes(q)
    );
  });

  const handleToggleRole = (role: UserRole) => {
    if (!editingUser) return;
    const exists = editingUser.roles.includes(role);
    let newRoles: UserRole[];
    if (exists) {
      if (editingUser.roles.length === 1) {
        alert('Un compte doit obligatoirement posséder au moins un rôle actif.');
        return;
      }
      newRoles = editingUser.roles.filter((r) => r !== role);
    } else {
      newRoles = [...editingUser.roles, role];
    }
    setEditingUser({ ...editingUser, roles: newRoles });
  };

  const handleSaveUser = () => {
    if (!editingUser) return;
    storageService.saveUser(editingUser);
    storageService.logAction(
      {
        id: currentUser?.id || 'admin',
        name: `${currentUser?.firstName} ${currentUser?.lastName}`,
        role: 'responsable_gcd'
      },
      'MODIFICATION_PERMISSIONS_RBAC',
      'utilisateur',
      editingUser.id,
      `Attribution des rôles : [${editingUser.roles.join(', ')}] pour ${editingUser.firstName} ${editingUser.lastName}`
    );
    setUsers(storageService.getUsers());
    setFeedback(`Droits et permissions mis à jour pour ${editingUser.firstName} ${editingUser.lastName}.`);
    setEditingUser(null);
    refreshUserData();
  };

  const handleToggleActive = (user: User) => {
    const updated = { ...user, isActive: !user.isActive };
    storageService.saveUser(updated);
    storageService.logAction(
      {
        id: currentUser?.id || 'admin',
        name: `${currentUser?.firstName} ${currentUser?.lastName}`,
        role: 'responsable_gcd'
      },
      updated.isActive ? 'ACTIVATION_COMPTE' : 'SUSPENSION_COMPTE',
      'utilisateur',
      user.id,
      `Compte ${user.email} ${updated.isActive ? 'réactivé' : 'suspendu'}.`
    );
    setUsers(storageService.getUsers());
    refreshUserData();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-3xl p-8 text-white shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-400/40 px-3 py-1 rounded-full text-teal-300 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          Gestion des Comptes, Profils & Permissions RBAC
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">
          Gestion des Utilisateurs & Autorisations d'Accès
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
          Attribution sécurisée des permissions multi-rôles, activation/suspension instantanée des comptes académiques et respect du principe du moindre privilège.
        </p>
      </div>

      {feedback && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Search and Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-bold text-base text-slate-900">
              Répertoire des Comptes Utilisateurs ({filteredUsers.length})
            </h3>
            <p className="text-xs text-slate-500">
              Un utilisateur peut cumuler plusieurs rôles (ex: Chercheur + Jury + Directeur)
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, e-mail, CIN..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold text-slate-600 uppercase border-b">
                <th className="py-3 px-4">Utilisateur</th>
                <th className="py-3 px-4">CIN / CNE</th>
                <th className="py-3 px-4">Rôles Attribués (Multi-Rôles)</th>
                <th className="py-3 px-4">État Compte</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{u.firstName} {u.lastName}</div>
                    <div className="text-[11px] text-slate-500">{u.email}</div>
                  </td>

                  <td className="py-3 px-4 font-mono font-bold text-slate-600">
                    {u.cin} {u.cne ? `• ${u.cne}` : ''}
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {u.roles.map((r) => (
                        <RoleBadge key={r} role={r} size="sm" />
                      ))}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        u.isActive
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {u.isActive ? 'Actif' : 'Suspendu'}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => setEditingUser(u)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-xl font-semibold transition-colors"
                    >
                      Modifier Rôles
                    </button>
                    <button
                      onClick={() => handleToggleActive(u)}
                      className={`px-3 py-1.5 rounded-xl font-semibold transition-colors ${
                        u.isActive
                          ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      }`}
                    >
                      {u.isActive ? 'Suspendre' : 'Réactiver'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Roles Modal (Activity 33) */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 space-y-5">
            <div>
              <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                Configuration des Droits d'Accès RBAC
              </span>
              <h3 className="font-extrabold text-base text-slate-900 mt-1">
                {editingUser.firstName} {editingUser.lastName} ({editingUser.email})
              </h3>
            </div>

            <div className="space-y-2 text-xs">
              <label className="block font-bold text-slate-700">
                Sélectionnez les rôles autorisés pour cet utilisateur (Multi-sélection autorisée) :
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto p-1">
                {ALL_ROLES.map((role) => {
                  const isChecked = editingUser.roles.includes(role);
                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => handleToggleRole(role)}
                      className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                        isChecked
                          ? 'bg-teal-50 border-teal-400 font-bold text-teal-950 shadow-2xs'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span>{ROLE_LABELS[role]}</span>
                      {isChecked && <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleSaveUser}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-2 rounded-xl text-xs transition-colors shadow-xs"
              >
                Sauvegarder les permissions
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
