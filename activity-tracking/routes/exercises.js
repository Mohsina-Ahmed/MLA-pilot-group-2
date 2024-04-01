const express = require('express');
const router = express.Router();
const Exercise = require('../models/exercise.model');


// GET: Retrieve all exercises
router.get('/', async (req, res) => {
    try {
      const exercises = await Exercise.find();
      res.json(exercises);
    } catch (error) {
      res.status(400).json({ error: 'Error: ' + error.message });
    }
  });
  
// POST: Add a new exercise
router.post('/add', async (req, res) => {
  console.log(req.body)
  try {
    const { username, exerciseType, description, duration, distance, speed, pace, sets, reps, date, intensity, calories, mood } = req.body;

    const newExercise = new Exercise({
      username,
      exerciseType,
      description,
      duration: Number(duration),
      distance: Number(distance),
      speed: Number(speed),
      pace: Number(pace),
      sets: Number(sets),
      reps: Number(reps),
      date: Date.parse(date),
      intensity: Number(intensity), // Perceived effort of activity - used for calorie calculation, as MET (metabolic exertion of task).
      calories: Number(calories),
      mood
    });

    await newExercise.save();
    res.json({ message: 'Exercise added!' });
  } catch (error) {
    res.status(400).json({ error: 'Error: ' + error.message });
  }
});

// GET: Retrieve an exercise by ID
router.get('/:id', async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) {
      res.status(404).json({ error: 'Exercise not found' });
      return;
    }
    res.json(exercise);
  } catch (error) {
    res.status(400).json({ error: 'Error: ' + error.message });
  }
});

// DELETE: Delete an exercise by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedExercise = await Exercise.findByIdAndDelete(req.params.id);
    if (!deletedExercise) {
      res.status(404).json({ error: 'Exercise not found' });
      return;
    }
    res.json({ message: 'Exercise deleted.' });
  } catch (error) {
    res.status(400).json({ error: 'Error: ' + error.message });
  }
});

// PUT: Update an exercise by ID
router.put('/update/:id', async (req, res) => {
    try {
      const { username, description, duration, distance, speed, pace, sets, reps, date, intensity, calories, mood } = req.body;
  
      if (!username || !description || !duration || !date || !mood) {
        res.status(400).json({ error: 'All fields are required' });
        return;
      }
  
      const exercise = await Exercise.findById(req.params.id);
      if (!exercise) {
        res.status(404).json({ error: 'Exercise not found' });
        return;
      }
  
      exercise.username = username;
      exercise.exerciseType = exerciseType;
      exercise.description = description;
      exercise.duration = Number(duration);
      exercise.distance = Number(distance);
      exercise.speed = Number(speed);
      exercise.pace = Number(pace);
      exercise.sets = Number(sets);
      exercise.reps = Number(reps);
      exercise.date = new Date(date);
      exercise.intensity = Number(intensity);
      exercise.calories = Number(calories);
      exercise.mood = mood;
  
      await exercise.save();
      res.json({ message: 'Exercise updated!', exercise });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while updating the exercise' });
    }
  });
  
  module.exports = router;