import { Timestamp } from 'firebase/firestore';

export interface Movie {
  id: string;
  title: string;
  year: string;
  poster: string;
  imdbID: string;
  userId: string;
  plot: string;
  addedAt: Date;
  assignedTo: Record<string, string>;
}

export interface MovieNight {
  id: string;
  name: string;
  votes: Record<string, string>; // userId: movieId
  assignedMovies: string[];
  members: string[];
  dateTime: Timestamp | null;
  invitations?: string[];
}

export interface UserMovie extends Movie {
  // Add any additional fields specific to UserMovie if needed
}
