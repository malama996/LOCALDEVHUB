const express = require('express');
const { body, param } = require('express-validator');
const {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  applyToProject,
  getProjectApplications,
  updateApplicationStatus
} = require('../controllers/projectController');
const auth = require('../middleware/auth');

const router = express.Router();

// Validation rules
const createProjectValidation = [
  body('title').trim().isLength({ min: 5, max: 200 }).withMessage('Title must be between 5 and 200 characters'),
  body('description').trim().isLength({ min: 20, max: 2000 }).withMessage('Description must be between 20 and 2000 characters'),
  body('budget').isNumeric().withMessage('Budget must be a number'),
  body('timeline').trim().notEmpty().withMessage('Timeline is required'),
  body('skills').isArray({ min: 1 }).withMessage('At least one skill is required'),
  body('location').trim().isLength({ min: 2 }).withMessage('Location is required'),
  body('category').optional().isIn(['web-development', 'mobile-app', 'desktop-app', 'data-analysis', 'ai-ml', 'blockchain', 'other']).withMessage('Invalid category'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority')
];

const updateProjectValidation = [
  body('title').optional().trim().isLength({ min: 5, max: 200 }).withMessage('Title must be between 5 and 200 characters'),
  body('description').optional().trim().isLength({ min: 20, max: 2000 }).withMessage('Description must be between 20 and 2000 characters'),
  body('budget').optional().isNumeric().withMessage('Budget must be a number'),
  body('timeline').optional().trim().notEmpty().withMessage('Timeline is required'),
  body('skills').optional().isArray({ min: 1 }).withMessage('At least one skill is required'),
  body('location').optional().trim().isLength({ min: 2 }).withMessage('Location is required'),
  body('status').optional().isIn(['open', 'in-progress', 'completed', 'cancelled', 'on-hold']).withMessage('Invalid status'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority')
];

const applyToProjectValidation = [
  body('proposal').trim().isLength({ min: 50, max: 1000 }).withMessage('Proposal must be between 50 and 1000 characters'),
  body('proposedBudget').optional().isNumeric().withMessage('Proposed budget must be a number'),
  body('proposedTimeline').optional().trim().notEmpty().withMessage('Proposed timeline is required')
];

const updateApplicationStatusValidation = [
  body('status').isIn(['pending', 'accepted', 'rejected']).withMessage('Status must be pending, accepted, or rejected')
];

const mongoIdValidation = [
  param('id').isMongoId().withMessage('Invalid project ID'),
  param('applicationId').optional().isMongoId().withMessage('Invalid application ID')
];

// Public routes
router.get('/', getAllProjects);
router.get('/:id', mongoIdValidation[0], getProjectById);

// Protected routes
router.post('/', auth, createProjectValidation, createProject);
router.put('/:id', auth, mongoIdValidation[0], updateProjectValidation, updateProject);
router.delete('/:id', auth, mongoIdValidation[0], deleteProject);

// Application routes
router.post('/:id/apply', auth, mongoIdValidation[0], applyToProjectValidation, applyToProject);
router.get('/:id/applications', auth, mongoIdValidation[0], getProjectApplications);
router.put('/:id/applications/:applicationId', auth, mongoIdValidation, updateApplicationStatusValidation, updateApplicationStatus);

module.exports = router;
