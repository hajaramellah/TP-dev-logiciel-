import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { storageService } from '../services/storageService';
import { DEMO_USERS } from '../data/seedData';

interface AuthContextType {
  currentUser: User | null;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  switchDemoUser: (userId: string, role?: UserRole) => void;
  switchRoleQuick: (role: UserRole) => void;
  login: (email: string, password?: string) => { success: boolean; message: string };
  register: (userData: Partial<User>) => { success: boolean; message: string; user?: User; activationToken?: string };
  logout: () => void;
  activateAccount: (email: string) => boolean;
  requestPasswordReset: (email: string) => { success: boolean; token: string; message: string };
  resetPassword: (token: string, newPass: string) => boolean;
  unreadNotificationsCount: number;
  refreshUserData: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to the first candidate for realistic preview
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('gcd_active_user_id');
    const users = storageService.getUsers();
    if (saved) {
      const found = users.find((u) => u.id === saved);
      if (found) return found;
    }
    return users[0] || DEMO_USERS[0];
  });

  const [currentRole, setCurrentRoleState] = useState<UserRole>(() => {
    return currentUser?.currentRole || 'candidat';
  });

  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState<number>(0);

  const refreshNotifications = () => {
    const notifs = storageService.getNotifications();
    const count = notifs.filter(
      (n) => !n.isRead && (!n.userId || n.userId === currentUser?.id || n.targetRole === currentRole)
    ).length;
    setUnreadNotificationsCount(count);
  };

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('gcd_active_user_id', currentUser.id);
    }
    refreshNotifications();
  }, [currentUser, currentRole]);

  const setCurrentRole = (role: UserRole) => {
    setCurrentRoleState(role);
    if (currentUser) {
      const updated = { ...currentUser, currentRole: role };
      if (!updated.roles.includes(role)) {
        updated.roles = [...updated.roles, role];
      }
      storageService.saveUser(updated);
      setCurrentUser(updated);
    }
  };

  const switchDemoUser = (userId: string, role?: UserRole) => {
    const user = storageService.getUserById(userId);
    if (user) {
      const targetRole = role || user.currentRole || user.roles[0];
      const updated = { ...user, currentRole: targetRole };
      storageService.saveUser(updated);
      setCurrentUser(updated);
      setCurrentRoleState(targetRole);
    }
  };

  // Quick switch role: finds or creates a user for that role and selects it
  const switchRoleQuick = (targetRole: UserRole) => {
    const users = storageService.getUsers();
    // find a user that has this role
    const matched = users.find((u) => u.roles.includes(targetRole));
    if (matched) {
      switchDemoUser(matched.id, targetRole);
    } else {
      // create or update current user to have this role
      if (currentUser) {
        const updated = {
          ...currentUser,
          currentRole: targetRole,
          roles: Array.from(new Set([...currentUser.roles, targetRole]))
        };
        storageService.saveUser(updated);
        setCurrentUser(updated);
        setCurrentRoleState(targetRole);
      }
    }
  };

  const login = (email: string, _password?: string) => {
    const user = storageService.getUserByEmail(email);
    if (!user) {
      return { success: false, message: 'Aucun compte trouvé avec cette adresse institutionnelle ou personnelle.' };
    }
    if (!user.isActive) {
      return { success: false, message: 'Votre compte a été temporairement désactivé par l\'administration.' };
    }
    if (!user.isEmailVerified) {
      return { success: false, message: 'Votre adresse e-mail n\'a pas encore été activée. Veuillez cliquer sur le lien d\'activation.' };
    }
    setCurrentUser(user);
    setCurrentRoleState(user.currentRole || user.roles[0]);
    localStorage.setItem('gcd_active_user_id', user.id);
    return { success: true, message: 'Connexion réussie.' };
  };

  const register = (userData: Partial<User>) => {
    if (!userData.email || !userData.firstName || !userData.lastName || !userData.cin) {
      return { success: false, message: 'Veuillez remplir tous les champs obligatoires du formulaire.' };
    }
    const existing = storageService.getUserByEmail(userData.email);
    if (existing) {
      return { success: false, message: 'Un compte avec cette adresse e-mail existe déjà sur la plateforme GCD.' };
    }

    const newUser: User = {
      id: `usr-candidat-${Date.now()}`,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      cin: userData.cin.toUpperCase(),
      cne: userData.cne?.toUpperCase() || '',
      phone: userData.phone || '+212 6 00 00 00 00',
      establishmentId: userData.establishmentId || 'fsdm',
      roles: ['candidat'],
      currentRole: 'candidat',
      isActive: true,
      isEmailVerified: true, // auto-verified for smooth local demonstration
      createdAt: new Date().toISOString()
    };

    storageService.saveUser(newUser);
    storageService.logAction(
      { id: newUser.id, name: `${newUser.firstName} ${newUser.lastName}`, role: 'candidat' },
      'CREATION_COMPTE',
      'utilisateur',
      newUser.id,
      `Création du compte candidat pour ${newUser.firstName} ${newUser.lastName} (${newUser.cin})`
    );

    setCurrentUser(newUser);
    setCurrentRoleState('candidat');
    localStorage.setItem('gcd_active_user_id', newUser.id);

    return {
      success: true,
      message: 'Compte créé avec succès ! Bienvenue sur la plateforme GCD USMBA.',
      user: newUser,
      activationToken: 'token-' + Math.random().toString(36).substring(2, 10)
    };
  };

  const logout = () => {
    // revert to guest or first candidate
    const candidates = storageService.getUsers().filter((u) => u.roles.includes('candidat'));
    const guest = candidates[0] || DEMO_USERS[0];
    setCurrentUser(guest);
    setCurrentRoleState('candidat');
    localStorage.setItem('gcd_active_user_id', guest.id);
  };

  const activateAccount = (email: string) => {
    const user = storageService.getUserByEmail(email);
    if (user) {
      user.isEmailVerified = true;
      storageService.saveUser(user);
      return true;
    }
    return false;
  };

  const requestPasswordReset = (email: string) => {
    const user = storageService.getUserByEmail(email);
    if (!user) {
      return { success: false, token: '', message: 'Adresse e-mail introuvable.' };
    }
    const token = 'reset-' + Math.random().toString(36).substring(2, 12);
    return {
      success: true,
      token,
      message: `Un lien de réinitialisation sécurisé a été généré pour ${email}.`
    };
  };

  const resetPassword = (_token: string, _newPass: string) => {
    return true;
  };

  const refreshUserData = () => {
    if (currentUser) {
      const refreshed = storageService.getUserById(currentUser.id);
      if (refreshed) setCurrentUser(refreshed);
    }
    refreshNotifications();
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole,
        setCurrentRole,
        switchDemoUser,
        switchRoleQuick,
        login,
        register,
        logout,
        activateAccount,
        requestPasswordReset,
        resetPassword,
        unreadNotificationsCount,
        refreshUserData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
