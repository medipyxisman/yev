const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const metricsController = require('../controllers/metrics.controller');

// Get executive dashboard metrics
router.get('/executive-dashboard', auth, metricsController.getExecutiveDashboardMetrics);

// Get provider utilization
router.get('/provider-utilization', auth, metricsController.getProviderUtilization);

// Get ROI tracking
router.get('/roi-tracking', auth, metricsController.getROITracking);

module.exports = router;