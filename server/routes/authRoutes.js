const express = require('express');
const { body } = require('express-validator');
const { register, login, getProfile, updateProfile, logout, changePassword } = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

// Validation rules
const registerValidation = [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('userType').isIn(['developer', 'client']).withMessage('User type must be either developer or client'),
  body('location').trim().isLength({ min: 2 }).withMessage('Location is required'),
  body('skills').optional().isArray().withMessage('Skills must be an array'),
  body('hourlyRate').optional().isNumeric().withMessage('Hourly rate must be a number'),
  body('experience').optional().isInt({ min: 0 }).withMessage('Experience must be a non-negative integer'),
  body('organization').optional().trim().isLength({ min: 2 }).withMessage('Organization name must be at least 2 characters')
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

const updateProfileValidation = [
  body('name').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('bio').optional().isLength({ max: 500 }).withMessage('Bio must not exceed 500 characters'),
  body('location').optional().trim().isLength({ min: 2 }).withMessage('Location must be at least 2 characters'),
  body('phone').optional().isMobilePhone().withMessage('Please provide a valid phone number'),
  body('website').optional().isURL().withMessage('Please provide a valid website URL'),
  body('skills').optional().isArray().withMessage('Skills must be an array'),
  body('hourlyRate').optional().isNumeric().withMessage('Hourly rate must be a number'),
  body('experience').optional().isInt({ min: 0 }).withMessage('Experience must be a non-negative integer'),
  body('availability').optional().isIn(['available', 'busy', 'unavailable']).withMessage('Invalid availability status'),
  body('organization').optional().trim().isLength({ min: 2 }).withMessage('Organization name must be at least 2 characters'),
  body('organizationType').optional().isIn(['ngo', 'sme', 'startup', 'enterprise', 'other']).withMessage('Invalid organization type')
];

const changePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long')
];

// Public routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);

// Protected routes
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfileValidation, updateProfile);
router.post('/logout', auth, logout);
router.put('/change-password', auth, changePasswordValidation, changePassword);

module.exports = router;
