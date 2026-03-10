'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string, requiredRole?: 'admin' | 'user') => Promise<boolean>;
  register: (name: string, email: string, password: string, role: 'admin' | 'user') => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  hasAdminUser: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar sessão do localStorage ao montar
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  // Persistir sessão no localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (email: string, password: string, requiredRole?: 'admin' | 'user'): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, requiredRole }),
      });

      if (!res.ok) return false;

      const { user: loggedUser } = await res.json();
      setUser(loggedUser);
      return true;
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string, role: 'admin' | 'user'): Promise<boolean> => {
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });

      if (!res.ok) return false;

      const newUser = await res.json();
      setUser(newUser);
      return true;
    } catch (error) {
      console.error('Erro no registro:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
  };

  const hasAdminUser = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/has-admin');
      if (!res.ok) return false;
      const { hasAdmin } = await res.json();
      return hasAdmin;
    } catch {
      return false;
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading, hasAdminUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
