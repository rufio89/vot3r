import React, { useState } from 'react';
import { addDoc, collection, updateDoc, doc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase/clientApp';
import { useAuth } from '../context/AuthContext';
import { MovieSearchResult } from '../types/MovieTypes';

interface AddMovieToNightProps {
  movieNightId: string;
}


interface MovieDetails extends MovieSearchResult {
  Plot: string;
  imdbRating: string;
}

const AddMovieToNight: React.FC<AddMovieToNightProps> = ({ movieNightId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<MovieSearchResult[]>([]);
  const { user } = useAuth();

  const searchMovies = async () => {
    if (!searchTerm.trim()) return;

    const apiKey = process.env.NEXT_PUBLIC_OMDB_API_KEY;
    const response = await fetch(`http://www.omdbapi.com/?s=${encodeURIComponent(searchTerm)}&type=movie&apikey=${apiKey}`);
    const data = await response.json();

    if (data.Response === 'True') {
      setSearchResults(data.Search);
    } else {
      setSearchResults([]);
      alert('No movies found');
    }
  };

  const fetchMovieDetails = async (imdbID: string): Promise<MovieDetails> => {
    const apiKey = process.env.NEXT_PUBLIC_OMDB_API_KEY;
    const response = await fetch(`http://www.omdbapi.com/?i=${imdbID}&plot=short&apikey=${apiKey}`);
    const data = await response.json();
    return data;
  };

  const handleAddMovie = async (movie: MovieSearchResult) => {
    if (!user) {
      alert('You must be logged in to add a movie');
      return;
    }
    try {
      const movieDetails = await fetchMovieDetails(movie.imdbID);
      const movieRef = await addDoc(collection(db, 'movies'), {
        title: movieDetails.Title,
        year: movieDetails.Year,
        poster: movieDetails.Poster,
        imdbID: movieDetails.imdbID,
        plot: movieDetails.Plot,
        imdbRating: movieDetails.imdbRating,
        imdbLink: `https://www.imdb.com/title/${movieDetails.imdbID}/`,
        votes: 0,
        createdBy: user.uid,
        createdAt: new Date(),
      });

      const movieNightRef = doc(db, 'movieNights', movieNightId);
      await updateDoc(movieNightRef, {
        movies: arrayUnion(movieRef.id)
      });

      //alert(`${movieDetails.Title} has been added to the movie night!`);
      setSearchResults(searchResults.filter(m => m.imdbID !== movie.imdbID));
    } catch (error) {
      console.error('Error adding movie:', error);
      //alert('Failed to add the movie. Please try again.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for a movie"
          className="flex-grow px-4 py-2 border border-secondary rounded-l text-foreground bg-white"
        />
        <button 
          type="button"
          onClick={searchMovies}
          className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-r transition duration-300"
        >
          Search
        </button>
      </div>
      
      {searchResults.length > 0 && (
        <div className="max-h-60 overflow-y-auto border border-secondary rounded p-2">
          {searchResults.map((movie) => (
            <div 
              key={movie.imdbID} 
              className="flex items-center justify-between space-x-2 p-2 hover:bg-secondary-light"
            >
              <div className="flex items-center space-x-2">
                <img src={movie.Poster} alt={movie.Title} className="w-12 h-auto" />
                <div className="text-foreground">
                  <h3 className="font-bold">{movie.Title}</h3>
                  <p>{movie.Year}</p>
                </div>
              </div>
              <button
                onClick={() => handleAddMovie(movie)}
                className="px-3 py-1 bg-primary hover:bg-primary-dark text-white rounded transition duration-300"
              >
                Add
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddMovieToNight;
