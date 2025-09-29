const express = require('express');
const { body, validationResult } = require('express-validator');
const Post = require('../models/Post');

const router = express.Router();

// Validation middleware
const validatePost = [
  body('title').isLength({ min: 1, max: 200 }).trim().escape(),
  body('content').isLength({ min: 1 }).trim(),
  body('author').isMongoId().withMessage('Valid author ID is required'),
  body('category').isIn(['technology', 'lifestyle', 'education', 'business', 'health', 'other']),
  body('excerpt').optional().isLength({ max: 300 }).trim()
];

const validateComment = [
  body('author').isMongoId().withMessage('Valid author ID is required'),
  body('content').isLength({ min: 1, max: 500 }).trim()
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

// @route   GET /api/posts
// @desc    Get all posts
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { category, status = 'published', search, author } = req.query;

    // Build query
    let query = {};
    
    if (status !== 'all') query.status = status;
    if (category) query.category = category;
    if (author) query.author = author;
    if (search) {
      query.$text = { $search: search };
    }

    const posts = await Post.find(query)
      .populate('author', 'username firstName lastName')
      .select('-content') // Exclude full content for list view
      .skip(skip)
      .limit(limit)
      .sort({ publishedAt: -1, createdAt: -1 });

    const total = await Post.countDocuments(query);

    res.json({
      success: true,
      data: posts,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: posts.length,
        totalRecords: total
      },
      filters: {
        category: category || 'all',
        status: status,
        search: search || '',
        author: author || 'all'
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

// @route   GET /api/posts/:id
// @desc    Get single post
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username firstName lastName')
      .populate('comments.author', 'username firstName lastName');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Increment views for published posts
    if (post.status === 'published') {
      post.views += 1;
      await post.save();
    }

    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/posts
// @desc    Create new post
// @access  Private (should add auth middleware)
router.post('/', validatePost, handleValidationErrors, async (req, res) => {
  try {
    const { 
      title, 
      content, 
      excerpt, 
      author, 
      category, 
      tags, 
      featuredImage, 
      status = 'draft' 
    } = req.body;

    const post = new Post({
      title,
      content,
      excerpt,
      author,
      category,
      tags: tags || [],
      featuredImage,
      status
    });

    const savedPost = await post.save();
    
    // Populate author info for response
    await savedPost.populate('author', 'username firstName lastName');

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: savedPost
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   PUT /api/posts/:id
// @desc    Update post
// @access  Private (should add auth middleware)
router.put('/:id', validatePost, handleValidationErrors, async (req, res) => {
  try {
    const { 
      title, 
      content, 
      excerpt, 
      category, 
      tags, 
      featuredImage, 
      status 
    } = req.body;

    const post = await Post.findByIdAndUpdate(
      req.params.id,
      {
        title,
        content,
        excerpt,
        category,
        tags,
        featuredImage,
        status
      },
      { new: true, runValidators: true }
    ).populate('author', 'username firstName lastName');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    res.json({
      success: true,
      message: 'Post updated successfully',
      data: post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   DELETE /api/posts/:id
// @desc    Delete post
// @access  Private (should add auth middleware)
router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    res.json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/posts/:id/comments
// @desc    Add comment to post
// @access  Private (should add auth middleware)
router.post('/:id/comments', validateComment, handleValidationErrors, async (req, res) => {
  try {
    const { author, content } = req.body;
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    post.comments.push({
      author,
      content
    });

    await post.save();
    
    // Populate the new comment's author info
    await post.populate('comments.author', 'username firstName lastName');

    const newComment = post.comments[post.comments.length - 1];

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: newComment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   DELETE /api/posts/:id/comments/:commentId
// @desc    Delete comment from post
// @access  Private (should add auth middleware)
router.delete('/:id/comments/:commentId', async (req, res) => {
  try {
    const { id: postId, commentId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const commentIndex = post.comments.findIndex(
      comment => comment._id.toString() === commentId
    );

    if (commentIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    post.comments.splice(commentIndex, 1);
    await post.save();

    res.json({
      success: true,
      message: 'Comment deleted successfully'
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