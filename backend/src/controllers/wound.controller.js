const { validationResult } = require('express-validator');
const Wound = require('../models/wound.model');

// Get all wounds for a patient
exports.getPatientWounds = async (req, res) => {
    try {
        const wounds = await Wound.find({ patient: req.params.patientId })
            .sort('-identifiedDate');
        res.json(wounds);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching wounds' });
    }
};

// Get single wound
exports.getWound = async (req, res) => {
    try {
        const wound = await Wound.findById(req.params.id)
            .populate('patient', 'firstName lastName');
        if (!wound) {
            return res.status(404).json({ message: 'Wound not found' });
        }
        res.json(wound);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching wound' });
    }
};

// Create wound
exports.createWound = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const wound = new Wound(req.body);
        await wound.save();
        res.status(201).json(wound);
    } catch (err) {
        res.status(400).json({ message: 'Error creating wound' });
    }
};

// Update wound
exports.updateWound = async (req, res) => {
    try {
        const wound = await Wound.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!wound) {
            return res.status(404).json({ message: 'Wound not found' });
        }
        res.json(wound);
    } catch (err) {
        res.status(400).json({ message: 'Error updating wound' });
    }
};

// Mark wound as healed
exports.healWound = async (req, res) => {
    try {
        const wound = await Wound.findByIdAndUpdate(
            req.params.id,
            {
                status: 'healed',
                healedDate: new Date(),
                active: false
            },
            { new: true }
        );
        if (!wound) {
            return res.status(404).json({ message: 'Wound not found' });
        }
        res.json(wound);
    } catch (err) {
        res.status(400).json({ message: 'Error healing wound' });
    }
};