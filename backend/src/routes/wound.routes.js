const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { body } = require('express-validator');
const woundController = require('../controllers/wound.controller');

// Get all wounds for a patient
router.get('/patient/:patientId', auth, woundController.getPatientWounds);

// Get single wound
router.get('/:id', auth, woundController.getWound);

// Create wound
router.post('/', [
  auth,
  body('patient').isMongoId(),
  body('location').notEmpty(),
  body('type').isIn([
    'pressure_ulcer',
    'diabetic_ulcer',
    'venous_ulcer',
    'arterial_ulcer',
    'surgical_wound',
    'traumatic_wound',
    'other'
  ]),
  body('identifiedDate').isDate()
], woundController.createWound);

// Update wound
router.put('/:id', auth, woundController.updateWound);

// Mark wound as healed
router.patch('/:id/heal', auth, woundController.healWound);

module.exports = router;