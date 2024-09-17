import React, { useState } from 'react';
import { doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase/clientApp';
import { MovieNight } from '../types/MovieTypes';

interface EditMovieNightProps {
  movieNight: MovieNight;
  onUpdate: (updatedMovieNight: MovieNight) => void;
}

const EditMovieNight: React.FC<EditMovieNightProps> = ({ movieNight, onUpdate }) => {
  const [name, setName] = useState(movieNight.name);
  const [dateTime, setDateTime] = useState(movieNight.dateTime ? movieNight.dateTime.toDate().toISOString().slice(0, 16) : '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const movieNightRef = doc(db, 'movieNights', movieNight.id);
      const updatedMovieNight: MovieNight = {
        ...movieNight,
        name,
        dateTime: dateTime ? Timestamp.fromDate(new Date(dateTime)) : null
      };
      await updateDoc(movieNightRef, {
        name,
        dateTime: updatedMovieNight.dateTime
      });
      onUpdate(updatedMovieNight);
    } catch (error) {
      console.error('Error updating movie night:', error);
      alert('Failed to update movie night. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Movie Night Name"
        className="w-full p-2 border border-secondary rounded text-foreground bg-white"
        required
      />
      <input
        type="datetime-local"
        value={dateTime}
        onChange={(e) => setDateTime(e.target.value)}
        className="w-full p-2 border border-secondary rounded text-foreground bg-white"
      />
      <button 
        type="submit"
        className="w-full p-2 bg-primary hover:bg-primary-dark text-white rounded transition duration-300"
      >
        Update Movie Night
      </button>
    </form>
  );
};

export default EditMovieNight;
