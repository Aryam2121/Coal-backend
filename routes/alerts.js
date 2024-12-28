const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');

// Define the routes for alerts
router.get('/getallalerts', alertController.getAllAlerts);
router.post('/addAlert', alertController.createAlert);

module.exports = router;
