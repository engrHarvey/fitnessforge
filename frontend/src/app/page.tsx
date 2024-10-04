import React from 'react';
import Link from 'next/link';

const Home: React.FC = () => {
  return (
    <div
      className="h-screen flex items-center justify-center bg-cover bg-center bg-fixed bg-no-repeat px-4" // Added padding to prevent overflow on small screens
      style={{ backgroundImage: "url('/landing-bg.jpg')" }}
    >
      <div className="bg-black bg-opacity-70 p-6 sm:p-10 lg:p-12 rounded-xl shadow-lg text-center transition-all transform hover:scale-105 hover:shadow-2xl duration-500 w-full max-w-md">
        {/* Adjusted padding for mobile, with max-width for better scaling */}
        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-primary mb-4 lg:mb-6 drop-shadow-lg">
          Welcome to FitnessForge
        </h1>
        {/* Reduced font size and margin for smaller screens */}
        <p className="text-base sm:text-lg text-gray-300 mb-6 lg:mb-10 font-medium">
          Your ultimate fitness tracking and management platform.
        </p>
        {/* Adjusted spacing for buttons on mobile */}
        <div className="space-y-4 sm:space-y-0 sm:space-x-6">
          <Link href="/login">
            <button className="bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 text-white font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-full shadow-lg transition-all transform hover:scale-105 ease-in-out duration-300 w-full sm:w-auto">
              Login
            </button>
          </Link>
          <Link href="/signup">
            <button className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-full shadow-lg transition-all transform hover:scale-105 ease-in-out duration-300 w-full sm:w-auto">
              Sign Up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
