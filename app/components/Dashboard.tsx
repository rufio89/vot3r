import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/clientApp';
import { useMovieNight } from '../context/MovieNightContext';
import MovieNightList from './MovieNightList';
import MovieNightDetails from './MovieNightDetails';

export default function Dashboard() {
  const router = useRouter();
  const { selectedMovieNight } = useMovieNight();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

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
