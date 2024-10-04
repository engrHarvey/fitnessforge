"use client";

import React, { useState } from "react";
import moment from "moment";
import Modal from "./Modal"; // Import the Modal component
import WorkoutLogs from "./WorkoutLogs"; // Import the WorkoutLogs component

// Define the type for the workout data
type Workout = {
  _id: string;
  userId: string;
  typeOfWorkout: string;
  muscle: string;
  dateTime: string;
};

// Define the prop types for the WorkoutCalendar component
type WorkoutCalendarProps = {
  workouts: Workout[]; // Workouts passed from the parent component
};

// Define a color mapping for each workout type
const workoutTypeColors: Record<string, string> = {
  cardio: "#FF5733", // Orange Red
  olympic_weightlifting: "#33FF57", // Lime Green
  plyometrics: "#5733FF", // Blue Purple
  powerlifting: "#33FFF6", // Cyan
  strength: "#FF3333", // Red
  stretching: "#FFC300", // Gold
  strongman: "#FF8F33", // Light Orange
};

// Special color for days with multiple workout types
const multipleTypesColor = "#FFD700"; // Gold

const WorkoutCalendar: React.FC<WorkoutCalendarProps> = ({ workouts }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDayWorkouts, setSelectedDayWorkouts] = useState<Workout[]>([]); // Store selected day's workouts
  const [showModal, setShowModal] = useState(false); // Modal visibility state

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const currentMonthYear = moment(new Date(currentYear, currentMonth)).format("MMMM YYYY");

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

  const firstDayOfCalendar = new Date(
    firstDayOfMonth.setDate(firstDayOfMonth.getDate() - firstDayOfMonth.getDay())
  );
  const lastDayOfCalendar = new Date(
    lastDayOfMonth.setDate(lastDayOfMonth.getDate() + (6 - lastDayOfMonth.getDay()))
  );

  // Handle month navigation
  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Handle day click to view workouts
  const handleDayClick = (dayWorkouts: Workout[]) => {
    setSelectedDayWorkouts(dayWorkouts); // Set the workouts for the selected day
    setShowModal(true); // Show the modal dialog
  };

  // Generate the grid cells for the calendar
  const generateCalendarGrid = () => {
    const grid = [];
    let currentDay = new Date(firstDayOfCalendar);
    while (currentDay <= lastDayOfCalendar) {
      const day = new Date(currentDay);

      // Find workouts for this particular day
      const dayWorkouts = workouts.filter(
        (workout) => moment(workout.dateTime).format("YYYY-MM-DD") === moment(day).format("YYYY-MM-DD")
      );

      // Determine the type of workouts for the day
      const workoutTypes = [...new Set(dayWorkouts.map((workout) => workout.typeOfWorkout))];
      
      // Determine the color for the day
      let dayColor = "#333"; // Default dark color for no workouts
      if (workoutTypes.length === 1) {
        // Single workout type
        dayColor = workoutTypeColors[workoutTypes[0].toLowerCase()] || dayColor;
      } else if (workoutTypes.length > 1) {
        // Multiple workout types
        dayColor = multipleTypesColor;
      }

      grid.push({ date: day, workouts: dayWorkouts, dayColor });
      currentDay = new Date(currentDay.setDate(currentDay.getDate() + 1));
    }
    return grid;
  };

  const calendarGrid = generateCalendarGrid();

  return (
    <div className="bg-dark bg-opacity-60 p-3 sm:p-6 lg:p-12 rounded-3xl shadow-2xl w-full max-w-full md:max-w-4xl lg:max-w-6xl border border-secondary backdrop-blur-md">
      <div className="flex items-center justify-center mb-4 sm:mb-8">
        <button
          onClick={handlePreviousMonth}
          className="px-2 py-1 sm:px-4 sm:py-2 bg-primary text-white rounded-lg hover:bg-orange-500 transition duration-300 mx-1 sm:mx-4"
        >
          {"<"}
        </button>
        <div className="text-center text-primary text-xl sm:text-3xl md:text-4xl font-bold mx-2 sm:mx-8">
          {currentMonthYear}
        </div>
        <button
          onClick={handleNextMonth}
          className="px-2 py-1 sm:px-4 sm:py-2 bg-primary text-white rounded-lg hover:bg-orange-500 transition duration-300 mx-1 sm:mx-4"
        >
          {">"}
        </button>
      </div>
  
      {workouts.length === 0 && (
        <div className="text-center text-sm sm:text-lg text-gray-400 mb-4">No workout data yet</div>
      )}
  
      <div className="grid grid-cols-7 sm:grid-cols-7 gap-2 sm:gap-4 text-center text-white">
        {daysOfWeek.map((day) => (
          <div key={day} className="font-bold text-xs sm:text-lg text-gray-300">
            {day}
          </div>
        ))}
  
        {calendarGrid.map((day, index) => (
          <div
            key={index}
            className={`p-2 sm:p-3 rounded-lg shadow-lg text-xs sm:text-base font-semibold cursor-pointer transition duration-300
              hover:shadow-xl hover:scale-105`}
            style={{ backgroundColor: day.dayColor }}
            onClick={() => handleDayClick(day.workouts)}
          >
            <div className="font-bold">{day.date.getDate()}</div>
            {day.workouts.length > 0 && (
              <div className="mt-1 sm:mt-2 text-[8px] sm:text-xs text-yellow-400 truncate">
                {day.workouts.length} {day.workouts.length > 1 ? "Workouts" : "Workout"}
              </div>
            )}
          </div>
        ))}
      </div>
  
      <Modal show={showModal} onClose={() => setShowModal(false)} title="Workout Logs">
        <WorkoutLogs workouts={selectedDayWorkouts} />
      </Modal>
    </div>
  );
  
};

export default WorkoutCalendar;
