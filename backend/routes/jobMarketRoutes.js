const express = require('express');
const router = express.Router();
const jobMarketController = require('../controllers/jobMarketController');
const authMiddleware = require('../middleware/auth');

// @route   GET api/job-market/:role
// @desc    Get job market insights for a specific role
// @access  Private
// Require authentication to access this endpoint, assuming this is an internal API for the dashboard
router.get('/:role', authMiddleware, jobMarketController.getJobMarketInsights);

module.exports = router;
