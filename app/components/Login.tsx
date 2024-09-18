"use client";

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/clientApp';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/'); // Redirect to the main dashboard
    } catch (error) {
      setError('Failed to log in');
      console.error('Error logging in:', error);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full p-2 border rounded text-black"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full p-2 border rounded text-black"
        required
      />
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
        Login
      </button>
    </form>
  );
};

export default Login;
