const express = require('express');
const Restaurant = require('../models/Restaurant');

const router = express.Router();

// POST: Create a new restaurant
router.post('/', async (req, res) => {
  try {
    const restaurant = await Restaurant.create(req.body);
    res.status(201).json(restaurant);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const missingFields = Object.keys(error.errors).join(', ');
      res.status(400).json({ error: `Validation failed: ${missingFields} is/are required` });
    } else {
      res.status(500).json({ error: 'Something went wrong' });
    }
  }
});

// GET: Retrieve all restaurants
router.get('/', async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// GET: Retrieve a specific restaurant by ID
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    res.json(restaurant);
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(404).json({ error: 'Restaurant not found' });
    } else {
      res.status(500).json({ error: 'Something went wrong' });
    }
  }
});

// PUT: Update a restaurant by ID
router.put('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    res.json(restaurant);
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(404).json({ error: 'Restaurant not found' });
    } else if (error.name === 'ValidationError') {
      const missingFields = Object.keys(error.errors).join(', ');
      res.status(400).json({ error: `Validation failed: ${missingFields} is/are required` });
    } else {
      res.status(500).json({ error: 'Something went wrong' });
    }
  }
});

// DELETE: Remove a restaurant by ID
router.delete('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    res.json({ message: 'Restaurant deleted' });
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(404).json({ error: 'Restaurant not found' });
    } else {
      res.status(500).json({ error: 'Something went wrong' });
    }
  }
});

module.exports = router;