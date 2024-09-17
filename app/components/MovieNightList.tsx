import { useMovieNight } from '../context/MovieNightContext';
import CreateMovieNight from './CreateMovieNight';
import JoinMovieNight from './JoinMovieNight';
import InviteUser from './InviteUser';
import Link from 'next/link';
import { formatDateTime } from '../utils/dateUtils';

export default function MovieNightList() {
  const { userMovieNights, setSelectedMovieNight, handleCreateMovieNight } = useMovieNight();

  return (
    <div className="space-y-6">
      <section className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-primary-dark mb-4">Your Movie Nights</h2>
        {userMovieNights.length > 0 ? (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {userMovieNights.map((night) => (
              <div key={night.id} className="bg-white rounded-lg shadow-md border border-secondary p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-primary-dark">{night.name}</h3>
                  <span className="text-sm text-secondary-dark">{formatDateTime(night.dateTime)}</span>
                </div>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedMovieNight(night.id)}
                    className="w-full px-3 py-2 bg-primary hover:bg-primary-dark text-white rounded transition duration-300"
                  >
                    View Movies
                  </button>
                  <Link href={`/movie-night/${night.id}/edit`} className="block">
                    <button className="w-full px-3 py-2 bg-secondary hover:bg-secondary-dark text-white rounded transition duration-300">
                      Edit Movie Night
                    </button>
                  </Link>
                  <InviteUser movieNightId={night.id} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">You haven't created or joined any movie nights yet.</p>
        )}
      </section>
      
      <section className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-primary-dark mb-4">Create or Join a Movie Night</h2>
        <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
          <CreateMovieNight onCreateMovieNight={handleCreateMovieNight} />
          <JoinMovieNight />
        </div>
      </section>
    </div>
  );
}
