const { validationResult } = require('express-validator');
const Message = require('../models/Message');
const Project = require('../models/Project');
const User = require('../models/User');

// Get all messages for a user
const getAllMessages = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      messageType,
      priority,
      isRead,
      isArchived = false
    } = req.query;

    const userId = req.user.userId;

    // Build filter object
    const filters = {
      $or: [
        { sender: userId },
        { recipient: userId }
      ],
      isArchived: isArchived === 'true'
    };

    if (messageType) {
      filters.messageType = messageType;
    }

    if (priority) {
      filters.priority = priority;
    }

    if (isRead !== undefined) {
      filters.isRead = isRead === 'true';
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const messages = await Message.find(filters)
      .populate('sender', 'name avatar organization')
      .populate('recipient', 'name avatar organization')
      .populate('project', 'title')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Message.countDocuments(filters);

    res.json({
      message: 'Messages retrieved successfully',
      messages,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalMessages: total,
        hasNext: skip + messages.length < total,
        hasPrev: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      message: 'Server error retrieving messages',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Get message by ID
const getMessageById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const message = await Message.findById(id)
      .populate('sender', 'name avatar organization')
      .populate('recipient', 'name avatar organization')
      .populate('project', 'title')
      .populate('replies');

    if (!message) {
      return res.status(404).json({
        message: 'Message not found'
      });
    }

    // Check if user is sender or recipient
    if (message.sender._id.toString() !== userId && message.recipient._id.toString() !== userId) {
      return res.status(403).json({
        message: 'Not authorized to view this message'
      });
    }

    // Mark as read if user is recipient
    if (message.recipient._id.toString() === userId && !message.isRead) {
      await message.markAsRead();
    }

    res.json({
      message: 'Message retrieved successfully',
      message
    });

  } catch (error) {
    console.error('Get message error:', error);
    res.status(500).json({
      message: 'Server error retrieving message',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Create new message
const createMessage = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const messageData = {
      ...req.body,
      sender: req.user.userId
    };

    const message = new Message(messageData);
    await message.save();

    // Populate sender and recipient data
    await message.populate('sender', 'name avatar organization');
    await message.populate('recipient', 'name avatar organization');
    await message.populate('project', 'title');

    res.status(201).json({
      message: 'Message sent successfully',
      message
    });

  } catch (error) {
    console.error('Create message error:', error);
    res.status(500).json({
      message: 'Server error creating message',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Update message
const updateMessage = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const userId = req.user.userId;

    const message = await Message.findById(id);
    if (!message) {
      return res.status(404).json({
        message: 'Message not found'
      });
    }

    // Check if user is sender
    if (message.sender.toString() !== userId) {
      return res.status(403).json({
        message: 'Not authorized to update this message'
      });
    }

    const updatedMessage = await Message.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    ).populate('sender', 'name avatar organization')
     .populate('recipient', 'name avatar organization')
     .populate('project', 'title');

    res.json({
      message: 'Message updated successfully',
      message: updatedMessage
    });

  } catch (error) {
    console.error('Update message error:', error);
    res.status(500).json({
      message: 'Server error updating message',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Delete message
const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const message = await Message.findById(id);
    if (!message) {
      return res.status(404).json({
        message: 'Message not found'
      });
    }

    // Check if user is sender or recipient
    if (message.sender.toString() !== userId && message.recipient.toString() !== userId) {
      return res.status(403).json({
        message: 'Not authorized to delete this message'
      });
    }

    await Message.findByIdAndDelete(id);

    res.json({
      message: 'Message deleted successfully'
    });

  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({
      message: 'Server error deleting message',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Mark message as read
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const message = await Message.findById(id);
    if (!message) {
      return res.status(404).json({
        message: 'Message not found'
      });
    }

    // Check if user is recipient
    if (message.recipient.toString() !== userId) {
      return res.status(403).json({
        message: 'Not authorized to mark this message as read'
      });
    }

    await message.markAsRead();

    res.json({
      message: 'Message marked as read'
    });

  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      message: 'Server error marking message as read',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Get conversation between two users
const getConversation = async (req, res) => {
  try {
    const { userId, projectId } = req.params;
    const currentUserId = req.user.userId;

    // Check if current user is part of the conversation
    if (currentUserId !== userId && currentUserId !== req.params.userId) {
      return res.status(403).json({
        message: 'Not authorized to view this conversation'
      });
    }

    const messages = await Message.getConversation(currentUserId, userId, projectId);

    res.json({
      message: 'Conversation retrieved successfully',
      messages
    });

  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({
      message: 'Server error retrieving conversation',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Get unread messages count
const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.userId;
    const count = await Message.getUnreadCount(userId);

    res.json({
      message: 'Unread count retrieved successfully',
      unreadCount: count
    });

  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      message: 'Server error retrieving unread count',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// Get inbox messages
const getInbox = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const userId = req.user.userId;

    const messages = await Message.getInbox(userId, parseInt(page), parseInt(limit));

    res.json({
      message: 'Inbox retrieved successfully',
      messages
    });

  } catch (error) {
    console.error('Get inbox error:', error);
    res.status(500).json({
      message: 'Server error retrieving inbox',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

module.exports = {
  getAllMessages,
  getMessageById,
  createMessage,
  updateMessage,
  deleteMessage,
  markAsRead,
  getConversation,
  getUnreadCount,
  getInbox
};
