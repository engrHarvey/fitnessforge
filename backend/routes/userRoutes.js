const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Profile = require('../models/Profile'); // Import the Profile model
const router = express.Router();

// Middleware to authenticate user by verifying JWT
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'Access Denied' });

  jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid Token' });
    req.user = user;
    next();
  });
};

// Get Current Logged In User Profile and User Info
router.get('/current', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const profile = await Profile.findOne({ userId: user._id });
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    res.json({ ...user.toObject(), profile });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// User Registration Route
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required: username, email, and password' });
    }

    // Check if the username or email already exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: 'Username or Email already exists' });
    }

    // Hash the password and create a new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    // Create a new profile with default values linked to the user
    const defaultProfile = new Profile({
      userId: newUser._id,
      fname: "First name",
      lname: "Last name",
      height: 0,
      weight: 0,
      birthdate: new Date(), // Set birthdate to current date as default
      age: 0,
      gender: "male", // Default gender value
      userImage: "", // Default empty image URL
    });
    await defaultProfile.save();

    console.log("New user and default profile created successfully:", newUser, defaultProfile);
    res.status(201).json({ message: 'User registered and profile created successfully' });
  } catch (error) {
    console.error("Error during user registration and profile creation:", error); // Log the error details
    res.status(500).json({ message: 'Server Error', error });
  }
});

// User Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

module.exports = router;
