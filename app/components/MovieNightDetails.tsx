import { useMovieNight } from '../context/MovieNightContext';
import MovieList from './MovieList';
import Link from 'next/link';
import { formatDateTime } from '../utils/dateUtils';
import Countdown from './Countdown';

export default function MovieNightDetails() {
  const { selectedMovieNight, setSelectedMovieNight, userMovieNights } = useMovieNight();

  const currentNight = userMovieNights.find(night => night.id === selectedMovieNight);

  if (!currentNight) return null;

  return (
    <div className="bg-white rounded-lg shadow-md border border-secondary-light p-4 sm:p-6 mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h2 className="text-lg sm:text-xl font-semibold text-primary-dark mb-2 sm:mb-0">
          {currentNight.name} - {formatDateTime(currentNight.dateTime)}
        </h2>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
          <Link href={`/movie-night/${selectedMovieNight}/edit`} className="w-full sm:w-auto">
            <button className="w-full sm:w-auto px-3 py-1 bg-secondary hover:bg-secondary-dark text-white rounded transition duration-300">
              Edit Movie Night
            </button>
          </Link>
          <button
            onClick={() => setSelectedMovieNight(null)}
            className="w-full sm:w-auto px-3 py-1 bg-secondary hover:bg-secondary-dark text-foreground rounded transition duration-300"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
      {currentNight.dateTime && (
        <div className="text-2xl sm:text-3xl font-bold text-primary-dark my-4">
          <Countdown targetDate={currentNight.dateTime.toDate()} />
        </div>
      )}
      <MovieList movieNightId={selectedMovieNight ?? ''} />
    </div>
  );
}
