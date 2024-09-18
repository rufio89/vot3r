"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { getUserProfile, updateUserProfile } from '../firebase/firebaseUtils';

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [handle, setHandle] = useState('@');
  const [emoji, setEmoji] = useState('👤');

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else {
      const fetchUserProfile = async () => {
        const userProfile = await getUserProfile(user.uid);
        if (userProfile) {
          setHandle(userProfile.handle || '@');
          setEmoji(userProfile.emoji || '👤');
        } else {
          await updateUserProfile(user.uid, {
            handle: '@',
            emoji: '👤'
          });
        }
      };
      fetchUserProfile();
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      await updateUserProfile(user.uid, { handle, emoji });
      alert('Profile updated successfully!');
    }
  };

  const handleLogout = async () => {
    if (logout) {
      try {
        await logout();
        router.push('/login');
      } catch (error) {
        console.error('Logout failed:', error);
      }
    }
  };

  if (!user) {
    return null; // or a loading spinner
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-semibold mb-4 text-foreground">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="handle" className="block mb-1 text-gray-700 font-medium">Handle</label>
          <input
            type="text"
            id="handle"
            value={handle}
            onChange={(e) => setHandle(e.target.value.startsWith('@') ? e.target.value : `@${e.target.value}`)}
            className="w-full p-2 border border-secondary rounded text-foreground bg-white"
          />
        </div>
        <div>
          <label htmlFor="emoji" className="block mb-1 text-gray-700 font-medium">Emoji</label>
          <input
            type="text"
            id="emoji"
            value={emoji}
            onChange={(e) => setEmoji(e.target.value)}
            className="w-full p-2 border border-secondary rounded text-foreground bg-white"
            maxLength={2}
          />
        </div>
        <button type="submit" className="w-full p-2 bg-primary text-white rounded hover:bg-primary-dark transition duration-300">
          Update Profile
        </button>
        <button onClick={handleLogout} className="w-full mt-4 p-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300">
          Logout
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
