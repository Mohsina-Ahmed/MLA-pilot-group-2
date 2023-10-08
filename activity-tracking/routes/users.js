const express = require('express');
const router = express.Router();
const User = require('../models/user.model');

// Middleware to parse the request body
router.use(express.json());

router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// Add a new user
router.post('/add', async (req, res) => {
  console.log(req.body);  // Log the request body

  try {
    const { username } = req.body;

    // Handle if username is not provided
    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    const newUser = new User({ username });
    await newUser.save();
    res.json({ message: 'User added successfully' });
  } catch (error) {
    console.error(error);
    res.status(422).json({ error: error.message });
  }
});

// GET: Retrieve a user by ID
router.get('/:id', async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: 'Error: ' + error.message });
    }
  });

// DELETE: Delete a user by ID
router.delete('/:id', async (req, res) => {
    try {
      const deletedUser = await User.findByIdAndDelete(req.params.id);
      if (!deletedUser) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      res.json({ message: 'User deleted.' });
    } catch (error) {
      res.status(400).json({ error: 'Error: ' + error.message });
    }
  });

module.exports = router;
