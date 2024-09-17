"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getMovieNights, createMovieNight } from '../firebase/firebaseUtils';
import { MovieNight } from '../types/MovieTypes';
import { Timestamp } from 'firebase/firestore';

interface MovieNightContextType {
  userMovieNights: MovieNight[];
  selectedMovieNight: string | null;
  setSelectedMovieNight: (id: string | null) => void;
  handleCreateMovieNight: (newMovieNightName: string) => void;
  movieNight: MovieNight | null;
}

const MovieNightContext = createContext<MovieNightContextType | undefined>(undefined);

export const MovieNightProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userMovieNights, setUserMovieNights] = useState<MovieNight[]>([]);
  const [selectedMovieNight, setSelectedMovieNight] = useState<string | null>(null);
  const [movieNight, setMovieNight] = useState<MovieNight | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserMovieNights = async () => {
      if (user) {
        const nights = await getMovieNights(user.uid);
        setUserMovieNights(nights);
      }
    };

    fetchUserMovieNights();
  }, [user]);

  const handleCreateMovieNight = async (newMovieNightName: string) => {
    if (!user) return;
    const newMovieNight = {
      name: newMovieNightName,
      votes: {},
      assignedMovies: [],
      members: [user.uid],
      dateTime: Timestamp.now()
    };
    const newMovieNightId = await createMovieNight(newMovieNight);
    setUserMovieNights([...userMovieNights, { id: newMovieNightId, ...newMovieNight }]);
  };

  return (
    <MovieNightContext.Provider value={{ userMovieNights, selectedMovieNight, setSelectedMovieNight, handleCreateMovieNight, movieNight }}>
      {children}
    </MovieNightContext.Provider>
  );
};

export const useMovieNight = () => {
  const context = useContext(MovieNightContext);
  if (!context) {
    throw new Error('useMovieNight must be used within a MovieNightProvider');
  }
  return context;
};
