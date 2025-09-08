import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { api } from './api';

export type PublicUser = {
  id: string;
  email: string;
  name?: string;
  role: 'USER' | 'ADMIN';
};

type AuthContextValue = {
  user: PublicUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    try {
      const me = await api<PublicUser | null>('/auth/me');
      setUser(me);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email: string, password: string) => {
    const me = await api<PublicUser>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setUser(me);
  };

  const register = async (email: string, password: string, name?: string) => {
    const me = await api<PublicUser>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
    setUser(me);
  };

  const logout = async () => {
    await api('/auth/logout', { method: 'POST' });
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, loading, login, register, logout, refresh }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function Protected({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ padding: 24 }}>Loading…</div>;
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}
