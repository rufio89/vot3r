import React, { useEffect, useState } from 'react';
import { User } from '../types/UserTypes';
import { fetchUsers } from '../firebase/firebaseService';

interface MovieNightUsersProps {
  userIds: string[];
}

const MovieNightUsers: React.FC<MovieNightUsersProps> = ({ userIds }) => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const fetchedUsers = await fetchUsers(userIds);
      setUsers(fetchedUsers);
    };

    fetchUserData();
  }, [userIds]);

  return (
    <div className="flex flex-wrap gap-4 mb-4">
      {users.map((user) => (
        <div key={user.id} className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center text-2xl">
            {user.emoji || '👤'}
          </div>
          <span className="mt-1 text-sm text-center">{user.handle || 'User'}</span>
        </div>
      ))}
    </div>
  );
};

export default MovieNightUsers;
