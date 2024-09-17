'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaFilm, FaUser } from 'react-icons/fa'; // Make sure to install react-icons

const BottomNav = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe md:hidden">
      <div className="flex justify-around">
        <Link href="/" className={`pt-2 pb-1 text-center ${pathname === '/' ? 'text-primary' : 'text-gray-500'}`}>
          <FaHome className="h-6 w-6 mb-1 mx-auto" />
          <span className="text-xs">Home</span>
        </Link>
        <Link href="/my-movies" className={`pt-2 pb-1 text-center ${pathname === '/my-movies' ? 'text-primary' : 'text-gray-500'}`}>
          <FaFilm className="h-6 w-6 mb-1 mx-auto" />
          <span className="text-xs">My Movies</span>
        </Link>
        <Link href="/profile" className={`pt-2 pb-1 text-center ${pathname === '/profile' ? 'text-primary' : 'text-gray-500'}`}>
          <FaUser className="h-6 w-6 mb-1 mx-auto" />
          <span className="text-xs">Profile</span>
        </Link>
      </div>
    </nav>
  );
};

export default BottomNav;
