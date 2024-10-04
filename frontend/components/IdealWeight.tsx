"use client";

import React, { useState, useEffect } from "react";

interface IdealWeightProps {
  profileData: any; // Use the complete profileData object to extract height and gender
}

const IdealWeight: React.FC<IdealWeightProps> = ({ profileData }) => {
  const [idealWeight, setIdealWeight] = useState<number | null>(null);

  useEffect(() => {
    if (profileData?.height && profileData?.gender) {
      calculateIdealWeight(profileData.height, profileData.gender);
    }
  }, [profileData]);

  // Convert height in meters to inches (1 meter = 39.3701 inches)
  const heightInInches = profileData?.height ? profileData.height * 39.3701 : 0;

  // Miller Formula Calculation
  const calculateIdealWeight = (height: number, gender: string) => {
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
  };

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
