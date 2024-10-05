"use client";
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const Signup: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/register`, {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      if (response.status === 201) {
        alert('User registered successfully!');
        router.push('/login'); // Redirect to login page upon success
      }
    } catch (error) {
      setError('Error registering user. Please try again.');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat px-4 sm:px-8" // Added `px-4` to handle overflow on small screens
      style={{ backgroundImage: "url('/signup-bg.jpg')" }}
    >
      <div className="bg-gradient-to-b from-black to-gray-800 bg-opacity-90 p-6 sm:p-10 rounded-xl w-full max-w-xs sm:max-w-md shadow-lg text-center transform hover:scale-105 transition-all duration-300 ease-in-out">
        {/* Adjusted padding for small screens */}
        <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-4 sm:mb-6">
          Create an Account
        </h1>
        {/* Reduced font size and margin for heading on mobile */}
        <p className="text-sm sm:text-lg text-gray-300 mb-6 sm:mb-10">
          Join FitnessForge and start tracking your workouts!
        </p>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {error && <p className="text-red-500 text-sm sm:text-base">{error}</p>}
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            className="w-full p-3 sm:p-4 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:border-primary focus:outline-none transition duration-200"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-3 sm:p-4 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:border-primary focus:outline-none transition duration-200"
            required
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full p-3 sm:p-4 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:border-primary focus:outline-none transition duration-200"
            required
          />
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Repeat Password"
            className="w-full p-3 sm:p-4 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:border-primary focus:outline-none transition duration-200"
            required
          />
          <button
            type="submit"
            className="w-full bg-primary hover:bg-orange-600 text-white font-bold py-3 sm:py-4 rounded-full transition duration-300 transform hover:scale-105 ease-in-out"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
