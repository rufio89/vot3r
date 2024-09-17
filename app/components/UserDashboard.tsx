import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Movie, MovieNight } from '../types/MovieTypes';
import { fetchUserMovies, fetchUserMovieNights, assignMovieToNight, removeMovieFromAllNights, deleteUserMovie, fetchMovieNightsForMovie } from '../firebase/firebaseService';
import AddMovie from './AddMovie';

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [movieNights, setMovieNights] = useState<MovieNight[]>([]);
  const [assignedNights, setAssignedNights] = useState<{ [movieId: string]: MovieNight[] }>({});

  useEffect(() => {
    if (!user) return;

    const unsubscribeMovies = fetchUserMovies(user.uid, (fetchedMovies: Movie[]) => {
      setMovies(fetchedMovies);
      fetchedMovies.forEach(movie => {
        fetchMovieNightsForMovie(movie.id).then(nights => {
          setAssignedNights(prev => ({ ...prev, [movie.id]: nights }));
        });
      });
    });
    const unsubscribeNights = fetchUserMovieNights(user.uid, setMovieNights);

    return () => {
      unsubscribeMovies();
      unsubscribeNights();
    };
  }, [user]);

  const assignToMovieNight = async (movieId: string, movieNightId: string) => {
    if (!user) return;

    try {
      await assignMovieToNight(movieId, movieNightId);

      // Update local state
      setMovies(movies.map(movie => 
        movie.id === movieId 
          ? { ...movie, assignedTo: { ...movie.assignedTo, [movieNightId]: movieNights.find(night => night.id === movieNightId)?.name || '' } }
          : movie
      ));

      //alert('Movie assigned successfully!');
    } catch (error) {
      console.error('Error assigning movie:', error);
      alert('Failed to assign movie. Please try again.');
    }
  };

  const removeFromMovieNight = async (movieId: string, movieNightId: string) => {
    if (!user) return;

    try {
      await removeMovieFromAllNights(movieId, movieNights);

      // Update local state
      setMovies(movies.map(movie => 
        movie.id === movieId 
          ? { ...movie, assignedTo: Object.fromEntries(Object.entries(movie.assignedTo).filter(([id]) => id !== movieNightId)) }
          : movie
      ));

      //alert('Movie removed successfully!');
    } catch (error) {
      console.error('Error removing movie:', error);
      alert('Failed to remove movie. Please try again.');
    }
  };

  const removeMovie = async (movieId: string) => {
    if (!user) return;

    try {
      await deleteUserMovie(movieId);

      // Update local state
      setMovies(movies.filter(movie => movie.id !== movieId));

      //alert('Movie removed successfully!');
    } catch (error) {
      console.error('Error removing movie:', error);
      alert('Failed to remove movie. Please try again.');
    }
  };

  const onMovieAdded = (newMovie: Movie) => {
    setMovies(prevMovies => {
      // Check if the movie already exists in the list
      const movieExists = prevMovies.some(movie => movie.id === newMovie.id);
      if (movieExists) {
        return prevMovies; // Don't add if it already exists
      }
      return [...prevMovies, { ...newMovie, assignedTo: {} }];
    });
  };

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-xl sm:text-2xl font-semibold text-primary-dark">Your Movie Dashboard</h2>
      <AddMovie onMovieAdded={onMovieAdded} />
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {movies.map((movie) => (
          <div key={movie.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-secondary-light flex flex-col">
            <img src={movie.poster} alt={movie.title} className="w-full h-48 object-cover" />
            <div className="p-3 sm:p-4 flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-foreground text-base sm:text-lg">{movie.title} ({movie.year})</h4>
                <button
                  onClick={() => removeMovie(movie.id)}
                  className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
                >
                  Delete
                </button>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-3">{movie.plot}</p>
              <div className="mt-2 flex-grow">
                <h5 className="text-xs sm:text-sm font-semibold text-foreground mb-2">Movie Nights:</h5>
                {assignedNights[movie.id]?.length > 0 ? (
                  <ul className="list-disc list-inside mb-2">
                    {assignedNights[movie.id].map((night) => (
                      <li key={night.id} className="flex justify-between items-center mb-1">
                        <span className="text-xs sm:text-sm text-gray-600 truncate mr-2">{night.name}</span>
                        <button
                          onClick={() => removeFromMovieNight(movie.id, night.id)}
                          className="px-1 sm:px-2 py-0.5 sm:py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs sm:text-sm text-gray-600 mb-2">Not assigned to any movie night</p>
                )}
              </div>
              <div className="mt-auto">
                <select 
                  onChange={(e) => assignToMovieNight(movie.id, e.target.value)}
                  className="w-full p-1 sm:p-2 text-xs sm:text-sm border border-secondary rounded text-foreground bg-white mt-2"
                >
                  <option value="">Assign to Movie Night</option>
                  {movieNights.map((night) => (
                    <option key={night.id} value={night.id}>{night.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserDashboard;
