import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase/clientApp';
import { doc, setDoc } from 'firebase/firestore';

const AuthForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [handle, setHandle] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isSignUp) {
      if (password !== confirmPassword) {
        setError("Passwords don't match");
        return;
      }
      if (!handle.startsWith('@')) {
        setError("Handle must start with '@'");
        return;
      }
    }

    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          email: userCredential.user.email,
          handle: handle,
          profileIcon: ''
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      setError(isSignUp ? 'Failed to create an account' : 'Failed to log in');
      console.error('Error:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-2 border border-secondary rounded text-foreground bg-white"
          required
        />
        {isSignUp && (
          <input
            type="text"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            placeholder="@username"
            className="w-full p-2 border border-secondary rounded text-foreground bg-white"
            required
          />
        )}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-2 border border-secondary rounded text-foreground bg-white"
          required
        />
        {isSignUp && (
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            className="w-full p-2 border border-secondary rounded text-foreground bg-white"
            required
          />
        )}
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="w-full p-2 bg-primary hover:bg-primary-dark text-white rounded transition duration-300">
          {isSignUp ? 'Sign Up' : 'Login'}
        </button>
      </form>
      <p className="mt-4 text-center text-foreground">
        {isSignUp ? 'Already have an account?' : "Don't have an account?"}
        <button
          onClick={() => {
            setIsSignUp(!isSignUp);
            setError('');
            setPassword('');
            setConfirmPassword('');
            setHandle('');
          }}
          className="ml-2 text-primary-dark hover:underline"
        >
          {isSignUp ? 'Login' : 'Sign Up'}
        </button>
      </p>
    </div>
  );
};

export default AuthForm;
