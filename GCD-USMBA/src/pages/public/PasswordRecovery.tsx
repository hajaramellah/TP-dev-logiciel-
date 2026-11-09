import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export const PasswordRecovery: React.FC = () => {
  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center mx-auto shadow-xs">
          <ShieldCheck className="w-7 h-7 text-teal-600" />
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-black text-slate-900">
            Authentification Unique Google
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            La plateforme de gestion du cycle doctoral (GCD) utilise exclusivement l'authentification Google OAuth 2.0. Aucun mot de passe local n'est stocké ou requis.
          </p>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-2 text-left">
          <p className="font-semibold text-slate-800">Comment accéder à votre compte ?</p>
          <p>
            Connectez-vous directement en un clic avec votre compte Google associé à votre identité lors de l'inscription.
          </p>
        </div>

        <Link
          to="/login"
          className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-6 rounded-2xl text-xs transition-colors shadow-xs"
        >
          <span>Aller à la connexion Google</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
