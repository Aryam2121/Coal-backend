// routes/safetyPlans.js
const express = require('express');
const SafetyPlan = require('../models/SafetyPlan');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const newPlan = new SafetyPlan(req.body);
    await newPlan.save();
    res.status(201).json(newPlan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
