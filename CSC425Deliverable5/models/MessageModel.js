const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {
    type: String,
    required: [true, 'Please add text to your message'],
  },
}, { timestamps: true });

module.exports = mongoose.model('Message', MessageSchema);