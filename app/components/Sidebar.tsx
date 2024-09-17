"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaFilm, FaUser } from 'react-icons/fa';

const Sidebar = () => {
  const pathname = usePathname();

  const navItems = [
    { href: '/', icon: FaHome, label: 'Home' },
    { href: '/my-movies', icon: FaFilm, label: 'My Movies' },
    { href: '/profile', icon: FaUser, label: 'Profile' },
  ];

  return (
    <nav className="hidden md:flex flex-col bg-white border-r border-gray-200 w-48 h-screen fixed left-0 top-0 z-10">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`flex items-center space-x-2 px-4 py-3 hover:bg-gray-100 transition-colors ${
            pathname === item.href ? 'text-primary border-r-4 border-primary' : 'text-gray-600'
          }`}
        >
          <item.icon className="w-5 h-5" />
          <span className="text-sm">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
};

export default Sidebar;
