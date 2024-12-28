require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const winston = require('winston');  // For structured logging
const morgan = require('morgan');  // For HTTP request logging

// Import Routes
const alertRoutes = require('./routes/alerts');

const maintenanceRoutes = require('./routes/maintenance');
const mineRoutes = require('./routes/mines');
const CoalMineRoutes = require('./models/coalMine');
const safetyPlanRoutes = require('./models/SafetyPlan');
const shiftLogRoutes = require('./models/ShiftLog');
const app = express();

// Set up logging
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({ format: winston.format.simple() }),
    new winston.transports.File({ filename: 'server.log' })
  ]
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));  // HTTP request logger in the 'dev' format

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    logger.info("Connected to MongoDB");
  } catch (err) {
    logger.error("MongoDB connection error:", err.message);
    process.exit(1); // Exit process if MongoDB connection fails
  }
};

// Initialize MongoDB connection
connectDB();

// Routes
app.use('/api/alerts', alertRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/mines', mineRoutes);
app.use('/api/safety-plans', safetyPlanRoutes);
app.use('/api/shift-logs', shiftLogRoutes);

// Error handling middleware (404)
app.use((req, res, next) => {
  res.status(404).json({ message: "API route not found" });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`);
  res.status(500).json({ message: "Server error", error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
