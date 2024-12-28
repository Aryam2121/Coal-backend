const express = require('express');
const router = express.Router();
const mineController = require('../controllers/mineController');

router.get('/', mineController.getAllMines);
router.post('/', mineController.createMine);

module.exports = router;
