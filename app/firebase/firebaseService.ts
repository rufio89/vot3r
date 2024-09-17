import { collection, query, where, getDocs, doc, getDoc, updateDoc, deleteDoc, arrayUnion, arrayRemove, onSnapshot, runTransaction } from 'firebase/firestore';
import { db } from './clientApp';
import { Movie, MovieNight } from '../types/MovieTypes';
import { User } from '../types/UserTypes';

// Movie Night related functions
export const fetchMovieNightDetails = async (movieNightId: string): Promise<MovieNight | null> => {
  const movieNightRef = doc(db, 'movieNights', movieNightId);
  const movieNightSnap = await getDoc(movieNightRef);

  if (movieNightSnap.exists()) {
    const movieNightData = movieNightSnap.data() as MovieNight;
    return {
      id: movieNightId,
      name: movieNightData.name,
      votes: movieNightData.votes || {},
      assignedMovies: movieNightData.assignedMovies || [],
      members: movieNightData.members || [],
      dateTime: movieNightData.dateTime || null
    };
  }
  return null;
};

export const fetchMoviesForMovieNight = async (assignedMovies: string[]): Promise<Movie[]> => {
  const moviesQuery = query(collection(db, 'userMovies'), where('__name__', 'in', assignedMovies));
  const moviesSnapshot = await getDocs(moviesQuery);
  return moviesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Movie));
};

export const voteForMovie = async (movieNightId: string, userId: string, movieId: string): Promise<void> => {
  await runTransaction(db, async (transaction) => {
    const movieNightRef = doc(db, 'movieNights', movieNightId);
    const movieNightDoc = await transaction.get(movieNightRef);

    if (!movieNightDoc.exists()) {
      throw "Movie night does not exist!";
    }

    const movieNightData = movieNightDoc.data() as MovieNight;
    const votes = movieNightData.votes || {};

    if (votes[userId] === movieId) {
      delete votes[userId];
    } else {
      votes[userId] = movieId;
    }

    transaction.update(movieNightRef, { votes });
  });
};

export const removeMovieFromNight = async (movieNightId: string, movieId: string): Promise<void> => {
  const movieNightRef = doc(db, 'movieNights', movieNightId);
  await updateDoc(movieNightRef, {
    assignedMovies: arrayRemove(movieId)
  });
};

// User Movies related functions
export const fetchUserMovies = (userId: string, onUpdate: (movies: Movie[]) => void): (() => void) => {
  const moviesQuery = query(collection(db, 'userMovies'), where('userId', '==', userId));
  return onSnapshot(moviesQuery, (moviesSnapshot) => {
    const moviesData = moviesSnapshot.docs.map(doc => ({ 
      ...doc.data(), 
      id: doc.id
    } as Movie));
    onUpdate(moviesData);
  });
};

export const fetchUserMovieNights = (userId: string, onUpdate: (nights: MovieNight[]) => void): (() => void) => {
  const nightsQuery = query(collection(db, 'movieNights'), where('members', 'array-contains', userId));
  return onSnapshot(nightsQuery, (nightsSnapshot) => {
    const nightsData = nightsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MovieNight));
    onUpdate(nightsData);
  });
};

export const assignMovieToNight = async (movieId: string, movieNightId: string): Promise<void> => {
  const movieNightRef = doc(db, 'movieNights', movieNightId);
  await updateDoc(movieNightRef, {
    assignedMovies: arrayUnion(movieId)
  });
};

export const removeMovieFromAllNights = async (movieId: string, movieNights: MovieNight[]): Promise<void> => {
  for (const night of movieNights) {
    const movieNightRef = doc(db, 'movieNights', night.id);
    await updateDoc(movieNightRef, {
      assignedMovies: arrayRemove(movieId)
    });
  }
};

export const deleteUserMovie = async (movieId: string): Promise<void> => {
  await deleteDoc(doc(db, 'userMovies', movieId));
};

// User related functions
export const fetchUsers = async (userIds: string[]): Promise<User[]> => {
  const userPromises = userIds.map(async (userId) => {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return { id: userId, ...userDoc.data() } as User;
    }
    return null;
  });

  return (await Promise.all(userPromises)).filter((user): user is User => user !== null);
};

// Add more functions as needed...

// Add this new function to fetch movie nights for a specific movie
export const fetchMovieNightsForMovie = async (movieId: string): Promise<MovieNight[]> => {
  const nightsQuery = query(collection(db, 'movieNights'), where('assignedMovies', 'array-contains', movieId));
  const nightsSnapshot = await getDocs(nightsQuery);
  return nightsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MovieNight));
};
