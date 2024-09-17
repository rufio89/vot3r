import { collection, query, where, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { db, auth } from './clientApp';
import { MovieNight, Movie } from '../types/MovieTypes';
import { User } from '../types/UserTypes';

// User-related functions
export const createUser = async (email: string, password: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const signIn = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const signOutUser = async () => {
  await signOut(auth);
};

export const getUserProfile = async (userId: string) => {
  const userDoc = await getDoc(doc(db, 'users', userId));
  return userDoc.exists() ? { id: userId, ...userDoc.data() } as User : null;
};

export const updateUserProfile = async (userId: string, data: Partial<User>) => {
  await updateDoc(doc(db, 'users', userId), data);
};

// Movie Night-related functions
export const createMovieNight = async (movieNight: Omit<MovieNight, 'id'>) => {
  const docRef = await addDoc(collection(db, 'movieNights'), movieNight);
  return docRef.id;
};

export const getMovieNights = async (userId: string) => {
  const q = query(collection(db, 'movieNights'), where('members', 'array-contains', userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MovieNight));
};

export const updateMovieNight = async (movieNightId: string, data: Partial<MovieNight>) => {
  await updateDoc(doc(db, 'movieNights', movieNightId), data);
};

export const joinMovieNight = async (movieNightId: string, userId: string, userEmail: string) => {
  await updateDoc(doc(db, 'movieNights', movieNightId), {
    members: arrayUnion(userId),
    invitations: arrayRemove(userEmail)
  });
};

// Movie-related functions
export const getUserMovies = async (userId: string) => {
  const q = query(collection(db, 'userMovies'), where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Movie));
};

export const addMovie = async (movie: Omit<Movie, 'id'>) => {
  const docRef = await addDoc(collection(db, 'userMovies'), movie);
  return docRef.id;
};

export const removeMovie = async (movieId: string) => {
  await deleteDoc(doc(db, 'userMovies', movieId));
};

export const assignMovieToNight = async (movieId: string, movieNightId: string) => {
  await updateDoc(doc(db, 'movieNights', movieNightId), {
    assignedMovies: arrayUnion(movieId)
  });
};

export const removeMovieFromNight = async (movieId: string, movieNightId: string) => {
  await updateDoc(doc(db, 'movieNights', movieNightId), {
    assignedMovies: arrayRemove(movieId)
  });
};
