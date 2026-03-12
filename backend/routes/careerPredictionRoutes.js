const express = require('express');
const router = express.Router();
const careerPredictionController = require('../controllers/careerPredictionController');
const authMiddleware = require('../middleware/auth');

// @route   POST api/career/self-assessment
// @desc    Submit user's skillset slider values and calculate their best career path
// @access  Private
router.post('/self-assessment', authMiddleware, careerPredictionController.submitAssessment);

// @route   GET api/career/recommendation
// @desc    Fetch the calculated career recommendation and scores
// @access  Private
router.get('/recommendation', authMiddleware, careerPredictionController.getRecommendation);

module.exports = router;
