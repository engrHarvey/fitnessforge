"use client";

import React, { useState, useEffect, useCallback } from "react";

// Define a strong type for profileData to avoid using "any"
interface ProfileData {
  height: number;
  gender: string;
  [key: string]: any; // Allow for additional dynamic properties if needed
}

interface IdealWeightProps {
  profileData: ProfileData; // Use the defined ProfileData type instead of any
}

const IdealWeight: React.FC<IdealWeightProps> = ({ profileData }) => {
  const [idealWeight, setIdealWeight] = useState<number | null>(null);

  // Convert height in meters to inches (1 meter = 39.3701 inches)
  const heightInInches = profileData?.height ? profileData.height * 39.3701 : 0;

  // Memoize the calculateIdealWeight function using useCallback to ensure stable reference in useEffect dependency array
  const calculateIdealWeight = useCallback((height: number, gender: string) => {
    let idealWeightInKg: number;
    const inchesOverFiveFeet = heightInInches - 60; // Calculate height above 5 feet (60 inches)

    if (inchesOverFiveFeet < 0) {
      setIdealWeight(null); // If height is less than 5 feet, return null
      return;
    }

    // Calculate based on gender using the Miller formula
    if (gender === "male") {
      idealWeightInKg = 56.2 + 1.41 * inchesOverFiveFeet;
    } else if (gender === "female") {
      idealWeightInKg = 53.1 + 1.36 * inchesOverFiveFeet;
    } else {
      idealWeightInKg = 0; // Handle unexpected gender value
    }

    setIdealWeight(idealWeightInKg);
  }, [heightInInches]);

  useEffect(() => {
    if (profileData?.height && profileData?.gender) {
      calculateIdealWeight(profileData.height, profileData.gender);
    }
  }, [profileData, calculateIdealWeight]);

  return (
    <div className="my-4">
      {idealWeight !== null && (
        <div className="mt-4">
          <p className="text-lg">
            <span className="font-semibold">Ideal Weight:</span> {idealWeight.toFixed(2)} kg
          </p>
        </div>
      )}
    </div>
  );
};

export default IdealWeight;
