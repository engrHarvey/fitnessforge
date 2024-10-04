const mongoose = require('mongoose');
const { Schema } = mongoose;

const logSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  type: { type: String, enum: ['bmi', 'weight'], required: true },
  dateTime: { type: Date, default: Date.now },
  value: { type: Number, required: true },
}, { timestamps: true }); // Add timestamps option to auto-manage createdAt/updatedAt fields

module.exports = mongoose.model('Log', logSchema);
