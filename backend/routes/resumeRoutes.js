const express = require('express');
const router = express.Router();
const multer = require('multer');
const resumeController = require('../controllers/resumeController');
const authMiddleware = require('../middleware/auth');

// Setup multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// @route   POST api/resume/upload
// @desc    Upload PDF resume, extract text, and build Digital Twin
// @access  Private
router.post('/upload', authMiddleware, upload.single('resume'), resumeController.uploadResume);

module.exports = router;
