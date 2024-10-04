const express = require('express');
const multer = require('multer');
const jwt = require('jsonwebtoken'); // Import jwt for authentication
const bucket = require('../config/gcsConfig');

const Profile = require('../models/Profile');
const User = require('../models/User');
const Log = require('../models/Log'); // Import the Log model
const router = express.Router();

// Set up multer for file handling
const upload = multer({
  storage: multer.memoryStorage(),
});

// Middleware to authenticate user and extract userId
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'Access Denied' });

  jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid Token' });
    req.user = user; // Attach the authenticated user to the request object
    next();
  });
};

// Function to handle image upload to Google Cloud Storage
const uploadImageToGCS = (file) => {
  return new Promise((resolve, reject) => {
    const blob = bucket.file(`profileImages/${file.originalname}`);
    const blobStream = blob.createWriteStream();

    blobStream.on('error', (err) => {
      console.error('Blob upload error:', err);
      reject(err);
    });

    blobStream.on('finish', () => {
      // Construct the public URL of the image
      const publicUrl = `https://storage.cloud.google.com/${bucket.name}/${blob.name}`;
      resolve(publicUrl);
    });

    blobStream.end(file.buffer);
  });
};

// Create or Update Profile and Create Log if Weight Data is Present
router.post('/create', authenticateToken, upload.single('profilePhoto'), async (req, res) => {
  const { fname, lname, height, weight, birthdate, gender } = req.body; // Removed username
  try {
    const userId = req.user.id; // Get the userId from the authenticated user
    
    // Validate that a user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const age = calculateAge(birthdate);
    let userImageUrl = null;

    // If an image file is uploaded, upload it to Google Cloud Storage
    if (req.file) {
      try {
        userImageUrl = await uploadImageToGCS(req.file);
      } catch (error) {
        return res.status(500).json({ message: 'Image upload failed', error });
      }
    }

    // Create or update profile
    const profileData = {
      userId: user._id, // Reference user by ID
      fname,
      lname,
      height: height || "", // Set default values if empty
      weight: weight || "",
      birthdate,
      age,
      gender,
      userImage: userImageUrl,
    };

    // Save or update the profile
    const profile = await Profile.findOneAndUpdate(
      { userId: user._id },
      profileData,
      { new: true, upsert: true }
    );

    // If the weight is provided, create a weight log entry
    if (weight) {
      const weightLog = new Log({
        userId: user._id,
        type: 'weight',
        value: parseFloat(weight), // Ensure value is a number
      });
      await weightLog.save();
      console.log('Weight log created successfully.');
    }

    res.status(201).json({ message: 'Profile created or updated successfully', profile });
  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ message: 'Server Error', error });
  }
});

// Update only the weight field in the profile
router.put('/update-weight', authenticateToken, async (req, res) => {
  const { weight } = req.body;
  try {
    const userId = req.user.id;

    // Find the profile and update only the weight field
    const profile = await Profile.findOneAndUpdate(
      { userId },
      { weight: parseFloat(weight) }, // Ensure the value is a number
      { new: true }
    );

    res.status(200).json({ message: 'Weight updated successfully', profile });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// Helper function to calculate age from birthdate
const calculateAge = (birthdate) => {
  const birthDateObj = new Date(birthdate);
  const diff = Date.now() - birthDateObj.getTime();
  return Math.abs(new Date(diff).getUTCFullYear() - 1970);
};

// Get Profile by User ID
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const profile = await Profile.findOne({ userId: user._id });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

module.exports = router;
