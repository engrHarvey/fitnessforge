"use client";

import React, { useState } from "react";
import AuthWrapper from "../../../components/AuthWrapper";
import WorkoutSearch, { Exercise } from "../../../components/workout";
import axios from "axios";
import Image from 'next/image';

const SearchWorkout: React.FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState<string | null>(null); // Add state to store userId

  // Fetch the user ID when the component mounts
  React.useEffect(() => {
    const fetchUserId = async () => {
      try {
        const token = localStorage.getItem("token"); // Get token from localStorage
        if (!token) {
          setError("No authentication token found. Please login.");
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/current`, config);
        setUserId(response.data._id); // Save the user ID
      } catch (err) {
        console.error("Error fetching user ID:", err);
        setError("Error fetching user information. Please try again.");
      }
    };

    fetchUserId();
  }, []);

  // Function to handle "Do Workout" button click
  const handleDoWorkout = async (exercise: Exercise) => {
    if (!userId) {
      setError("User ID not found. Please login again.");
      return;
    }
  
    const workoutData = {
      userId: userId,
      typeOfWorkout: exercise.type,
      muscle: exercise.muscle,
      dateTime: new Date().toISOString(), // Set the current date and time
    };
  
    try {
      // Use the existing endpoint `/api/workouts`
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/workouts`, workoutData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Add the token to headers
        },
      });
      if (response.status === 201) {
        console.log("Workout log created successfully:", response.data);
        alert("Workout logged successfully!");
      } else {
        setError("Failed to log workout. Please try again.");
      }
    } catch (err) {
      console.error("Error logging workout:", err);
      setError("Error logging workout. Please try again.");
    }
  };
  
  const customLoader = ({ src }: { src: string }) => {
    return src;
  };

  return (
    <AuthWrapper>
      <div
        className="w-full min-h-screen flex flex-col items-center justify-start text-white"
        style={{
          backgroundImage: "url('/searchworkout-bg.jpg')",
          backgroundRepeat: "repeat", // Ensure the background repeats
          backgroundSize: "auto", // Set background size to auto for proper repeat
          backgroundPosition: "center",
        }}
      >
        {/* Background Overlay for Contrast */}
        <div className="min-h-screen w-full bg-black bg-opacity-60 p-8">
          <div className="max-w-4xl mx-auto bg-dark bg-opacity-80 p-10 rounded-lg shadow-2xl">
            <h1 className="text-5xl font-extrabold mb-10 text-center text-primary">Search Workouts</h1>

            {/* Include WorkoutSearch Component with the required props */}
            <WorkoutSearch
              setExercises={setExercises}
              setLoading={setLoading}
              setError={setError}
              loading={loading} // Add loading prop here
            />

            {/* Loading and Error Handling */}
            {loading && <p className="text-center mt-6 text-lg text-secondary">Loading...</p>}
            {error && <p className="text-center text-red-500 mt-6 text-lg">{error}</p>}

            {/* Display Exercise Results */}
            {exercises.length > 0 && (
              <div className="mt-12">
                <h2 className="text-3xl font-bold mb-6 text-center text-primary">Results:</h2>
                <ul className="space-y-8">
                  {exercises.map((exercise, index) => (
                    <li key={index} className="bg-secondary p-6 rounded-lg shadow-xl">
                      <h3 className="text-2xl font-bold mb-4 text-center text-dark">{exercise.name}</h3>

                      {/* Image Positioned Below the Exercise Name */}
                      {exercise.imageUrl && (
                        <div className="w-full h-full mb-4 overflow-hidden rounded-lg shadow-md">
                          <Image
                            loader={customLoader}
                            src={exercise.imageUrl}
                            alt={exercise.name}
                            width={500}
                            height={500}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      {/* Exercise Details */}
                      <div className="space-y-2 text-white">
                        <p className="text-sm">
                          <span className="font-semibold">Type:</span> {exercise.type}
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold">Muscle:</span> {exercise.muscle}
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold">Difficulty:</span> {exercise.difficulty}
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold">Equipment:</span> {exercise.equipment}
                        </p>
                        <p className="text-sm mt-2">{exercise.instructions}</p>
                      </div>

                      {/* "Do Workout" Button */}
                      <div className="text-center">
                        <button
                          onClick={() => handleDoWorkout(exercise)} // Use the handleDoWorkout function
                          className="mt-6 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full transition duration-300"
                        >
                          Do Workout
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthWrapper>
  );
};

export default SearchWorkout;
