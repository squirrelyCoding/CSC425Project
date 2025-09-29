const express = require('express');
const { body, validationResult } = require('express-validator');
const Message = require('../models/Message');

const router = express.Router();

// Validation middleware
const validateMessage = [
  body('title').isLength({ min: 1, max: 100 }).trim().escape(),
  body('content').isLength({ min: 1, max: 1000 }).trim(),
  body('author').isMongoId().withMessage('Valid author ID is required'),
  body('category').optional().isIn(['general', 'announcement', 'question', 'discussion']),
  body('priority').optional().isIn(['low', 'medium', 'high'])
];

// Helper function to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// @route   GET /api/messages
// @desc    Get all messages
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { category, priority, search } = req.query;

    // Build query
    let query = { isPublished: true };
    
    if (category) query.category = category;
    if (priority) query.priority = priority;
    if (search) {
      query.$text = { $search: search };
    }

    const messages = await Message.find(query)
      .populate('author', 'username firstName lastName')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Message.countDocuments(query);

    res.json({
      success: true,
      data: messages,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: messages.length,
        totalRecords: total
      },
      filters: {
        category: category || 'all',
        priority: priority || 'all',
        search: search || ''
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/messages/:id
// @desc    Get single message
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const message = await Message.findById(req.params.id)
      .populate('author', 'username firstName lastName')
      .populate('likes.user', 'username');

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Increment views
    message.views += 1;
    await message.save();

    res.json({
      success: true,
      data: message
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/messages
// @desc    Create new message
// @access  Public (should be protected)
router.post('/', validateMessage, handleValidationErrors, async (req, res) => {
  try {
    const { title, content, author, category, priority, tags } = req.body;

    const message = new Message({
      title,
      content,
      author,
      category,
      priority,
      tags: tags || []
    });

    const savedMessage = await message.save();
    
    // Populate author info for response
    await savedMessage.populate('author', 'username firstName lastName');

    res.status(201).json({
      success: true,
      message: 'Message created successfully',
      data: savedMessage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   PUT /api/messages/:id
// @desc    Update message
// @access  Private (should add auth middleware)
router.put('/:id', validateMessage, handleValidationErrors, async (req, res) => {
  try {
    const { title, content, category, priority, tags, isPublished } = req.body;

    const message = await Message.findByIdAndUpdate(
      req.params.id,
      {
        title,
        content,
        category,
        priority,
        tags,
        isPublished
      },
      { new: true, runValidators: true }
    ).populate('author', 'username firstName lastName');

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    res.json({
      success: true,
      message: 'Message updated successfully',
      data: message
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   DELETE /api/messages/:id
// @desc    Delete message
// @access  Private (should add auth middleware)
router.delete('/:id', async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/messages/:id/like
// @desc    Like/unlike a message
// @access  Private (should add auth middleware)
router.post('/:id/like', async (req, res) => {
  try {
    const { userId } = req.body;
    const messageId = req.params.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Check if user already liked
    const likeIndex = message.likes.findIndex(like => like.user.toString() === userId);

    if (likeIndex > -1) {
      // Unlike - remove the like
      message.likes.splice(likeIndex, 1);
    } else {
      // Like - add the like
      message.likes.push({ user: userId });
    }

    await message.save();

    res.json({
      success: true,
      message: likeIndex > -1 ? 'Message unliked' : 'Message liked',
      data: {
        likes: message.likes.length,
        isLiked: likeIndex === -1
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;