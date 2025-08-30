import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthResponse, LoginRequest, RegisterRequest } from '@/types/api';
import { apiClient } from '@/utils/apiClient';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, name?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token in localStorage
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('user_data');
    
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await apiClient.login({ email, password });
      
      // Store token and user data
      localStorage.setItem('auth_token', response.access_token);
      localStorage.setItem('user_data', JSON.stringify(response.user));
      
      setToken(response.access_token);
      setUser(response.user);
      
      return { error: null };
    } catch (error: any) {
      return { error: { message: error.message || 'Erro ao fazer login' } };
    }
  };

  const signUp = async (email: string, password: string, name?: string) => {
    try {
      const response = await apiClient.register({ email, password, name });
      
      // Store token and user data
      localStorage.setItem('auth_token', response.access_token);
      localStorage.setItem('user_data', JSON.stringify(response.user));
      
      setToken(response.access_token);
      setUser(response.user);
      
      return { error: null };
    } catch (error: any) {
      return { error: { message: error.message || 'Erro ao criar conta' } };
    }
  };

  const signOut = async () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};