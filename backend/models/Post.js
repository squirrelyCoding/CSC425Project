const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Post title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Post content is required'],
    trim: true
  },
  excerpt: {
    type: String,
    trim: true,
    maxlength: [300, 'Excerpt cannot exceed 300 characters']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['technology', 'lifestyle', 'education', 'business', 'health', 'other'],
    default: 'other'
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  featuredImage: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  publishedAt: {
    type: Date
  },
  readingTime: {
    type: Number, // in minutes
    default: 1
  },
  views: {
    type: Number,
    default: 0
  },
  comments: [{
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: [500, 'Comment cannot exceed 500 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Calculate reading time based on content length
postSchema.pre('save', function(next) {
  if (this.content) {
    const wordsPerMinute = 200;
    const words = this.content.split(' ').length;
    this.readingTime = Math.ceil(words / wordsPerMinute);
  }
  next();
});

// Set publishedAt date when status changes to published
postSchema.pre('save', function(next) {
  if (this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

// Index for better search and query performance
postSchema.index({ title: 'text', content: 'text', excerpt: 'text' });
postSchema.index({ author: 1, status: 1, publishedAt: -1 });
postSchema.index({ category: 1, status: 1 });

module.exports = mongoose.model('Post', postSchema);