const express = require('express');
const router = express.Router();
const twinController = require('../controllers/twinController');
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middleware/auth');

// Simulation
router.post('/simulate', authMiddleware, twinController.simulateScenario);

// Career Intelligence
router.get('/twin', authMiddleware, twinController.getTwin);
router.post('/career/rebuild', authMiddleware, twinController.rebuildTwin);
router.post('/skills/add', authMiddleware, twinController.addSkill);
router.post('/skills/remove', authMiddleware, twinController.removeSkill);

// Target Updates
router.post('/target/update', authMiddleware, twinController.updateTargetRole);

// AI Resources
router.get('/resources', authMiddleware, twinController.generateLearningLinks);

// Reporting
router.get('/report/pdf', authMiddleware, twinController.generateReport);

// Profile Management
router.post('/career/reset', authMiddleware, twinController.resetTwin);
router.post('/roadmap/update', authMiddleware, twinController.rebuildTwin); // Reuse rebuild for now or specific update logic

// Chat
router.post('/chat', authMiddleware, chatController.careerMentorChat);

module.exports = router;
