const ExecutiveDashboardMetrics = require('../models/executive_dashboard_metrics.model');
const ProviderUtilization = require('../models/provider_utilization.model');
const ROITracking = require('../models/roi_tracking.model');

// Get executive dashboard metrics
exports.getExecutiveDashboardMetrics = async (req, res) => {
    try {
        const metrics = await ExecutiveDashboardMetrics.findOne()
            .sort('-metricDate')
            .limit(1);
        res.json(metrics);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching metrics' });
    }
};

// Get provider utilization
exports.getProviderUtilization = async (req, res) => {
    try {
        const utilization = await ProviderUtilization.find()
            .populate('providerId', 'firstName lastName')
            .sort('-date')
            .limit(30);
        res.json(utilization);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching utilization data' });
    }
};

// Get ROI tracking
exports.getROITracking = async (req, res) => {
    try {
        const roi = await ROITracking.find()
            .populate('companyId')
            .populate('locationId')
            .sort('-dateRangeEnd')
            .limit(12);
        res.json(roi);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching ROI data' });
    }
};