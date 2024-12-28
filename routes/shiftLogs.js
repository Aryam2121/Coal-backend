// routes/shiftLogs.js
const express = require('express');
const ShiftLog = require('../models/ShiftLog');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const newLog = new ShiftLog(req.body);
    await newLog.save();
    res.status(201).json(newLog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
