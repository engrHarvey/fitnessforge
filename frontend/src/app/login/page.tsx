"use client";
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', formData);
      if (response.status === 200) {
        alert('Login Successful!');
        localStorage.setItem('token', response.data.token); // Store token for AuthWrapper validation
        router.push('/dashboard'); // Redirect to dashboard
      }
    } catch (error) {
      setErrorMessage('Invalid email or password.');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat px-4" // Added `px-4` to handle overflow on small screens
      style={{ backgroundImage: "url('/login-bg.jpg')" }}
    >
      <div className="bg-gradient-to-b from-black to-gray-800 bg-opacity-90 p-8 sm:p-12 rounded-xl shadow-lg w-full max-w-xs sm:max-w-md text-center transform hover:scale-105 transition-all duration-300 ease-in-out">
        {/* Adjusted padding for mobile screens and set responsive max-width */}
        <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-4 sm:mb-8 drop-shadow-lg">
          Login to FitnessForge
        </h1>
        {/* Reduced font size and margin for heading on mobile */}
        {errorMessage && (
          <p className="text-red-500 text-sm sm:text-base mb-4 sm:mb-6">
            {errorMessage}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-3 sm:p-4 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:border-primary focus:outline-none transition duration-300"
            required
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full p-3 sm:p-4 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:border-primary focus:outline-none transition duration-300"
            required
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 text-white font-bold py-3 sm:py-4 rounded-full shadow-lg transition-all transform hover:scale-105 ease-in-out duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
