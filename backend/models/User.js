const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    trim: true,
  },
  bio: {
    type: String,
    trim: true,
  },
  subscriptionPlan: {
    type: String,
    default: 'Free Startup Tier'
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
