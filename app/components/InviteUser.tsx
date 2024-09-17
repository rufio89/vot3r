import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase/clientApp';
import { useAuth } from '../context/AuthContext';

interface InviteUserProps {
  movieNightId: string;
}

const InviteUser: React.FC<InviteUserProps> = ({ movieNightId }) => {
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const { user } = useAuth();

  const generateInviteLink = async () => {
    if (!user) {
      alert('You must be logged in to invite users');
      return;
    }

    try {
      const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      const inviteRef = await addDoc(collection(db, 'invitations'), {
        movieNightId,
        createdBy: user.uid,
        createdAt: new Date(),
        code: inviteCode,
        used: false
      });

      const baseUrl = window.location.origin;
      const link = `${baseUrl}/invite/${inviteCode}`;
      setInviteLink(link);
    } catch (error) {
      console.error('Error generating invitation:', error);
      alert('Failed to generate invitation. Please try again.');
    }
  };

  return (
    <div className="space-y-2">
      <button 
        onClick={generateInviteLink}
        className="w-full p-2 bg-primary hover:bg-primary-dark text-white rounded transition duration-300"
      >
        Generate Invite Link
      </button>
      {inviteLink && (
        <div className="mt-2">
          <p className="text-sm mb-1">Share this link with your friend:</p>
          <input 
            type="text" 
            value={inviteLink} 
            readOnly 
            className="w-full p-2 border border-secondary rounded text-foreground bg-white"
          />
          <button 
            onClick={() => {
              navigator.clipboard.writeText(inviteLink);
              alert('Invite link copied to clipboard!');
            }}
            className="mt-2 w-full p-2 bg-secondary hover:bg-secondary-dark text-foreground rounded transition duration-300"
          >
            Copy Link
          </button>
        </div>
      )}
    </div>
  );
};

export default InviteUser;
