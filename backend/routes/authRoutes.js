const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

// @route   POST api/auth/register
// @desc    Register a user
// @access  Public
router.post('/register', authController.register);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', authController.login);

// @route   GET api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', authMiddleware, authController.getMe);

// @route   PUT api/auth/me
// @desc    Update current user profile (name, bio)
// @access  Private
router.put('/me', authMiddleware, authController.updateProfile);

// @route   PUT api/auth/password
// @desc    Update user password
// @access  Private
router.put('/password', authMiddleware, authController.updatePassword);

// @route   PUT api/auth/subscription
// @desc    Upgrade user subscription plan to Enterprise
// @access  Private
router.put('/subscription', authMiddleware, authController.upgradeSubscription);

// @route   POST api/auth/logout
// @desc    Logout user
// @access  Public
router.post('/logout', (req, res) => res.json({ message: 'Logged out successfully' }));

module.exports = router;
