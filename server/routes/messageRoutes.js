const express = require('express');
const { body, param } = require('express-validator');
const {
  getAllMessages,
  getMessageById,
  createMessage,
  updateMessage,
  deleteMessage,
  markAsRead,
  getConversation,
  getUnreadCount,
  getInbox
} = require('../controllers/messageController');
const auth = require('../middleware/auth');

const router = express.Router();

// Validation rules
const createMessageValidation = [
  body('recipient').isMongoId().withMessage('Invalid recipient ID'),
  body('subject').trim().isLength({ min: 5, max: 200 }).withMessage('Subject must be between 5 and 200 characters'),
  body('content').trim().isLength({ min: 10, max: 5000 }).withMessage('Content must be between 10 and 5000 characters'),
  body('messageType').optional().isIn(['general', 'project-inquiry', 'application', 'milestone-update', 'payment', 'support']).withMessage('Invalid message type'),
  body('priority').optional().isIn(['low', 'normal', 'high', 'urgent']).withMessage('Invalid priority'),
  body('project').optional().isMongoId().withMessage('Invalid project ID')
];

const updateMessageValidation = [
  body('subject').optional().trim().isLength({ min: 5, max: 200 }).withMessage('Subject must be between 5 and 200 characters'),
  body('content').optional().trim().isLength({ min: 10, max: 5000 }).withMessage('Content must be between 10 and 5000 characters'),
  body('priority').optional().isIn(['low', 'normal', 'high', 'urgent']).withMessage('Invalid priority'),
  body('isImportant').optional().isBoolean().withMessage('isImportant must be a boolean'),
  body('isArchived').optional().isBoolean().withMessage('isArchived must be a boolean')
];

const mongoIdValidation = [
  param('id').isMongoId().withMessage('Invalid message ID')
];

const conversationValidation = [
  param('userId').isMongoId().withMessage('Invalid user ID'),
  param('projectId').optional().isMongoId().withMessage('Invalid project ID')
];

// Protected routes
router.get('/', auth, getAllMessages);
router.get('/inbox', auth, getInbox);
router.get('/unread-count', auth, getUnreadCount);
router.get('/conversation/:userId/:projectId?', auth, conversationValidation, getConversation);
router.get('/:id', auth, mongoIdValidation, getMessageById);

router.post('/', auth, createMessageValidation, createMessage);
router.put('/:id', auth, mongoIdValidation, updateMessageValidation, updateMessage);
router.put('/:id/read', auth, mongoIdValidation, markAsRead);
router.delete('/:id', auth, mongoIdValidation, deleteMessage);

module.exports = router;
