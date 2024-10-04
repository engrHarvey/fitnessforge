const mongoose = require('mongoose');
const { Schema } = mongoose;

const profileSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Replace with userId
  fname: { type: String, required: true },
  lname: { type: String, required: true },
  height: { type: Number, required: true },
  weight: { type: Number, required: true },
  birthdate: { type: Date, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['male', 'female'], required: true },
  userImage: { type: String },
});

module.exports = mongoose.model('Profile', profileSchema);
