import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMovieNights, joinMovieNight } from '../firebase/firebaseUtils';
import { MovieNight } from '../types/MovieTypes';

const JoinMovieNight: React.FC = () => {
  const [movieNights, setMovieNights] = useState<MovieNight[]>([]);
  const [invitations, setInvitations] = useState<MovieNight[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchMovieNights = async () => {
      if (!user) return;
      
      const allNights = await getMovieNights(user.uid);
      const publicNights = allNights.filter(night => !night.members.includes(user.uid));
      const invitedNights = allNights.filter(night => night.invitations?.includes(user.email ?? ''));
      
      setMovieNights(publicNights);
      setInvitations(invitedNights);
    };

    fetchMovieNights();
  }, [user]);

  const handleJoinMovieNight = async (movieNightId: string) => {
    if (!user) {
      alert('You must be logged in to join a movie night');
      return;
    }
    try {
      if (!user.email) throw new Error('User email is required');
      await joinMovieNight(movieNightId, user.uid, user.email);
      setMovieNights(movieNights.filter(night => night.id !== movieNightId));
      setInvitations(invitations.filter(night => night.id !== movieNightId));
    } catch (error) {
      console.error('Error joining movie night:', error);
      alert('Failed to join movie night. Please try again.');
    }
  };

  return (
    <div className="space-y-4">
      {invitations.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-primary-dark">Your Invitations</h3>
          {invitations.map(night => (
            <div key={night.id} className="flex justify-between items-center p-2 border border-secondary rounded">
              <span>{night.name}</span>
              <button
                onClick={() => handleJoinMovieNight(night.id)}
                className="px-3 py-1 bg-primary hover:bg-primary-dark text-white rounded transition duration-300"
              >
                Accept Invitation
              </button>
            </div>
          ))}
        </div>
      )}
      
      <h3 className="text-lg font-semibold text-primary-dark">Public Movie Nights</h3>
      {movieNights.length === 0 ? (
        <p>No available movie nights to join.</p>
      ) : (
        movieNights.map(night => (
          <div key={night.id} className="flex justify-between items-center p-2 border border-secondary rounded">
            <span>{night.name}</span>
            <button
              onClick={() => handleJoinMovieNight(night.id)}
              className="px-3 py-1 bg-primary hover:bg-primary-dark text-white rounded transition duration-300"
            >
              Join
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default JoinMovieNight;
