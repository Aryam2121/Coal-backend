const mongoose = require('mongoose');

// Alert Schema
const alertSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
      trim: true,
    },
    type: {
      type: String,
      enum: ['warning', 'critical'],
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true, // Add index for optimized queries
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    resolved: {
      type: Boolean,
      default: false,
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

// Virtual field for formatted timestamp
alertSchema.virtual('formattedTimestamp').get(function () {
  return this.timestamp.toLocaleString();
});

// Pre-save hook
alertSchema.pre('save', function (next) {
  if (this.isNew) {
    console.log(`New alert created: ${this.message}`);
  }
  next();
});

// Custom method to resolve an alert
alertSchema.methods.resolve = function (userId) {
  this.resolved = true;
  this.resolvedBy = userId;
  this.resolvedAt = new Date();
  return this.save();
};

// Static method to get unresolved alerts
alertSchema.statics.getUnresolvedAlerts = function () {
  return this.find({ resolved: false });
};

// Model
const Alert = mongoose.model('Alert', alertSchema);

module.exports = Alert;
