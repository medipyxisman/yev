const { validationResult } = require('express-validator');
const Visit = require('../models/visit.model');
const WoundMeasurementHistory = require('../models/wound_measurement_history.model');

// Get all visits for a wound
exports.getWoundVisits = async (req, res) => {
    try {
        const visits = await Visit.find({ wound: req.params.woundId })
            .populate('provider', 'firstName lastName')
            .sort('-date');
        res.json(visits);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching visits' });
    }
};

// Get single visit
exports.getVisit = async (req, res) => {
    try {
        const visit = await Visit.findById(req.params.id)
            .populate('provider', 'firstName lastName')
            .populate('wound');
        if (!visit) {
            return res.status(404).json({ message: 'Visit not found' });
        }
        res.json(visit);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching visit' });
    }
};

// Create visit
exports.createVisit = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const visit = new Visit({
            ...req.body,
            provider: req.user.userId
        });
        await visit.save();

        // Update wound measurements history
        const measurementHistory = new WoundMeasurementHistory({
            woundVisitId: visit._id,
            measurementType: 'Length',
            valueCm: visit.measurements.length,
            measurementMethod: 'Manual',
            measuredBy: req.user.userId,
            measuredAt: visit.date
        });
        await measurementHistory.save();

        res.status(201).json(visit);
    } catch (err) {
        res.status(400).json({ message: 'Error creating visit' });
    }
};

// Update visit
exports.updateVisit = async (req, res) => {
    try {
        const visit = await Visit.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!visit) {
            return res.status(404).json({ message: 'Visit not found' });
        }
        res.json(visit);
    } catch (err) {
        res.status(400).json({ message: 'Error updating visit' });
    }
};

// Add images to visit
exports.addVisitImages = async (req, res) => {
    try {
        const visit = await Visit.findById(req.params.id);
        if (!visit) {
            return res.status(404).json({ message: 'Visit not found' });
        }

        visit.images.push({
            ...req.body,
            uploadedAt: new Date()
        });

        await visit.save();
        res.json(visit);
    } catch (err) {
        res.status(400).json({ message: 'Error adding images' });
    }
};