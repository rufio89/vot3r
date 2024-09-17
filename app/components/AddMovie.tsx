import React, { useState, useEffect } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase/clientApp';
import { useAuth } from '../context/AuthContext';
import { Movie, MovieSearchResult } from "../types/MovieTypes";

interface AddMovieProps {
  onMovieAdded: (newMovie: Movie) => void;
}

const AddMovie: React.FC<AddMovieProps> = ({ onMovieAdded }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<MovieSearchResult[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
    }
  }, [searchTerm]);

  const searchMovies = async () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

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

  const handleAddMovie = async (movie: MovieSearchResult) => {
    if (!user) {
      alert('You must be logged in to add a movie');
      return;
    }
    try {
      // Fetch additional details including plot
      const apiKey = process.env.NEXT_PUBLIC_OMDB_API_KEY;
      const response = await fetch(`http://www.omdbapi.com/?i=${movie.imdbID}&apikey=${apiKey}`);
      const fullMovieData = await response.json();

      const newMovieRef = await addDoc(collection(db, 'userMovies'), {
        userId: user.uid,
        title: fullMovieData.Title,
        year: fullMovieData.Year,
        poster: fullMovieData.Poster,
        imdbID: fullMovieData.imdbID,
        plot: fullMovieData.Plot,
        addedAt: new Date(),
      });

      const newMovie: Movie = { 
        userId: user.uid,
        id: newMovieRef.id,
        title: fullMovieData.Title,
        year: fullMovieData.Year,
        poster: fullMovieData.Poster,
        imdbID: fullMovieData.imdbID,
        plot: fullMovieData.Plot,
        addedAt: new Date(),
        assignedTo: {},
      };

      onMovieAdded(newMovie);
      
      // Clear search results and search term after adding the movie
      setSearchResults([]);
      setSearchTerm('');
    } catch (error) {
      console.error('Error adding movie:', error);
      alert('Failed to add the movie. Please try again.');
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search for a movie"
          className="flex-grow px-4 py-2 border border-secondary rounded-l text-foreground bg-white"
        />
        <button 
          onClick={searchMovies}
          className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-r transition duration-300"
        >
          Search
        </button>
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="px-4 py-2 bg-secondary hover:bg-secondary-dark text-white rounded transition duration-300"
          >
            Clear
          </button>
        )}
      </div>
      
      {searchResults.length > 0 && (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {searchResults.map((movie) => (
            <div key={movie.imdbID} className="bg-white rounded-lg shadow-md overflow-hidden border border-secondary-light">
              <img src={movie.Poster} alt={movie.Title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{movie.Title} ({movie.Year})</h3>
                <button
                  onClick={() => handleAddMovie(movie)}
                  className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded transition duration-300"
                >
                  Add to My List
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddMovie;
