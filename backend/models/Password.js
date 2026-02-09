const mongoose = require('mongoose');

const passwordSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      default: 'anonymous'
    },
    password: {
      type: String,
      required: true
    },
    mode: {
      type: String,
      enum: ['basic', 'intermediate', 'advanced'],
      required: true
    },
    strength: {
      type: String,
      enum: ['Very Weak', 'Weak', 'Medium', 'Strong', 'Very Strong'],
      required: true
    },
    strengthScore: {
      type: Number,
      min: 0,
      max: 100,
      required: true
    },
    isGenerated: {
      type: Boolean,
      default: false
    },
    feedback: {
      type: [String],
      default: []
    },
    personalDetails: {
      firstName: {
        type: String,
        default: ''
      },
      lastName: {
        type: String,
        default: ''
      },
      birthDate: {
        type: String,
        default: ''
      }
    },
    tags: {
      type: [String],
      default: []
    },
    notes: {
      type: String,
      default: ''
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Index for faster queries
passwordSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Password', passwordSchema);
