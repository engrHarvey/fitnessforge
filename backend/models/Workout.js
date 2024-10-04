const mongoose = require('mongoose');
const { Schema } = mongoose;

const workoutSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Replace with userId
  typeOfWorkout: { type: String, required: true },
  muscle: { type: String, required: true },
  dateTime: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Workout', workoutSchema);
