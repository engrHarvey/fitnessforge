"use client";
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaHome, FaClipboardList, FaSearch, FaUser, FaSignOutAlt } from 'react-icons/fa';

export default function Navbar() {
  const router = useRouter();

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('token'); // Assuming token is stored in localStorage
    router.push('/login'); // Redirect to login page
  };

  return (
    <nav className="bg-dark p-4 flex justify-between items-center shadow-md">
      <h1 className="text-3xl text-primary font-bold">FitnessForge</h1>
      <div className="flex items-center space-x-6">
        <Link href="/dashboard" className="text-secondary hover:text-primary transition duration-300">
          <FaHome className="inline-block mr-2" />
        </Link>
        <Link href="/journal" className="text-secondary hover:text-primary transition duration-300">
          <FaClipboardList className="inline-block mr-2" />
        </Link>
        <Link href="/searchwork" className="text-secondary hover:text-primary transition duration-300">
          <FaSearch className="inline-block mr-2" />
        </Link>
        <Link href="/profile" className="text-secondary hover:text-primary transition duration-300">
          <FaUser className="inline-block mr-2" />
        </Link>
        <button
          onClick={handleLogout}
          className="text-red-500 hover:text-red-700 transition duration-300"
        >
          <FaSignOutAlt className="inline-block mr-2" />
        </button>
      </div>
    </nav>
  );
}
