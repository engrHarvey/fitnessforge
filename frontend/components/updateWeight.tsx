// updateWeight.tsx
"use client";

import React, { useState } from "react";
import axios from "axios";
import { convertWeightToKg, WeightUnit } from "../utils/convertWeightToKg";

interface UpdateWeightProps {
  userId: string;
  initialWeight: string;
  initialUnit: WeightUnit;
  onWeightUpdate: (newWeight: string) => void;
}

export default function UpdateWeight({ userId, initialWeight, initialUnit, onWeightUpdate }: UpdateWeightProps) {
  const [editingWeight, setEditingWeight] = useState(false); // Track whether editing weight
  const [newWeight, setNewWeight] = useState(initialWeight); // State to hold updated weight value
  const [weightUnit, setWeightUnit] = useState<WeightUnit>(initialUnit); // Track current weight unit

  // Handle unit change and weight conversion for display
  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUnit = e.target.value as WeightUnit;
    setWeightUnit(selectedUnit);

    // Convert weight to the selected unit for display purposes
    let displayedWeight = parseFloat(newWeight);
    if (selectedUnit === "kg") {
      displayedWeight = parseFloat(convertWeightToKg({ weight: newWeight, weightUnit: "lbs" }));
    } else if (selectedUnit === "lbs") {
      displayedWeight = parseFloat(newWeight) / 0.453592; // Convert kg to lbs
    }

    setNewWeight(displayedWeight.toFixed(2)); // Update displayed weight with the converted value
  };

  // Function to handle editing weight
  const handleWeightEdit = () => {
    setEditingWeight(true);
  };

  // Function to save updated weight in kilograms and create a log
  const handleSaveWeight = async () => {
    if (!newWeight) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No authentication token found. Please login.");
        return;
      }

      // Convert the new weight value to kilograms if the current unit is lbs
      const weightInKg =
        weightUnit === "lbs"
          ? convertWeightToKg({ weight: newWeight, weightUnit: "lbs" })
          : newWeight; // If kg, use the weight directly

      const config = { headers: { Authorization: `Bearer ${token}` } };

      // Update only the weight field without modifying other profile data
      await axios.put(`http://localhost:5000/api/profiles/update-weight`, { weight: weightInKg }, config);

      // Create a new log entry for the weight change
      const logData = {
        userId,
        type: 'weight',
        value: parseFloat(weightInKg), // Convert to number format for logging
      };

      await axios.post(`http://localhost:5000/api/logs/create`, logData, config);

      // Update the parent component with the new weight
      onWeightUpdate(weightInKg);
      setEditingWeight(false); // Exit edit mode after saving
      console.log('Weight log created successfully');
    } catch (err) {
      console.error("Error updating weight:", err);
    }
  };

  return (
    <div className="flex items-center justify-center space-x-4">
      <span className="font-semibold">Weight:</span>
      {editingWeight ? (
        // Input field for editing weight
        <input
          type="number"
          value={newWeight}
          onChange={(e) => setNewWeight(e.target.value)}
          className="bg-gray-700 text-white p-1 rounded border border-primary w-20 sm:w-24 focus:outline-none"
        />

      ) : (
        <span>{parseFloat(newWeight).toFixed(2)} {weightUnit}</span>
      )}

      {/* Weight unit selector */}
      <select
        value={weightUnit}
        onChange={handleUnitChange}
        className="bg-gray-700 text-white p-1 rounded border border-primary"
      >
        <option value="kg">kg</option>
        <option value="lbs">lbs</option>
      </select>

      {/* Save or Edit Button */}
      {editingWeight ? (
        <button
          onClick={handleSaveWeight}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-4 rounded-full transition duration-300 shadow-lg"
        >
          Save
        </button>
      ) : (
        <button
          onClick={handleWeightEdit}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-1 px-4 rounded-full transition duration-300 shadow-lg"
        >
          Update
        </button>
      )}
    </div>
  );
}
