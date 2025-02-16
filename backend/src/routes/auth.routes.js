const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/register',
  [
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('firstName').notEmpty(),
    body('lastName').notEmpty()
  ],
  authController.register
);

router.post('/login',
  [
    body('email').isEmail(),
    body('password').exists()
  ],
  authController.login
);

router.get('/me', auth, authController.getProfile);

module.exports = router;