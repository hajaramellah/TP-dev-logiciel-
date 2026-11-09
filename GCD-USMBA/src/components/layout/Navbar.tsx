import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bell,
  User as UserIcon,
  LogOut,
  Sparkles,
  ChevronDown,
  GraduationCap,
  Menu,
  BookOpen,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { ROLE_LABELS, RoleBadge } from '../common/RoleBadge';
import { storageService } from '../../services/storageService';
import { FAQAssistantModal } from '../faq/FAQAssistantModal';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const {
    currentUser,
    currentRole,
    logout,
    unreadNotificationsCount,
    refreshUserData
  } = useAuth();
  const navigate = useNavigate();

  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [faqModalOpen, setFaqModalOpen] = useState(false);

  const notifications = storageService.getNotifications();
  const userNotifications = notifications
    .filter((n) => !n.userId || n.userId === currentUser?.id || n.targetRole === currentRole)
    .slice(0, 6);

  const handleMarkAllNotifs = () => {
    storageService.markAllNotificationsAsRead({ userId: currentUser?.id, role: currentRole });
    refreshUserData();
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-2xs">
        {/* Top institutional strip */}
        <div className="bg-slate-900 text-slate-300 text-[11px] px-4 py-1.5 flex flex-wrap items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="font-semibold tracking-wide text-white">UNIVERSITÉ SIDI MOHAMED BEN ABDELLAH — FÈS</span>
            <span className="hidden sm:inline text-slate-500">|</span>
            <span className="hidden sm:inline text-teal-400 font-medium">Centre d'Études Doctorales (CEDoc)</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-slate-300 text-[10px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Plateforme Officielle GCD • Session 2026-2027
            </span>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Left: Brand & Mobile Menu toggle */}
          <div className="flex items-center gap-3">
            {onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
                title="Menu de navigation"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-900 to-teal-800 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6 text-teal-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base tracking-tight text-slate-900">
                    GCD <span className="text-teal-600">USMBA</span>
                  </span>
                  <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                    CEDoc
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 font-medium leading-none">
                  Gestion du Cycle Doctoral
                </div>
              </div>
            </Link>
          </div>

          {/* Quick links */}
          <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <Link to="/sujets" className="hover:text-teal-700 transition-colors">
              Catalogue des Sujets
            </Link>
            <Link to="/faq-aide" className="hover:text-teal-700 transition-colors">
              Réglementation & FAQ
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Official FAQ Assistant Trigger */}
            <button
              onClick={() => setFaqModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 px-3 py-1.5 rounded-xl transition-all shadow-xs"
              title="Assistant Réglementaire Officiel"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Assistant Réglementaire</span>
            </button>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
                title="Centre de notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>

              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Notifications & Alertes</h4>
                      <p className="text-[11px] text-slate-500">
                        {unreadNotificationsCount} non lue(s)
                      </p>
                    </div>
                    {unreadNotificationsCount > 0 && (
                      <button
                        onClick={handleMarkAllNotifs}
                        className="text-[11px] text-teal-700 hover:underline font-semibold"
                      >
                        Tout marquer comme lu
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {userNotifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-500">
                        Aucune nouvelle notification pour le moment.
                      </div>
                    ) : (
                      userNotifications.map((n) => (
                        <div
                          key={n.id}
                          className={`p-3.5 text-xs space-y-1 transition-colors ${
                            !n.isRead ? 'bg-teal-50/40' : 'hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-900">{n.title}</span>
                            <span className="text-[10px] text-slate-400">
                              {new Date(n.createdAt).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                          <p className="text-slate-600 text-[11px] leading-relaxed">{n.message}</p>
                          {n.link && (
                            <Link
                              to={n.link}
                              onClick={() => {
                                setNotifDropdownOpen(false);
                                storageService.markNotificationAsRead(n.id);
                                refreshUserData();
                              }}
                              className="inline-block mt-1 text-[11px] font-semibold text-teal-700 hover:underline"
                            >
                              Consulter la démarche →
                            </Link>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {currentUser?.firstName?.[0] || 'U'}
                  {currentUser?.lastName?.[0] || ''}
                </div>
                <div className="hidden lg:block text-left">
                  <div className="text-xs font-bold text-slate-900 leading-tight">
                    {currentUser?.firstName} {currentUser?.lastName}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate max-w-[120px]">
                    {ROLE_LABELS[currentRole]}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">
                      {currentUser?.firstName} {currentUser?.lastName}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate font-mono">{currentUser?.email}</p>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <RoleBadge role={currentRole} size="sm" />
                      <span className="text-[10px] text-slate-400 font-mono">CIN: {currentUser?.cin}</span>
                    </div>
                  </div>

                  <div className="py-1 text-xs">
                    <Link
                      to="/candidat/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                    >
                      <GraduationCap className="w-4 h-4 text-slate-400" />
                      Mon Espace
                    </Link>
                    <Link
                      to="/faq-aide"
                      onClick={() => setUserDropdownOpen(false)}
                      className="px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                    >
                      <HelpCircle className="w-4 h-4 text-slate-400" />
                      Aide & FAQ USMBA
                    </Link>
                    <Link
                      to="/sujets"
                      onClick={() => setUserDropdownOpen(false)}
                      className="px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                    >
                      <BookOpen className="w-4 h-4 text-slate-400" />
                      Catalogue des Sujets
                    </Link>
                  </div>

                  <div className="border-t border-slate-100 pt-1 text-xs">
                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                        navigate('/login');
                      }}
                      className="w-full text-left px-4 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      Déconnexion
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Official FAQ Modal */}
      <FAQAssistantModal isOpen={faqModalOpen} onClose={() => setFaqModalOpen(false)} />
    </>
  );
};
