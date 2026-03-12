const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middleware/auth');

// @route   POST api/chat
// @desc    Interact with the AI personal career mentor
// @access  Private
router.post('/', authMiddleware, chatController.careerMentorChat);

module.exports = router;
