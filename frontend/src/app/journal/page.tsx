"use client";

import React, { useEffect, useState } from "react";
import AuthWrapper from "../../../components/AuthWrapper";
import WorkoutCalendar from "../../../components/Calendar";
import axios from "axios";
import { useRouter } from "next/navigation";

type Workout = {
  _id: string;
  userId: string;
  typeOfWorkout: string;
  muscle: string;
  dateTime: string;
};

export default function Journal() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Add an error state
  const router = useRouter();

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        // Retrieve the JWT token from local storage (use the same key as the Profile page)
        const token = localStorage.getItem("token");

        // If no token is found, set an error instead of redirecting immediately
        if (!token) {
          console.error("No authentication token found. Please login.");
          setError("No authentication token found. Please login.");
          return;
        }

        // Fetch the current user's ID using the /current endpoint
        const userResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/current`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userId = userResponse.data._id;

        // Fetch the user's workouts from the workout API
        const workoutResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/workouts/${userId}`);
        setWorkouts(workoutResponse.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch workouts:", error);
        setError('No saved workout data. Go to search workouts and "do workout" to save.');
        setIsLoading(false);
      }
    };

    fetchWorkouts();
  }, [router]);

  return (
    <AuthWrapper>
      <div
        className="h-screen bg-cover bg-center text-white relative"
        style={{ backgroundImage: "url('/journal-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="relative h-full flex flex-col items-center justify-center p-4">
          <h1 className="text-6xl font-bold mb-8 text-primary drop-shadow-lg">Journal</h1>
          <div className="w-full max-w-6xl">
            {/* Display error message if the token is missing */}
            {error ? (
              <div className="text-center text-lg text-red-500">{error}</div>
            ) : isLoading ? (
              <div className="text-center text-lg">Loading workouts...</div>
            ) : (
              <WorkoutCalendar workouts={workouts} />
            )}
          </div>
        </div>
      </div>
    </AuthWrapper>
  );
}
