const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const profileRoutes = require('./routes/profileRoutes');
const logRoutes = require('./routes/logRoutes');
const workoutRoutes = require('./routes/workoutRoutes');

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();

// CORS Configuration
const allowedOrigins = [
  'https://your-vercel-domain.vercel.app', // Replace with your Vercel frontend domain
  'http://localhost:3000' // Include localhost for testing (optional)
];

app.use(cors({
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Middleware
app.use(express.json());

// Import models
const User = require('./models/User');
const Profile = require('./models/Profile');
const Workout = require('./models/Workout');
const Log = require('./models/Log');

// Connect to MongoDB
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  }
};

// Sample route
app.get('/', (req, res) => {
  res.send('Welcome to FitnessForge API');
});

// User routes
app.use('/api/users', userRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/workouts', workoutRoutes);

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err.stack);
  res.status(500).send('Something went wrong!');
});

const PORT = process.env.PORT || 5000;
startServer();
