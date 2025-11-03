const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  userType: {
    type: String,
    enum: ['developer', 'client'],
    required: true
  },
  avatar: {
    type: String,
    default: null
  },
  bio: {
    type: String,
    maxlength: 500
  },
  location: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  website: {
    type: String
  },
  // Developer specific fields
  skills: [{
    type: String,
    trim: true
  }],
  experience: {
    type: Number,
    min: 0
  },
  hourlyRate: {
    type: Number,
    min: 0
  },
  availability: {
    type: String,
    enum: ['available', 'busy', 'unavailable'],
    default: 'available'
  },
  portfolio: {
    type: String
  },
  github: {
    type: String
  },
  linkedin: {
    type: String
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  completedProjects: {
    type: Number,
    default: 0
  },
  // Client specific fields
  organization: {
    type: String
  },
  organizationType: {
    type: String,
    enum: ['ngo', 'sme', 'startup', 'enterprise', 'other']
  },
  // Common fields
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for better query performance (email index is automatically created by unique: true)
userSchema.index({ userType: 1 });
userSchema.index({ location: 1 });
userSchema.index({ skills: 1 });
userSchema.index({ rating: -1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return this.name;
});

// Method to get public profile
userSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.__v;
  return userObject;
};

// Method to update rating
userSchema.methods.updateRating = function(newRating) {
  // Simple average calculation - in production, you might want more sophisticated rating system
  const totalRatings = this.completedProjects;
  const currentTotal = this.rating * totalRatings;
  this.rating = (currentTotal + newRating) / (totalRatings + 1);
  this.completedProjects += 1;
  return this.save();
};

module.exports = mongoose.model('User', userSchema);
