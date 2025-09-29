const Message = require('../models/Message');

// Helper function to send standardized responses
const sendResponse = (res, statusCode, success, data = null, error = null) => {
  const response = { success };
  if (success && data !== null) response.data = data;
  if (!success && error) response.error = error;
  return res.status(statusCode).json(response);
};

// POST /api/messages → Create a new message
const createMessage = async (req, res) => {
  try {
    const message = new Message(req.body);
    const savedMessage = await message.save();
    sendResponse(res, 201, true, savedMessage);
  } catch (error) {
    sendResponse(res, 400, false, null, error.message);
  }
};

// GET /api/messages → Get all messages
const getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find();
    sendResponse(res, 200, true, messages);
  } catch (error) {
    sendResponse(res, 500, false, null, error.message);
  }
};

// GET /api/messages/:id → Get a specific message by ID
const getMessageById = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await Message.findById(id);
    if (!message) {
      return sendResponse(res, 404, false, null, "Message not found");
    }
    sendResponse(res, 200, true, message);
  } catch (error) {
    sendResponse(res, 400, false, null, error.message);
  }
};

// PUT /api/messages/:id → Update a message by ID
const updateMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedMessage = await Message.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedMessage) {
      return sendResponse(res, 404, false, null, "Message not found");
    }
    sendResponse(res, 200, true, updatedMessage);
  } catch (error) {
    sendResponse(res, 400, false, null, error.message);
  }
};

// DELETE /api/messages/:id → Delete a message by ID
const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMessage = await Message.findByIdAndDelete(id);
    if (!deletedMessage) {
      return sendResponse(res, 404, false, null, "Message not found");
    }
    sendResponse(res, 200, true, { message: "Deleted", deletedId: id });
  } catch (error) {
    sendResponse(res, 400, false, null, error.message);
  }
};

module.exports = {
  createMessage,
  getAllMessages,
  getMessageById,
  updateMessage,
  deleteMessage
};