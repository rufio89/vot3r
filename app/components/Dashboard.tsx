import { signOut } from 'firebase/auth';
import { auth } from '../firebase/clientApp';
import { useMovieNight } from '../context/MovieNightContext';
import MovieNightList from './MovieNightList';
import MovieNightDetails from './MovieNightDetails';

export default function Dashboard() {
  const { selectedMovieNight } = useMovieNight();

  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary-dark">Movie Night Dashboard</h1>
      </header>
      
      <main>
        {selectedMovieNight ? <MovieNightDetails /> : <MovieNightList />}
      </main>
    </div>
  );
}
