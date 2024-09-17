import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase/clientApp';
import { useAuth } from '../context/AuthContext';

interface CreateMovieNightProps {
  onCreateMovieNight: (id: string, name: string, date: Date) => void;
}

const CreateMovieNight: React.FC<CreateMovieNightProps> = ({ onCreateMovieNight }) => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const { user } = useAuth();

  const handleCreateMovieNight = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('You must be logged in to create a movie night');
      return;
    }
    try {
      const movieNightDate = new Date(date);
      const docRef = await addDoc(collection(db, 'movieNights'), {
        name: name.trim(),
        createdBy: user.uid,
        createdAt: new Date(),
        members: [user.uid],
        movies: [],
        date: movieNightDate
      });
      setName('');
      setDate('');
      onCreateMovieNight(docRef.id, name.trim(), movieNightDate);
    } catch (error) {
      console.error('Error creating movie night:', error);
      alert('Failed to create movie night. Please try again.');
    }
  };

  return (
    <form onSubmit={handleCreateMovieNight} className="space-y-4">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter movie night name"
        className="w-full p-2 border border-secondary rounded text-foreground bg-white"
        required
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full p-2 border border-secondary rounded text-foreground bg-white"
        required
      />
      <button 
        type="submit"
        className="w-full p-2 bg-primary hover:bg-primary-dark text-white rounded transition duration-300"
      >
        Create Movie Night
      </button>
    </form>
  );
};

export default CreateMovieNight;
