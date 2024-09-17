'use client';

import { useAuth } from './context/AuthContext';
import AuthForm from './components/AuthForm';
import Dashboard from './components/Dashboard';
import { MovieNightProvider } from './context/MovieNightContext';

function HomeContent() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      {!user ? <AuthForm /> : <Dashboard />}
    </div>
  );
}

export default function Home() {
  return (
    <MovieNightProvider>
      <HomeContent />
    </MovieNightProvider>
  );
}
