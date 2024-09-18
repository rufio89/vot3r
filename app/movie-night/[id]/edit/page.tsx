'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase/clientApp';
import { MovieNight } from '../../../types/MovieTypes';
import EditMovieNight from '../../../components/EditMovieNight';

export default function EditMovieNightPage({ params }: { params: { id: string } }) {
  const [movieNight, setMovieNight] = useState<MovieNight | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchMovieNight = async () => {
      const docRef = doc(db, 'movieNights', params.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        // Potential issue: Ensure dateTime is properly converted to Timestamp
        const movieNightData: MovieNight = {
          id: docSnap.id,
          name: data.name,
          dateTime: data.dateTime,
          votes: data.votes || [],
          assignedMovies: data.assignedMovies || [],
          members: data.members || [],
          ...data // Include any other fields from data
        };
        setMovieNight(movieNightData);
      } else {
        console.log('No such document!');
        router.push('/');
      }
    };

    fetchMovieNight();
  }, [params.id, router]);

  if (!movieNight) return <div>Loading...</div>;

  return (
    <div>
      <h1>Edit Movie Night</h1>
      <EditMovieNight 
        movieNight={movieNight} 
        onUpdate={(updatedMovieNight) => {
          setMovieNight(updatedMovieNight);
          router.push('/');
        }} 
      />
    </div>
  );
}
