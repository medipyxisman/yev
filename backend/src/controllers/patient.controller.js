const { validationResult } = require('express-validator');
const Patient = require('../models/patient.model');

// Get all patients
exports.getAllPatients = async (req, res) => {
    try {
        const patients = await Patient.find()
            .populate('assignedProvider', 'firstName lastName')
            .sort({ lastName: 1, firstName: 1 });
        res.json(patients);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching patients' });
    }
};

// Get single patient
exports.getPatient = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id)
            .populate('assignedProvider', 'firstName lastName');
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.json(patient);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching patient' });
    }
};

// Create patient
exports.createPatient = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const patient = new Patient(req.body);
        await patient.save();
        res.status(201).json(patient);
    } catch (err) {
        res.status(400).json({ message: 'Error creating patient' });
    }
};

// Update patient
exports.updatePatient = async (req, res) => {
    try {
        const patient = await Patient.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.json(patient);
    } catch (err) {
        res.status(400).json({ message: 'Error updating patient' });
    }
};

// Archive patient
exports.archivePatient = async (req, res) => {
    try {
        const patient = await Patient.findByIdAndUpdate(
            req.params.id,
            { status: 'archived' },
            { new: true }
        );
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.json(patient);
    } catch (err) {
        res.status(400).json({ message: 'Error archiving patient' });
    }
};