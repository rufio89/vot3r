'use client';


import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase/clientApp';
import { User } from 'firebase/auth';

const AuthContext = createContext<{ user: User | null; logout: () => Promise<void> }>({
  user: null,
  logout: async () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      console.log('Auth state changed:', user);
    });
    return unsubscribe;
  }, []);

  const logout = async () => {
    try {
      await auth.signOut();
      console.log('Signed out successfully');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = { user, logout };
  console.log('AuthContext value:', value);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
