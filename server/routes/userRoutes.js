const express = require('express');
const { body, param } = require('express-validator');
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getDevelopers,
  getClients,
  updateUserRating
} = require('../controllers/userController');
const auth = require('../middleware/auth');

const router = express.Router();

// Validation rules
const updateUserValidation = [
  body('name').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('bio').optional().isLength({ max: 500 }).withMessage('Bio must not exceed 500 characters'),
  body('location').optional().trim().isLength({ min: 2 }).withMessage('Location must be at least 2 characters'),
  body('phone').optional().isMobilePhone().withMessage('Please provide a valid phone number'),
  body('website').optional().isURL().withMessage('Please provide a valid website URL'),
  body('github').optional().isURL().withMessage('Please provide a valid GitHub URL'),
  body('linkedin').optional().isURL().withMessage('Please provide a valid LinkedIn URL'),
  body('skills').optional().isArray().withMessage('Skills must be an array'),
  body('hourlyRate').optional().isNumeric().withMessage('Hourly rate must be a number'),
  body('experience').optional().isInt({ min: 0 }).withMessage('Experience must be a non-negative integer'),
  body('availability').optional().isIn(['available', 'busy', 'unavailable']).withMessage('Invalid availability status'),
  body('organization').optional().trim().isLength({ min: 2 }).withMessage('Organization name must be at least 2 characters'),
  body('organizationType').optional().isIn(['ngo', 'sme', 'startup', 'enterprise', 'other']).withMessage('Invalid organization type')
];

const updateRatingValidation = [
  body('rating').isFloat({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5')
];

const mongoIdValidation = [
  param('id').isMongoId().withMessage('Invalid user ID')
];

// Public routes
router.get('/', getAllUsers);
router.get('/developers', getDevelopers);
router.get('/clients', getClients);
router.get('/:id', mongoIdValidation, getUserById);

// Protected routes
router.put('/:id', auth, mongoIdValidation, updateUserValidation, updateUser);
router.delete('/:id', auth, mongoIdValidation, deleteUser);
router.put('/:id/rating', auth, mongoIdValidation, updateRatingValidation, updateUserRating);

module.exports = router;
