const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    user = new User({
      email,
      password: hashedPassword,
    });

    await user.save();

    // Create token
    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'your_jwt_secret_key_here', { expiresIn: '1d' });

    res.status(201).json({ token, userId: user._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create token
    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'your_jwt_secret_key_here', { expiresIn: '1d' });

    res.json({ token, userId: user._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching user' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, bio } = req.body;
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (bio) user.bio = bio;

    await user.save();
    res.json({ message: 'Profile updated successfully', user: { email: user.email, name: user.name, bio: user.bio, subscriptionPlan: user.subscriptionPlan } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validate request
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new passwords are required' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect current password' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('[AuthController] Update Password Error:', error);
    res.status(500).json({ message: 'Server error updating password' });
  }
};

exports.upgradeSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Process upgrade natively
    user.subscriptionPlan = 'Enterprise';
    await user.save();

    res.json({
      message: 'Successfully upgraded to Enterprise tier!',
      subscriptionPlan: user.subscriptionPlan
    });
  } catch (error) {
    console.error('[AuthController] Subscription Upgrade Error:', error);
    res.status(500).json({ message: 'Server error during subscription upgrade' });
  }
};
