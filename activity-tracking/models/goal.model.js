const mongoose = require('mongoose');
const { Schema } = mongoose;

const goalSchema = new Schema(
  {
    username: { type: String, required: true },
    exerciseType: {
      type: String,
      required: true,
      enum: ['Running', 'Cycling', 'Swimming', 'Gym', 'Rowing', 'Football', 'Skiing', 'Horse Riding', 'Surfing', 'Golf', 'Climbing','Other']
    },
    goalType: {
        type: String,
        required: true,
        enum: ['Duration', 'Distance', 'Sets']
    },
    goalUnit: {
        type: String,
        required: true,
        enum: ['hours', 'kilometers', 'number of']
    },
    goalValue: { 
        type: Number, 
        required: true,
        min: [0, 'Goal should be positive.']
    },
    caloriesGoal: {
      type: Number,
      required: true,
      min: [0, 'Goal should be positive.']
    },
    goalAim: {
      type: String,
      required: true,
      enum: ['Fitness', 'Weight loss', 'Weight gain', 'Flexibility', 'Mobility', 'Body toning']
    }
  },
    { methods: {
    setGoal() {
        if (goalType === 'Duration') {
            goalUnit = 'hours';
        } else if (goalType === 'Distance') {
            goalUnit = 'kilometers';
        } else if (goalType === 'Sets') {
            goalUnit = 'number of';
        }
        return goalUnit;
    }}
    },
  { timestamps: true }
);

const Goal = mongoose.model('Goal', goalSchema);

module.exports = Goal;
