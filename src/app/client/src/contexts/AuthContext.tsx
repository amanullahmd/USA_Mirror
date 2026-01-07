import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authAPI } from '../services/api';
import { User, AdminUser } from '../types';

interface AuthContextType {
  user: User | AdminUser | null;
  authenticated: boolean;
  loading: boolean;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | AdminUser | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const refreshSession = async () => {
    try {
      // Try user session first
      const userSession = await authAPI.session();
      if (userSession.authenticated) {
        setAuthenticated(true);
        setUser(userSession.user);
        return;
      }
      
      // Try admin session
      const adminSession = await authAPI.adminSession();
      if (adminSession.authenticated) {
        setAuthenticated(true);
        setUser(adminSession.user);
        return;
      }
      
      setAuthenticated(false);
      setUser(null);
    } catch (err) {
      console.error('Failed to refresh session:', err);
      setAuthenticated(false);
      setUser(null);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      setAuthenticated(false);
      setUser(null);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true);
        await refreshSession();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, authenticated, loading, logout, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
