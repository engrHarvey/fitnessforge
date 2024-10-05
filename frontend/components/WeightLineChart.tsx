"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Define the type for the weight log data
type WeightLog = {
  _id: string;
  userId: string;
  value: number; // The actual weight value
  dateTime: string; // Date of the weight log
};

// Define the type for the profile data
type ProfileData = {
  height: number;
  gender: string;
};

const WeightLineChart: React.FC = () => {
  const [weightLogs, setWeightLogs] = useState<WeightLog[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [idealWeight, setIdealWeight] = useState<number | null>(null); // Ideal weight state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token not found in localStorage");
          setError("No authentication token found. Please login.");
          setLoading(false);
          return;
        }

        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        // Fetch profile data to get height and gender
        const userResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/current`, config);
        const userId = userResponse.data._id;
        const { height, gender } = userResponse.data.profile;

        // Set profile data for ideal weight calculation
        setProfileData({ height, gender });

        // Fetch weight logs for the user
        const weightLogResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/logs/user/${userId}/weight`, config);

        if (!weightLogResponse.data.length) {
          setError("No weight logs found. Start tracking your weight to see the progress.");
          setLoading(false);
          return;
        }

        setWeightLogs(weightLogResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching weight logs:", error);
        setError("Failed to fetch weight logs. Please try again later or go to profile and update details.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Format the weight log data for the chart
  const formattedData = weightLogs.map((log) => ({
    date: new Date(log.dateTime).toLocaleDateString(),
    weight: log.value,
  }));

  // Calculate ideal weight whenever profileData is set or updated
  useEffect(() => {
    if (profileData) {
      calculateIdealWeight(profileData.height, profileData.gender);
    }
  }, [profileData]);

  // Ideal weight calculation using the Miller formula
  const calculateIdealWeight = (height: number, gender: string) => {
    const heightInInches = height * 39.3701; // Convert height in meters to inches
    const inchesOverFiveFeet = heightInInches - 60; // Calculate height above 5 feet (60 inches)

    let idealWeightInKg: number;

    if (inchesOverFiveFeet < 0) {
      setIdealWeight(null);
      return;
    }

    if (gender === "male") {
      idealWeightInKg = 56.2 + 1.41 * inchesOverFiveFeet;
    } else if (gender === "female") {
      idealWeightInKg = 53.1 + 1.36 * inchesOverFiveFeet;
    } else {
      idealWeightInKg = 0;
    }

    setIdealWeight(idealWeightInKg);
  };

  // Merge ideal weight into the formatted data for each date
  const mergedData = formattedData.map((log) => ({
    ...log,
    ideal: idealWeight !== null ? idealWeight : undefined, // Add ideal weight to each log if calculated
  }));

  return (
    <div className="w-full h-[50vh] sm:h-[55vh] lg:h-[60vh] p-4 lg:p-6 bg-dark bg-opacity-70 rounded-lg shadow-lg mx-auto lg:max-w-5xl">
      <h2 className="text-center text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-2 lg:mb-4">
        Weight Over Time
      </h2>
      {loading ? (
        <p className="text-center text-lg text-gray-300">Loading weight logs...</p>
      ) : error ? (
        <p className="text-center text-lg text-red-500 p-4 bg-opacity-20 bg-red-100 rounded-md border border-red-400">
          {error}
        </p>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mergedData} margin={{ top: 10, right: 20, left: 0, bottom: 50 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
            <XAxis dataKey="date" stroke="#ccc" tick={{ fill: "#fff" }} />
            <YAxis stroke="#ccc" tick={{ fill: "#fff" }} />
            <Tooltip />
            <Line type="monotone" dataKey="weight" stroke="#4caf50" strokeWidth={3} />
            {idealWeight !== null && (
              <Line type="monotone" dataKey="ideal" stroke="#FF5733" strokeWidth={2} strokeDasharray="5 5" />
            )}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );     
};

export default WeightLineChart;
