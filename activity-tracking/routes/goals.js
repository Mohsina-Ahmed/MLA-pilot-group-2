const express = require('express');
const router = express.Router();
const Goal = require('../models/goal.model');

// GET: Retrieve weekly goal
router.get('/:username', async (req, res) => {
    try {
      console.log("Fetching user goal...")
      const goal = await Goal.findOne({username: req.params.username});
      res.json(goal);
    } catch (error) {
      res.status(400).json({ error: 'Error: ' + error.message });
    }
  });
  
// POST: Add a goal
router.post('/add', async (req, res) => {
  console.log(req.body)
  try {

    const { username, exerciseType, goalType, goalUnit, goalValue, caloriesGoal, goalAim } = req.body;

    const newGoal = new Goal({
      username,
      exerciseType,
      goalType,
      goalUnit,
      goalValue: Number(goalValue),
      caloriesGoal: Number(caloriesGoal),
      goalAim
    });

    await newGoal.save();
    res.json({ message: 'New goal saved!' });
  } catch (error) {
    res.status(400).json({ error: 'Error: ' + error.message });
  }
});

// PUT: Update the user's goal by username (User should only have one goal)
router.put('/update/:username', async (req, res) => {
    try {
      const { username, exerciseType, goalType, goalUnit, goalValue, caloriesGoal, goalAim } = req.body;
  
      if (!username || !exerciseType || !goalType || !goalUnit || !goalValue || !caloriesGoal || !goalAim ) {
        res.status(400).json({ error: 'All fields are required' });
        return;
      }
  
      const goal = await Goal.findOne({username: req.params.username});
      if (!goal) {
        res.status(404).json({ error: 'User has not set a goal.' });
        return;
      }
  
      goal.username = username;
      goal.exerciseType = exerciseType;
      goal.goalType = goalType;
      goal.goalUnit = goalUnit;
      goal.goalValue = Number(goalValue);
      goal.caloriesGoal = Number(caloriesGoal);
      goal.goalAim = goalAim;
  
      await goal.save();
      res.json({ message: 'Goal updated!', goal });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while updating the goal' });
    }
  });
  
  module.exports = router;