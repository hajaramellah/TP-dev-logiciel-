import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ShieldCheck, Heart, Layers, HelpCircle, RefreshCw } from 'lucide-react';
import { storageService } from '../../services/storageService';

export const Footer: React.FC = () => {
  const handleResetData = () => {
    if (window.confirm('Voulez-vous réinitialiser toutes les données de démonstration de la plateforme GCD ?')) {
      storageService.resetToDefaults();
      window.location.reload();
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1 */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5 text-teal-200" />
              </div>
              <span>GCD USMBA — Version Améliorée</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-lg">
              Plateforme numérique de gestion intégrale du cycle doctoral (admission, instruction, audition, procès-verbal, inscription administrative et réinscriptions annuelles).
            </p>
            <div className="text-[11px] text-amber-300/90 bg-amber-950/40 border border-amber-800/60 p-2.5 rounded-xl max-w-lg">
              <strong>Notice académique :</strong> Cette application constitue un projet académique d'amélioration et de modernisation fonctionnelle fondé sur l'analyse des 36 activités et problèmes du cycle doctoral de l'Université Sidi Mohamed Ben Abdellah (USMBA, Fès, Maroc).
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-2">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white">Navigation Rapide</h5>
            <ul className="space-y-1.5">
              <li>
                <Link to="/matrice-36-activites" className="hover:text-teal-400 transition-colors">
                  Matrice des 36 Solutions (PDF)
                </Link>
              </li>
              <li>
                <Link to="/sujets" className="hover:text-teal-400 transition-colors">
                  Catalogue des Sujets de Thèse
                </Link>
              </li>
              <li>
                <Link to="/candidat/postuler" className="hover:text-teal-400 transition-colors">
                  Espace Dépôt de Candidature
                </Link>
              </li>
              <li>
                <Link to="/faq-aide" className="hover:text-teal-400 transition-colors">
                  FAQ & Règlements CEDoc
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-2">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white">Outils Démonstrateur</h5>
            <p className="text-[11px] text-slate-400">
              Testez les 9 rôles du cycle doctoral en 1 clic grâce au sélecteur dans la barre supérieure.
            </p>
            <button
              onClick={handleResetData}
              className="inline-flex items-center gap-1.5 text-xs text-rose-300 hover:text-white bg-rose-950/50 hover:bg-rose-900/60 border border-rose-800/60 px-3 py-1.5 rounded-lg transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Réinitialiser les données démo
            </button>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <div>
            © 2026 Université Sidi Mohamed Ben Abdellah — CEDoc Fès. Tous droits réservés.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              Conformité CNPND Décret 2-23-64
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
