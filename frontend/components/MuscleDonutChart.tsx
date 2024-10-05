"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

// Define the workout type structure
type Workout = {
  _id: string;
  userId: string;
  muscle: string;
  typeOfWorkout: string;
  dateTime: string;
};

// Muscle groups and workout type color maps
const muscleColors: Record<string, string> = {
  abdominals: "#FF5733",       // Orange Red
  abductors: "#33FF57",        // Lime Green
  adductors: "#5733FF",        // Blue Purple
  biceps: "#33FFF6",           // Cyan
  calves: "#FFC300",           // Gold
  chest: "#FF3333",            // Red
  forearms: "#33FF8F",         // Mint Green
  shoulders: "#FFD700",        // Gold Yellow
  glutes: "#FF33A1",           // Hot Pink
  hamstrings: "#338FFF",       // Light Blue
  lats: "#FF8F33",             // Light Orange
  lower_back: "#FF5733",       // Light Red
  middle_back: "#33FFD1",      // Aqua
  neck: "#33A1FF",             // Sky Blue
  quadriceps: "#F833FF",       // Magenta
  traps: "#8F33FF",            // Purple
  triceps: "#FF3365",          // Coral Red
};

// Workout type colors
const workoutTypeColors: Record<string, string> = {
  cardio: "#FF5733",
  olympic_weightlifting: "#33FF57",
  plyometrics: "#5733FF",
  powerlifting: "#33FFF6",
  strength: "#FF3333",
  stretching: "#FFC300",
  strongman: "#FF8F33",
};

const MuscleDonutChart: React.FC = () => {
  const [workoutData, setWorkoutData] = useState<Workout[]>([]); // State to store original workout data
  const [chartData, setChartData] = useState<{ name: string; value: number }[]>([]); // State for chart display data
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState<"muscle" | "workout">("muscle"); // Toggle state between muscle and workout types

  useEffect(() => {
    const fetchWorkoutData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No authentication token found. Please login.");
          setLoading(false);
          return;
        }

        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        // Fetch current user data to get the user ID
        const userResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/current`, config);
        const userId = userResponse.data._id;

        // Fetch current user's workouts
        const workoutResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/workouts/${userId}`, config);

        // Set the raw workout data and formatted data based on the default view type
        setWorkoutData(workoutResponse.data);
        setChartData(formatMuscleData(workoutResponse.data));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching workout data:", error);
        setError("Failed to fetch workout data. Please try again later or add workout data at search workouts.");
        setLoading(false);
      }
    };

    fetchWorkoutData();
  }, []);

  // Function to format data for muscle groups
  const formatMuscleData = (data: Workout[]) => {
    const muscleGroupCount: Record<string, number> = {};
    data.forEach((workout) => {
      if (workout.muscle) {
        if (muscleGroupCount[workout.muscle]) {
          muscleGroupCount[workout.muscle] += 1;
        } else {
          muscleGroupCount[workout.muscle] = 1;
        }
      }
    });

    return Object.entries(muscleGroupCount).map(([key, value]) => ({
      name: key,
      value,
    }));
  };

  // Function to format data for workout types
  const formatWorkoutTypeData = (data: Workout[]) => {
    const workoutTypeCount: Record<string, number> = {};
    data.forEach((workout) => {
      if (workout.typeOfWorkout) {
        if (workoutTypeCount[workout.typeOfWorkout]) {
          workoutTypeCount[workout.typeOfWorkout] += 1;
        } else {
          workoutTypeCount[workout.typeOfWorkout] = 1;
        }
      }
    });

    return Object.entries(workoutTypeCount).map(([key, value]) => ({
      name: key,
      value,
    }));
  };

  // Toggle function between muscle and workout view
  const handleToggleView = () => {
    setViewType((prevType) => {
      const newType = prevType === "muscle" ? "workout" : "muscle";
      // Update chart data based on the new view type
      setChartData(newType === "muscle" ? formatMuscleData(workoutData) : formatWorkoutTypeData(workoutData));
      return newType;
    });
  };

  return (
    <div className="w-full h-[50vh] sm:h-[55vh] lg:h-[60vh] p-4 lg:p-6 bg-dark bg-opacity-70 rounded-lg shadow-lg mx-auto lg:max-w-5xl">
      <div className="flex justify-between items-center mb-4 lg:mb-6">
        <h2 className="text-center text-2xl lg:text-3xl font-bold text-primary">
          {viewType === "muscle" ? "Muscle Group Workouts" : "Workout Type"}
        </h2>
        <button
          className="bg-primary text-white py-2 px-4 lg:py-3 lg:px-6 rounded-lg hover:bg-orange-500 transition duration-300 focus:outline-none focus:ring-4 ring-orange-300"
          onClick={handleToggleView}
        >
          Toggle to {viewType === "muscle" ? "Workout Type" : "Muscle Group"}
        </button>
      </div>
      {loading ? (
        <p className="text-center text-lg sm:text-xl text-gray-300">Loading workout data...</p>
      ) : error ? (
        <p className="text-center text-lg sm:text-xl text-red-500 p-4 bg-opacity-20 bg-red-100 rounded-md border border-red-400">
          {error}
        </p>
      ) : (
        <div className="h-72 lg:h-[47vh]"> {/* Adjusted height to better match line chart */}
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                innerRadius="40%" // Adjusted inner radius for better proportion
                outerRadius="70%" // Adjusted outer radius to make the chart more compact
                dataKey="value"
                label={({ name, percent, x, y }) => (
                  <text
                    x={x}
                    y={y}
                    fill="white"
                    fontSize="12px"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    stroke="#000"
                    strokeWidth={0.5}
                  >
                    {`${name} ${(percent * 100).toFixed(0)}%`}
                  </text>
                )}
                isAnimationActive={true}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      viewType === "muscle"
                        ? muscleColors[entry.name] || "#8884d8"
                        : workoutTypeColors[entry.name] || "#82ca9d"
                    }
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: "#333", color: "#fff", borderRadius: "8px" }}
                cursor={{ stroke: "#FF6500", strokeWidth: 2 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );  
};

export default MuscleDonutChart;
