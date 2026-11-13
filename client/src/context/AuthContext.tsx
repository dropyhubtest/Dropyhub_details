import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';

interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem('dropyhub_token');
    if (token) {
      api
        .getMe()
        .then((data) => {
          if (data.user) {
            setUser({
              id: data.user.id,
              email: data.user.email,
              fullName: data.user.full_name || 'Administrator',
              role: data.user.role,
            });
          }
        })
        .catch(() => {
          localStorage.removeItem('dropyhub_token');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string) => {
    const data = await api.login(email, pass);
    localStorage.setItem('dropyhub_token', data.token);
    setUser(data.user);
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
