'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../firebase/clientApp';
import { useAuth } from '../../context/AuthContext';

export default function InvitePage({ params }: { params: { code: string } }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const acceptInvite = async () => {
      if (!user) {
        setError('You must be logged in to accept an invitation');
        setLoading(false);
        return;
      }

      try {
        const inviteRef = doc(db, 'invitations', params.code);
        const inviteSnap = await getDoc(inviteRef);

        if (!inviteSnap.exists()) {
          setError('Invalid invitation code');
          setLoading(false);
          return;
        }

        const inviteData = inviteSnap.data();

        if (inviteData.used) {
          setError('This invitation has already been used');
          setLoading(false);
          return;
        }

        const movieNightRef = doc(db, 'movieNights', inviteData.movieNightId);
        await updateDoc(movieNightRef, {
          members: arrayUnion(user.uid)
        });

        await updateDoc(inviteRef, { used: true });

        router.push(`/movie-night/${inviteData.movieNightId}`);
      } catch (error) {
        console.error('Error accepting invitation:', error);
        setError('Failed to accept invitation. Please try again.');
        setLoading(false);
      }
    };

    acceptInvite();
  }, [user, params.code, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return null;
}
