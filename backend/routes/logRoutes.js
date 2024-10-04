const express = require('express');
const router = express.Router();
const Log = require('../models/Log'); // Import Log model

// Route to create a new log entry
router.post('/create', async (req, res) => {
  const { userId, type, value } = req.body;

  try {
    const newLog = new Log({
      userId,
      type,
      value,
    });

    await newLog.save();
    res.status(201).json({ message: 'Log created successfully', log: newLog });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// Route to get BMI logs for a specific user
router.get('/user/:userId/bmi', async (req, res) => {
  const { userId } = req.params;

  try {
    // Find BMI logs for the specified user
    const bmiLogs = await Log.find({ userId, type: 'bmi' }).sort({ dateTime: -1 }).limit(1);

    if (bmiLogs.length === 0) {
      return res.status(404).json({ message: 'No BMI logs found for this user.' });
    }

    res.status(200).json(bmiLogs);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// Route to get Weight logs for a specific user
router.get('/user/:userId/weight', async (req, res) => {
  const { userId } = req.params;

  try {
    // Find Weight logs for the specified user
    const weightLogs = await Log.find({ userId, type: 'weight' }).sort({ dateTime: -1 });

    if (weightLogs.length === 0) {
      return res.status(404).json({ message: 'No weight logs found for this user.' });
    }

    res.status(200).json(weightLogs);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

module.exports = router;
