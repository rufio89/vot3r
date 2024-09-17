import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Movie, MovieNight } from '../types/MovieTypes';
import MovieNightUsers from './MovieNightUsers';
import { Timestamp } from 'firebase/firestore';
import { fetchMovieNightDetails, fetchMoviesForMovieNight, voteForMovie, removeMovieFromNight } from '../firebase/firebaseService';

interface MovieListProps {
  movieNightId: string;
}

const MovieList: React.FC<MovieListProps> = ({ movieNightId }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [movieNight, setMovieNight] = useState<MovieNight | null>(null);
  const { user } = useAuth();
  const [isVotingClosed, setIsVotingClosed] = useState(false);

  useEffect(() => {
    const fetchMoviesAndVotes = async () => {
      try {
        const fetchedMovieNight = await fetchMovieNightDetails(movieNightId);
        if (fetchedMovieNight) {
          setMovieNight(fetchedMovieNight);
          const moviesList = await fetchMoviesForMovieNight(fetchedMovieNight.assignedMovies);
          setMovies(moviesList);

          if (fetchedMovieNight.dateTime) {
            const votingClosingDate = fetchedMovieNight.dateTime instanceof Timestamp ? 
              fetchedMovieNight.dateTime.toDate() : new Date(fetchedMovieNight.dateTime);
            votingClosingDate.setHours(votingClosingDate.getHours() - 1);
            setIsVotingClosed(new Date() > votingClosingDate);
          }
        } else {
          console.error('Movie night not found');
        }
      } catch (error) {
        console.error('Error fetching movies and votes:', error);
      }
    };

    fetchMoviesAndVotes();
  }, [movieNightId]);

  const handleVote = async (movieId: string) => {
    if (!user || !movieNight || isVotingClosed) {
      alert('You cannot vote at this time');
      return;
    }

    try {
      await voteForMovie(movieNightId, user.uid, movieId);

      // Update local state
      setMovieNight(prevState => {
        if (!prevState) return null;
        const newVotes = { ...prevState.votes };
        if (newVotes[user.uid] === movieId) {
          delete newVotes[user.uid];
        } else {
          newVotes[user.uid] = movieId;
        }
        return { ...prevState, votes: newVotes };
      });

    } catch (error) {
      console.error('Error voting for movie:', error);
      alert('Failed to vote. Please try again.');
    }
  };

  const handleRemoveMovie = async (movieId: string) => {
    if (!user || !movieNight) return;

    try {
      await removeMovieFromNight(movieNightId, movieId);
      setMovies(movies.filter(movie => movie.id !== movieId));
    } catch (error) {
      console.error('Error removing movie:', error);
      alert('Failed to remove movie. Please try again.');
    }
  };

  const getVoteCount = (movieId: string) => {
    if (!movieNight) return 0;
    return Object.values(movieNight.votes).filter(id => id === movieId).length;
  };

  const hasUserVoted = (movieId: string) => {
    return movieNight?.votes[user?.uid || ''] === movieId;
  };

  return (
    <div className="space-y-4">
      <MovieNightUsers userIds={movieNight?.members || []} />
      <h3 className="text-lg sm:text-xl font-semibold text-primary-dark mb-4">Movies for this Night</h3>
      {isVotingClosed && (
        <p className="text-red-500 mb-4">Voting is closed for this movie night.</p>
      )}
      {movies.length === 0 ? (
        <p>No movies have been assigned to this movie night yet.</p>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {movies.map((movie) => (
            <div key={movie.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-secondary-light flex flex-col">
              <img src={movie.poster} alt={movie.title} className="w-full h-48 object-cover" />
              <div className="p-3 sm:p-4 flex flex-col flex-grow">
                <h4 className="font-semibold text-base sm:text-lg mb-2">{movie.title} ({movie.year})</h4>
                <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-3">{movie.plot}</p>
                <a 
                  href={`https://www.imdb.com/title/${movie.imdbID}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700 text-xs sm:text-sm mb-2 block"
                >
                  View on IMDb
                </a>
                <div className="mt-auto">
                  <div className="flex flex-wrap justify-between items-center mt-2">
                    <span className="text-xs sm:text-sm font-semibold mb-2 sm:mb-0">Votes: {getVoteCount(movie.id)}</span>
                    <div className="flex space-x-2 w-full sm:w-auto">
                      <button
                        onClick={() => handleVote(movie.id)}
                        className={`flex-1 sm:flex-none px-2 sm:px-3 py-1 text-xs sm:text-sm rounded transition duration-300 ${
                          hasUserVoted(movie.id)
                            ? 'bg-secondary text-white' 
                            : 'bg-primary hover:bg-primary-dark text-white'
                        }`}
                        disabled={!user || isVotingClosed}
                      >
                        {hasUserVoted(movie.id) ? 'Unvote' : 'Vote'}
                      </button>
                      {movie.userId === user?.uid && (
                        <button
                          onClick={() => handleRemoveMovie(movie.id)}
                          className="flex-1 sm:flex-none px-2 sm:px-3 py-1 text-xs sm:text-sm rounded bg-red-500 hover:bg-red-600 text-white transition duration-300"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MovieList;
