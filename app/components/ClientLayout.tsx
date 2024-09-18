"use client";

import React from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';

const ClientLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen">
      {user && <Sidebar className="hidden md:block w-64 flex-shrink-0 fixed h-full" />}
      <div className={`flex-grow flex flex-col ${user ? 'md:ml-64' : ''}`}>
        <main className="flex-grow p-4 md:p-8">
          {children}
        </main>
        {user && <BottomNav className="md:hidden" />}
      </div>
    </div>
  );
};

export default ClientLayout;
