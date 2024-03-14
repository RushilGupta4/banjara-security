// AuthContext.tsx
'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '@/firebase/config';

type AuthContextType = {
  error: string;
  login: (username: string, password: string) => void;
  logout: () => void;
  loggedIn: boolean;
  loading: boolean;
};

type AuthProviderProps = {
  children: ReactNode;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }: { children: any }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const login = (email: string, password: string) => {
    setLoading(true);

    signInWithEmailAndPassword(auth, email, password)
      .then((result) => {
        if (result) {
          setLoggedIn(true);
        } else {
          setError('Incorrect Credentials');
          setTimeout(() => {
            setError('');
          }, 2000);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setError('Incorrect Credentials');
        setTimeout(() => {
          setError('');
        }, 2000);
        setLoading(false);
      });
  };

  const logout = () => {
    signOut(auth);
    setLoggedIn(false);
  };

  return <AuthContext.Provider value={{ error, login, logout, loggedIn: true || loggedIn, loading }}>{children}</AuthContext.Provider>;
};
