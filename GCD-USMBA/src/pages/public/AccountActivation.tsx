import React, { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertCircle, RefreshCw, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AccountActivation: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialEmail = searchParams.get('email') || '';

  const [email, setEmail] = useState(initialEmail);
  const [activationStatus, setActivationStatus] = useState<'idle' | 'success' | 'resent'>('idle');
  const [message, setMessage] = useState('');

  const { activateAccount } = useAuth();
  const navigate = useNavigate();

  const handleActivate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const ok = activateAccount(email);
    if (ok) {
      setActivationStatus('success');
      setMessage('Votre compte a été vérifié et activé avec succès. Vous pouvez maintenant vous connecter.');
    } else {
      setMessage('Adresse e-mail introuvable. Veuillez vérifier ou créer un compte.');
    }
  };

  const handleResend = () => {
    setActivationStatus('resent');
    setMessage(`Un nouveau jeton d'activation a été généré instantanément pour ${email}.`);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center mx-auto">
          <ShieldCheck className="w-6 h-6" />
        </div>

        <div className="space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
            Activation & Vérification de Compte
          </span>
          <h1 className="text-xl font-black text-slate-900">
            Activation de votre Compte GCD
          </h1>
          <p className="text-xs text-slate-500">
            Vérifiez l'état de votre compte ou générez un renvoi immédiat du lien sans délai d'attente.
          </p>
        </div>

        {message && (
          <div
            className={`p-3.5 rounded-xl text-xs flex items-center gap-2 text-left ${
              activationStatus === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-blue-50 text-blue-800 border border-blue-200'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{message}</span>
          </div>
        )}

        {activationStatus !== 'success' ? (
          <form onSubmit={handleActivate} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Adresse e-mail du compte à activer
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom.prenom@usmba.ac.ma"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-xs transition-colors shadow-xs"
            >
              Activer automatiquement le compte
            </button>

            <button
              type="button"
              onClick={handleResend}
              className="w-full bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
              <span>Renvoyer le lien d'activation (Immédiat)</span>
            </button>
          </form>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
          >
            <span>Se connecter à mon compte</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}

        <div className="pt-2 text-xs text-slate-500">
          <Link to="/login" className="hover:underline font-semibold text-slate-700">
            Retour à la page de connexion
          </Link>
        </div>
      </div>
    </div>
  );
};
