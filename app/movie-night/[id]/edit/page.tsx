'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase/clientApp';
import { MovieNight } from '../../../types/MovieTypes';
import { useAuth } from '../../../context/AuthContext';

export default function EditMovieNightPage({ params }: { params: { id: string } }) {
  const [movieNight, setMovieNight] = useState<MovieNight | null>(null);
  const [name, setName] = useState('');
  const [dateTime, setDateTime] = useState('');
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const fetchMovieNight = async () => {
      const docRef = doc(db, 'movieNights', params.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as MovieNight;
        setMovieNight(data);
        setName(data.name);
        setDateTime(data.dateTime ? data.dateTime.toDate().toISOString().slice(0, 16) : '');
      } else {
        console.log('No such document!');
        router.push('/');
      }
    };

    fetchMovieNight();
  }, [params.id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('You must be logged in to edit a movie night');
      return;
    }
    try {
      const movieNightRef = doc(db, 'movieNights', params.id);
      await updateDoc(movieNightRef, {
        name: name.trim(),
        dateTime: dateTime ? new Date(dateTime) : null
      });
      router.push('/my-movies');
    } catch (error) {
      console.error('Error updating movie night:', error);
      alert('Failed to update movie night. Please try again.');
    }
  };

  if (!movieNight) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Movie Night</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-2">Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-secondary rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="dateTime" className="block mb-2">Date and Time</label>
          <input
            id="dateTime"
            type="datetime-local"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            className="w-full p-2 border border-secondary rounded"
          />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Members</h2>
          <ul className="list-disc list-inside">
            {movieNight.members.map((memberId, index) => (
              <li key={index}>{memberId}</li> // You might want to fetch user details to show names instead of IDs
            ))}
          </ul>
        </div>
        <button 
          type="submit"
          className="w-full p-2 bg-primary hover:bg-primary-dark text-white rounded transition duration-300"
        >
          Update Movie Night
        </button>
      </form>
    </div>
  );
}
