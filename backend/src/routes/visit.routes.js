const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { body } = require('express-validator');
const visitController = require('../controllers/visit.controller');

// Get all visits for a wound
router.get('/wound/:woundId', auth, visitController.getWoundVisits);

// Get single visit
router.get('/:id', auth, visitController.getVisit);

// Create visit
router.post('/', [
  auth,
  body('wound').isMongoId(),
  body('provider').isMongoId(),
  body('date').isDate(),
  body('measurements').isObject(),
  body('assessment').isObject(),
  body('treatment').isObject()
], visitController.createVisit);

// Update visit
router.put('/:id', auth, visitController.updateVisit);

// Add images to visit
router.post('/:id/images', auth, visitController.addVisitImages);

module.exports = router;