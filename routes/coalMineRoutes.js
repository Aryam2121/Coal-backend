const express = require('express');
const { getCoalMines, createCoalMine } = require('../controllers/coalMineController');
const router = express.Router();

// Get all coal mines
router.get('/', getCoalMines);

// Add a new coal mine
router.post('/', createCoalMine);

module.exports = router;
