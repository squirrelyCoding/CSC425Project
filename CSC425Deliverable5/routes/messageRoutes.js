const express = require('express');
const router = express.Router();

const {
  createMessage,
  getMessages,
  updateMessage,
  deleteMessage,
} = require('../controllers/messageController');

router.route('/').post(createMessage).get(getMessages);
router.route('/:id').put(updateMessage).delete(deleteMessage);

module.exports = router;