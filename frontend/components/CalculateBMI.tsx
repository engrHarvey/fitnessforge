"use client";

import React, { useState } from "react";
import axios from "axios";

// Define the ProfileData type for strong typing
interface ProfileData {
  userId: string;
  height: number;
  weight: number;
  birthdate: string;
  gender: string;
  [key: string]: any;
}

interface CalculateBMIProps {
  profileData: ProfileData; // Use ProfileData type instead of any
  setProfileData: React.Dispatch<React.SetStateAction<ProfileData>>;
  setLatestBmiLog: React.Dispatch<React.SetStateAction<number | null>>;
  setNoBmiData: React.Dispatch<React.SetStateAction<boolean>>;
}

const CalculateBMI: React.FC<CalculateBMIProps> = ({
  profileData,
  setProfileData,
  setLatestBmiLog,
  setNoBmiData,
}) => {
  const [bmi, setBmi] = useState<number | null>(null);
  const [bmiCategory, setBmiCategory] = useState<string | null>(null);
  const [bmiCategoryColor, setBmiCategoryColor] = useState<string>("");

  // Helper function to determine BMI category and color
  const determineBmiCategory = (bmiValue: number) => {
    let category = "";
    let color = "";
    if (bmiValue < 18.5) {
      category = "Underweight";
      color = "text-blue-500";
    } else if (bmiValue >= 18.5 && bmiValue <= 24.9) {
      category = "Normal weight";
      color = "text-green-500";
    } else if (bmiValue >= 25 && bmiValue <= 29.9) {
      category = "Overweight";
      color = "text-orange-500";
    } else if (bmiValue >= 30) {
      category = "Obesity";
      color = "text-red-500";
    }
    setBmiCategory(category);
    setBmiCategoryColor(color);
  };

  // Function to calculate BMI and determine BMI category
  const handleCalculateBmi = async () => {
    if (profileData?.height && profileData?.weight) {
      const heightInMeters = profileData.height;
      const weightInKg = profileData.weight;
      const calculatedBmi = weightInKg / (heightInMeters * heightInMeters);
      setBmi(calculatedBmi);
      determineBmiCategory(calculatedBmi);

      // Submit BMI log to the server
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No authentication token found. Please login.");
          return;
        }

        const config = { headers: { Authorization: `Bearer ${token}` } };
        const logData = {
          userId: profileData?.userId,
          type: "bmi",
          value: calculatedBmi,
        };

        // Change this URL when deploying to a live server
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/logs/create`, logData, config);
        console.log("BMI log created successfully.");
        setLatestBmiLog(calculatedBmi);
        setNoBmiData(false);
      } catch (err) {
        console.error("Error creating BMI log:", err);
      }
    }
  };

  return (
    <div className="my-4">
      <button
        onClick={handleCalculateBmi}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 shadow-lg"
      >
        Calculate BMI
      </button>

      {/* Display Calculated BMI */}
      {bmi && (
        <div className="mt-4">
          <p className="text-lg">
            <span className="font-semibold">Calculated BMI:</span> {bmi.toFixed(2)}{" "}
            <span className={`${bmiCategoryColor} font-bold`}>{bmiCategory}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default CalculateBMI;
