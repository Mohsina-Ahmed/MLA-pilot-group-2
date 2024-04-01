const mongoose = require('mongoose');
const { Schema } = mongoose;

const maxDate = new Date();
maxDate.setDate(maxDate.getDate() + 1);

const exerciseSchema = new Schema(
  {
    username: { type: String, required: true },
    exerciseType: {
      type: String,
      required: true
    },
    description: { type: String, required: false },
    duration: { 
        type: Number, 
        required: true,
        validate: {
            validator: Number.isInteger,
            message: 'Duration should be an integer.'
        },
        min: [1, 'Duration should be positive.']
    },
    distance: { 
      type: Number, 
      required: false,
      min: [0, 'Distance should be positive.']
    },
    speed: { 
      type: Number, 
      required: false,
      min: [0, 'Speed should be positive.']
    },
    pace: { 
      type: Number, 
      required: false,
      min: [0, 'Pace should be positive.']
    },
    sets: { 
      type: Number, 
      required: false,
      min: [0, 'Sets should be positive.']
    },
    reps: { 
      type: Number, 
      required: false,
      min: [0, 'Reps should be positive.']
    },
    date: { 
      type: Date, 
      required: true,
      max: [maxDate, 'Cannot track exercises in the future.'] 
    },
    intensity: {
      type: Number,
      required: false,
      min: [1, 'Intensity should be positive.']
    },
    calories: {
      type: Number,
      required: false,
      min: [0, 'Calories should be positive.']
    },
    mood: {
      type: String,
      required: true,
      enum: ['Happy', 'Neutral', 'Difficult', 'Painful', 'Tiring']
    },
  },
  { timestamps: true }
);

const Exercise = mongoose.model('Exercise', exerciseSchema);

module.exports = Exercise;
