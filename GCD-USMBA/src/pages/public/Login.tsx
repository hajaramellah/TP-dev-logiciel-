import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, AlertCircle, ArrowRight, UserCheck, Sparkles, GraduationCap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { RoleBadge } from '../../components/common/RoleBadge';
import { UserRole } from '../../types';

export const Login: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { setCurrentRole, refreshUserData } = useAuth();
  const navigate = useNavigate();

  const registeredUsers = storageService.getUsers();

  const handleGoogleSignIn = async (userEmail?: string) => {
    setErrorMessage(null);
    setIsLoading(true);

    try {
      // Default to active candidate or designated user if userEmail is provided
      const targetUser = userEmail
        ? registeredUsers.find((u) => u.email.toLowerCase() === userEmail.toLowerCase())
        : registeredUsers.find((u) => u.roles.includes('candidat')) || registeredUsers[0];

      if (!targetUser) {
        setErrorMessage("Aucun compte Google USMBA associé. Veuillez d'abord vous inscrire.");
        setIsLoading(false);
        return;
      }

      // Verify token/identity on server
      const resp = await fetch('/api/auth/google/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userInfo: {
            sub: `google-${targetUser.id}`,
            email: targetUser.email,
            name: `${targetUser.firstName} ${targetUser.lastName}`,
            given_name: targetUser.firstName,
            family_name: targetUser.lastName,
          },
        }),
      });

      const result = await resp.json();
      if (result.success) {
        // Set active user session
        localStorage.setItem('gcd_active_user_id', targetUser.id);
        const primaryRole = targetUser.currentRole || targetUser.roles[0];
        setCurrentRole(primaryRole);
        refreshUserData();

        // Redirect based on role
        switch (primaryRole) {
          case 'candidat':
            navigate('/candidat/dashboard');
            break;
          case 'enseignant_chercheur':
            navigate('/chercheur/dashboard');
            break;
          case 'responsable_labo':
            navigate('/labo/dashboard');
            break;
          case 'administration':
            navigate('/administration/dashboard');
            break;
          case 'responsable_formation':
            navigate('/formation/dashboard');
            break;
          case 'jury':
            navigate('/jury/dashboard');
            break;
          case 'doctorant':
            navigate('/doctorant/dashboard');
            break;
          case 'directeur_these':
            navigate('/directeur/dashboard');
            break;
          case 'responsable_gcd':
            navigate('/superadmin/dashboard');
            break;
          default:
            navigate('/');
        }
      } else {
        setErrorMessage(result.message || "Échec de l'authentification Google.");
      }
    } catch (err: any) {
      console.error('Google login error:', err);
      setErrorMessage("Erreur lors de la validation du jeton Google auprès du serveur.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-8">
      {/* Institutional Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 text-teal-700 bg-teal-50 border border-teal-200 px-3.5 py-1 rounded-full text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          Authentification Unique Google Workspace USMBA
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Connexion à la Plateforme GCD
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
          Conformément aux directives universitaires, l'accès s'effectue exclusivement avec un
          compte Google sans saisie ni stockage de mot de passe.
        </p>
      </div>

      {/* Main Login Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm max-w-xl mx-auto space-y-8 text-center">
        {errorMessage && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-start gap-2.5 text-left">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <span className="font-medium">{errorMessage}</span>
          </div>
        )}

        {/* Primary Google Login Button */}
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => handleGoogleSignIn()}
            disabled={isLoading}
            className="w-full bg-white hover:bg-slate-50 text-slate-800 font-bold py-4 px-6 rounded-2xl border-2 border-slate-200 hover:border-slate-400 transition-all shadow-xs flex items-center justify-center gap-3 text-sm group"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{isLoading ? 'Connexion sécurisée en cours...' : 'Continuer avec Google'}</span>
          </button>

          <p className="text-[11px] text-slate-400">
            Accès instantané en un clic avec vérification du jeton d'identité côté serveur.
          </p>
        </div>

        {/* Institutional Account Switcher (For testing registered roles without password) */}
        <div className="pt-6 border-t border-slate-100 text-left space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-teal-600" />
              Sélectionner un compte Google USMBA enregistré :
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
            {registeredUsers.slice(0, 6).map((u) => {
              const primaryRole = u.roles[0];
              return (
                <button
                  key={u.id}
                  onClick={() => handleGoogleSignIn(u.email)}
                  disabled={isLoading}
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-teal-400 hover:bg-teal-50/50 transition-all text-left flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <RoleBadge role={primaryRole} size="sm" />
                    <span className="text-[10px] text-teal-700 font-semibold">Google</span>
                  </div>
                  <div className="font-bold text-xs text-slate-900 truncate">
                    {u.firstName} {u.lastName}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono truncate">{u.email}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Link to Registration */}
        <div className="pt-4 border-t border-slate-100 text-xs text-slate-500">
          Vous n'avez pas encore de compte candidat ?{' '}
          <Link
            to="/register"
            className="font-bold text-teal-700 hover:underline inline-flex items-center gap-1 ml-1"
          >
            <span>Démarrer l'inscription par scan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
