const Message = require('../models/MessageModel');

const createMessage = async (req, res) => {
  try {
    const { user, text } = req.body;
    if (!user || !text) {
      return res.status(400).json({ success: false, error: 'User and text fields are required' });
    }
    const newMessage = new Message({ user, text });
    const savedMessage = await newMessage.save();
    res.status(201).json({ success: true, data: savedMessage });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().populate('user', 'username');
    res.status(200).json({ success: true, data: messages });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

const updateMessage = async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { text: req.body.text },
      { new: true, runValidators: true }
    );
    if (!message) {
      return res.status(404).json({ success: false, error: 'Message not found' });
    }
    res.status(200).json({ success: true, data: message });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({ success: false, error: 'Message not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

module.exports = {
  createMessage,
  getMessages,
  updateMessage,
  deleteMessage,
};