const Alert = require('../models/Alert');

// Fetch all alerts with filtering, sorting, and pagination
exports.getAllAlerts = async (req, res) => {
  try {
    const { type, resolved, page = 1, limit = 10, sort = '-timestamp' } = req.query;

    // Query filters
    const query = {};
    if (type) query.type = type;
    if (resolved !== undefined) query.resolved = resolved === 'true';

    // Pagination options
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort,
    };

    const alerts = await Alert.find(query)
      .sort(options.sort)
      .skip((options.page - 1) * options.limit)
      .limit(options.limit);

    const totalAlerts = await Alert.countDocuments(query);

    res.json({
      alerts,
      total: totalAlerts,
      currentPage: options.page,
      totalPages: Math.ceil(totalAlerts / options.limit),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching alerts', error: error.message });
  }
};

// Create a new alert
exports.createAlert = async (req, res) => {
  try {
    const { message, type, createdBy } = req.body;

    // Validation
    if (!message || !type) {
      return res.status(400).json({ message: 'Message and type are required' });
    }

    if (!['warning', 'critical'].includes(type)) {
      return res.status(400).json({ message: 'Invalid alert type' });
    }

    const alert = new Alert({ message, type, createdBy });
    await alert.save();

    res.status(201).json(alert);
  } catch (error) {
    res.status(500).json({ message: 'Error creating alert', error: error.message });
  }
};

// Mark an alert as resolved
exports.resolveAlert = async (req, res) => {
  try {
    const { id } = req.params;
    const { resolvedBy } = req.body;

    const alert = await Alert.findById(id);
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    alert.resolve(resolvedBy);
    await alert.save();

    res.json({ message: 'Alert resolved successfully', alert });
  } catch (error) {
    res.status(500).json({ message: 'Error resolving alert', error: error.message });
  }
};

// Delete an alert
exports.deleteAlert = async (req, res) => {
  try {
    const { id } = req.params;

    const alert = await Alert.findByIdAndDelete(id);
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    res.json({ message: 'Alert deleted successfully', alert });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting alert', error: error.message });
  }
};
