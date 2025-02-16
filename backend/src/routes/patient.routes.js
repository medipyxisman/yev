const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { body } = require('express-validator');
const patientController = require('../controllers/patient.controller');

// Get all patients
router.get('/', auth, patientController.getAllPatients);

// Get single patient
router.get('/:id', auth, patientController.getPatient);

// Create patient
router.post('/', [
  auth,
  body('firstName').notEmpty(),
  body('lastName').notEmpty(),
  body('dateOfBirth').isDate(),
  body('gender').isIn(['male', 'female', 'other'])
], patientController.createPatient);

// Update patient
router.put('/:id', auth, patientController.updatePatient);

// Archive patient
router.patch('/:id/archive', auth, patientController.archivePatient);

module.exports = router;