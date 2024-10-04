const express = require('express');
const router = express.Router();
const Workout = require('../models/Workout');

// Correct endpoint should match `/api/workouts`
router.post('/', async (req, res) => {
  try {
    const { userId, typeOfWorkout, muscle } = req.body;

    if (!userId || !typeOfWorkout || !muscle) {
      return res.status(400).json({ message: "Missing required fields: userId, typeOfWorkout, or muscle." });
    }

    const newWorkout = new Workout({
      userId,
      typeOfWorkout,
      muscle,
      dateTime: new Date(),
    });

    const savedWorkout = await newWorkout.save();
    res.status(201).json(savedWorkout);
  } catch (error) {
    console.error("Error creating workout log:", error);
    res.status(500).json({ message: "Failed to create workout log.", error });
  }
});

// Get all workouts for a specific user
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(`Fetching workouts for user ID: ${userId}`);

    if (!userId) {
      return res.status(400).json({ message: "User ID is missing in request parameters." });
    }

    // Fetch workouts from the database
    const workouts = await Workout.find({ userId });

    if (workouts.length === 0) {
      console.log(`No workouts found for user ID: ${userId}`);
      return res.status(404).json({ message: "No workouts found for this user." });
    }

    console.log(`Workouts retrieved for user ID: ${userId}`, workouts);
    res.status(200).json(workouts);
  } catch (error) {
    console.error("Error fetching workouts:", error);
    res.status(500).json({ message: "Failed to fetch workouts.", error });
  }
});

module.exports = router;
