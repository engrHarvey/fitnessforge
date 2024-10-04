import React from "react";
import moment from "moment";

// Define the type for the workout data
type Workout = {
  _id: string;
  userId: string;
  typeOfWorkout: string;
  muscle: string;
  dateTime: string;
};

type WorkoutLogsProps = {
  workouts: Workout[];
};

// Define a color mapping for each muscle group
const muscleColors: Record<string, string> = {
  abdominals: "#FF5733", // Orange Red
  abductors: "#33FF57", // Lime Green
  adductors: "#5733FF", // Blue Purple
  biceps: "#33FFF6", // Cyan
  calves: "#FFC300", // Gold
  chest: "#FF3333", // Red
  forearms: "#33FF8F", // Mint Green
  glutes: "#FF33A1", // Hot Pink
  hamstrings: "#338FFF", // Light Blue
  lats: "#FF8F33", // Light Orange
  lower_back: "#FF5733", // Light Red
  middle_back: "#33FFD1", // Aqua
  neck: "#33A1FF", // Sky Blue
  quadriceps: "#F833FF", // Magenta
  traps: "#8F33FF", // Purple
  triceps: "#FF3365", // Coral Red
};

const WorkoutLogs: React.FC<WorkoutLogsProps> = ({ workouts }) => {
  if (workouts.length === 0) {
    return <div className="text-center text-lg text-gray-400">No workouts for this day.</div>;
  }

  return (
    <div className="space-y-4">
      {workouts.map((workout) => (
        <div key={workout._id} className="bg-secondary p-4 rounded shadow-md">
          <h3 className="text-xl font-bold text-primary">{workout.typeOfWorkout}</h3>
          <p className="text-sm text-gray-300">
            Muscle Group:{" "}
            <span
              className="font-bold"
              style={{ color: muscleColors[workout.muscle.toLowerCase()] || "#ffffff" }} // Set the text color for the muscle group
            >
              {workout.muscle}
            </span>
          </p>
          <p className="text-sm text-gray-300">
            Date: <span className="text-white">{moment(workout.dateTime).format("MMMM Do, YYYY, h:mm A")}</span>
          </p>
        </div>
      ))}
    </div>
  );
};

export default WorkoutLogs;
