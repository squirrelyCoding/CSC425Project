const express = require('express');
const { body, validationResult } = require('express-validator');
const Contact = require('../models/Contact');

const router = express.Router();

// Validation middleware
const validateContact = [
  body('name').isLength({ min: 1, max: 100 }).trim().escape(),
  body('email').isEmail().normalizeEmail(),
  body('subject').isLength({ min: 1, max: 150 }).trim().escape(),
  body('message').isLength({ min: 1, max: 1500 }).trim(),
  body('phone').optional().isMobilePhone(),
  body('category').optional().isIn(['general', 'support', 'feedback', 'business', 'other'])
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

// @route   GET /api/contacts
// @desc    Get all contacts
// @access  Private (admin only)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { status, priority, category, search } = req.query;

    // Build query
    let query = {};
    
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } }
      ];
    }

    const contacts = await Contact.find(query)
      .populate('assignedTo', 'username firstName lastName')
      .populate('response.respondedBy', 'username firstName lastName')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Contact.countDocuments(query);

    // Get status counts for dashboard
    const statusCounts = await Contact.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: contacts,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: contacts.length,
        totalRecords: total
      },
      filters: {
        status: status || 'all',
        priority: priority || 'all',
        category: category || 'all',
        search: search || ''
      },
      statusCounts: statusCounts.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {})
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/contacts/:id
// @desc    Get single contact
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id)
      .populate('assignedTo', 'username firstName lastName email')
      .populate('response.respondedBy', 'username firstName lastName email');

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.json({
      success: true,
      data: contact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/contacts
// @desc    Create new contact
// @access  Public
router.post('/', validateContact, handleValidationErrors, async (req, res) => {
  try {
    const { 
      name, 
      email, 
      phone, 
      subject, 
      message, 
      category = 'general',
      priority = 'medium'
    } = req.body;

    // Get client IP and user agent for tracking
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    const contact = new Contact({
      name,
      email,
      phone,
      subject,
      message,
      category,
      priority,
      ipAddress,
      userAgent
    });

    const savedContact = await contact.save();

    res.status(201).json({
      success: true,
      message: 'Contact form submitted successfully',
      data: {
        id: savedContact._id,
        name: savedContact.name,
        email: savedContact.email,
        subject: savedContact.subject,
        status: savedContact.status,
        createdAt: savedContact.createdAt
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

// @route   PUT /api/contacts/:id
// @desc    Update contact (for admin use)
// @access  Private (admin only)
router.put('/:id', async (req, res) => {
  try {
    const { status, priority, assignedTo, category } = req.body;

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      {
        status,
        priority,
        assignedTo,
        category
      },
      { new: true, runValidators: true }
    )
    .populate('assignedTo', 'username firstName lastName')
    .populate('response.respondedBy', 'username firstName lastName');

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.json({
      success: true,
      message: 'Contact updated successfully',
      data: contact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/contacts/:id/respond
// @desc    Add response to contact
// @access  Private (admin/support only)
router.post('/:id/respond', async (req, res) => {
  try {
    const { content, respondedBy } = req.body;

    if (!content || !respondedBy) {
      return res.status(400).json({
        success: false,
        message: 'Response content and respondedBy are required'
      });
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      {
        'response.content': content,
        'response.respondedBy': respondedBy,
        'response.respondedAt': new Date(),
        status: 'resolved'
      },
      { new: true }
    )
    .populate('response.respondedBy', 'username firstName lastName');

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.json({
      success: true,
      message: 'Response added successfully',
      data: contact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   DELETE /api/contacts/:id
// @desc    Delete contact
// @access  Private (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.json({
      success: true,
      message: 'Contact deleted successfully'
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