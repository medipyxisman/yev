import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useRouter } from 'expo-router';
import API from '../httpService/apis';
import HttpClient from '../httpService/httpClient';
import { storage } from '../utils/storage';
import type { LoginRequest, RegisterRequest, AuthResponse } from '../constants';

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthResponse['user'] | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthResponse['user'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state from storage
  useEffect(() => {
    const initAuth = async () => {
      try {
        const [token, storedUser] = await Promise.all([
          storage.getAuthToken(),
          storage.getUser<AuthResponse['user']>()
        ]);

        if (token && storedUser) {
          HttpClient.shared().setToken(token);
          setUser(storedUser);
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await API.login({ email, password });
      
      if (response.data) {
        const { token, user } = response.data;
        
        // Update client state
        HttpClient.shared().setToken(token);
        setUser(user);

        // Persist auth state
        await Promise.all([
          storage.setAuthToken(token),
          storage.setUser(user)
        ]);

        router.replace('/(tabs)');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [router]);

  const register = useCallback(async (data: RegisterRequest) => {
    try {
      setLoading(true);
      setError(null);

      const response = await API.register(data);
      
      if (response.data) {
        const { token, user } = response.data;
        
        // Update client state
        HttpClient.shared().setToken(token);
        setUser(user);

        // Persist auth state
        await Promise.all([
          storage.setAuthToken(token),
          storage.setUser(user)
        ]);

        router.replace('/(tabs)');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [router]);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      
      // Clear client state
      HttpClient.shared().setToken('');
      setUser(null);

      // Clear persisted state
      await storage.clearAll();

      router.replace('/login');
    } catch (err) {
      console.error('Error during logout:', err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  return (
    <AuthContext.Provider 
      value={{
        isAuthenticated: !!user,
        user,
        loading,
        error,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}