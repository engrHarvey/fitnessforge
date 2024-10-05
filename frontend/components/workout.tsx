import React, { useState } from "react";
import axios from "axios";

// Define the type for each exercise
export type Exercise = {
  name: string;
  type: string;
  muscle: string;
  difficulty: string;
  equipment: string;
  instructions: string;
  imageUrl?: string; // Optional property for the fetched image URL
};

export default function WorkoutSearch({
  setExercises,
  setLoading,
  setError,
  loading, // Add the `loading` prop here
}: {
  setExercises: React.Dispatch<React.SetStateAction<Exercise[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean; // Define the `loading` prop as boolean
}) {
  const [muscle, setMuscle] = useState("");
  const [type, setType] = useState("");
  const [difficulty, setDifficulty] = useState("");

  // Use separate environment variables for each API
  const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_CSE_API_KEY;
  const CSE_ID = process.env.NEXT_PUBLIC_GOOGLE_CSE_ID;
  const RAPIDAPI_KEY = process.env.NEXT_PUBLIC_RAPIDAPI_KEY;

  // Function to fetch exercise images using Google Custom Search API
  const fetchExerciseImage = async (exerciseName: string) => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/customsearch/v1?q=${exerciseName}&cx=${CSE_ID}&searchType=image&key=${GOOGLE_API_KEY}`
      );
      if (response.status === 200 && response.data.items && response.data.items.length > 0) {
        return response.data.items[0].link; // Return the first image link
      }
    } catch (err) {
      console.error(`Error fetching image for ${exerciseName}:`, err);
      return null;
    }
  };

  // Function to handle search button click
  const handleSearch = async () => {
    setLoading(true);
    setError("");
    setExercises([]); // Clear previous results

    try {
      const response = await axios.get("https://exercises-by-api-ninjas.p.rapidapi.com/v1/exercises", {
        headers: {
          "x-rapidapi-key": RAPIDAPI_KEY, // Use the RapidAPI environment variable here
        },
        params: {
          muscle: muscle || undefined,
          type: type || undefined,
          difficulty: difficulty || undefined,
        },
      });

      if (response.status === 200) {
        const exercisesWithImages: Exercise[] = await Promise.all(
          response.data.map(async (exercise: Exercise) => {
            const imageUrl = await fetchExerciseImage(exercise.name);
            return { ...exercise, imageUrl };
          })
        );
        setExercises(exercisesWithImages);
      } else {
        setError("Invalid response from the server.");
      }
    } catch (err) {
      console.error("API Error:", err);
      setError("Error fetching workouts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Muscle Group Selection */}
      <div className="mb-6">
        <label className="block mb-2 text-lg font-semibold text-secondary">Select Muscle Group</label>
        <select
          className="w-full p-3 text-black rounded-lg focus:outline-none focus:ring-2 ring-primary"
          value={muscle}
          onChange={(e) => setMuscle(e.target.value)}
        >
          <option value="">Any</option>
          <option value="abdominals">Abdominals</option>
          <option value="abductors">Abductors</option>
          <option value="adductors">Adductors</option>
          <option value="biceps">Biceps</option>
          <option value="calves">Calves</option>
          <option value="chest">Chest</option>
          <option value="forearms">Forearms</option>
          <option value="shoulders">Shoulders</option>
          <option value="glutes">Glutes</option>
          <option value="hamstrings">Hamstrings</option>
          <option value="lats">Lats</option>
          <option value="lower_back">Lower Back</option>
          <option value="middle_back">Middle Back</option>
          <option value="neck">Neck</option>
          <option value="quadriceps">Quadriceps</option>
          <option value="traps">Traps</option>
          <option value="triceps">Triceps</option>
        </select>
      </div>

      {/* Exercise Type Selection */}
      <div className="mb-6">
        <label className="block mb-2 text-lg font-semibold text-secondary">Select Exercise Type</label>
        <select
          className="w-full p-3 text-black rounded-lg focus:outline-none focus:ring-2 ring-primary"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="">Any</option>
          <option value="cardio">Cardio</option>
          <option value="olympic_weightlifting">Olympic Weightlifting</option>
          <option value="plyometrics">Plyometrics</option>
          <option value="powerlifting">Powerlifting</option>
          <option value="strength">Strength</option>
          <option value="stretching">Stretching</option>
          <option value="strongman">Strongman</option>
        </select>
      </div>

      {/* Difficulty Selection */}
      <div className="mb-6">
        <label className="block mb-2 text-lg font-semibold text-secondary">Select Difficulty Level</label>
        <select
          className="w-full p-3 text-black rounded-lg focus:outline-none focus:ring-2 ring-primary"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="">Any</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="expert">Expert</option>
        </select>
      </div>

      {/* Search Button */}
      <button
        onClick={handleSearch}
        className="w-full bg-primary hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition duration-300 focus:outline-none shadow-md"
        disabled={loading} // Use the passed `loading` prop
      >
        {loading ? "Searching..." : "Search Workouts"}
      </button>
    </div>
  );
}
