const User = require('../models/User');
const bcrypt = require('bcrypt');
const DigitalTwin = require('../models/DigitalTwin');
const Memory = require('../models/Memory');

exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTwins = await DigitalTwin.countDocuments();
    const totalMemories = await Memory.countDocuments();

    // Calculate Platform Averages
    const twins = await DigitalTwin.find().select('career_readiness_score alignment_percentage primary_domain');
    let avgReadiness = 0;
    let avgAlignment = 0;
    const domainCounts = {};

    if (twins.length > 0) {
      avgReadiness = twins.reduce((sum, t) => sum + (t.career_readiness_score || 0), 0) / twins.length;
      avgAlignment = twins.reduce((sum, t) => sum + (t.alignment_percentage || 0), 0) / twins.length;
      
      twins.forEach(t => {
        if (t.primary_domain && t.primary_domain !== 'Awaiting Data...') {
          domainCounts[t.primary_domain] = (domainCounts[t.primary_domain] || 0) + 1;
        }
      });
    }

    const topDomains = Object.entries(domainCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(entry => ({ name: entry[0], count: entry[1] }));

    res.json({
      totalUsers,
      totalTwins,
      totalMemories,
      avgReadiness: Math.round(avgReadiness),
      avgAlignment: Math.round(avgAlignment),
      topDomains
    });
  } catch (error) {
    console.error('[AdminController] Get Stats Error:', error);
    res.status(500).json({ message: 'Server error fetching stats' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('[AdminController] Get Users Error:', error);
    res.status(500).json({ message: 'Server error fetching users' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (id === req.user.userId) {
      return res.status(400).json({ message: 'You cannot delete your own account from the admin panel.' });
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Optionally delete related data
    await DigitalTwin.deleteMany({ userId: id });
    await Memory.deleteMany({ userId: id });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('[AdminController] Delete User Error:', error);
    res.status(500).json({ message: 'Server error deleting user' });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    if (id === req.user.userId) {
      return res.status(400).json({ message: 'You cannot change your own role.' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.json({ message: 'User role updated successfully', user: { _id: user._id, email: user.email, role: user.role } });
  } catch (error) {
    console.error('[AdminController] Update Role Error:', error);
    res.status(500).json({ message: 'Server error updating user role' });
  }
};

exports.getAllTwins = async (req, res) => {
  try {
    const twins = await DigitalTwin.find()
      .populate('userId', 'email name')
      .sort({ createdAt: -1 });
    res.json(twins);
  } catch (error) {
    console.error('[AdminController] Get Twins Error:', error);
    res.status(500).json({ message: 'Server error fetching digital twins' });
  }
};

exports.getAllMemories = async (req, res) => {
  try {
    const memories = await Memory.find()
      .populate('userId', 'email')
      .sort({ timestamp: -1 })
      .limit(100); // Prevent loading massive payloads
    res.json(memories);
  } catch (error) {
    console.error('[AdminController] Get Memories Error:', error);
    res.status(500).json({ message: 'Server error fetching memories' });
  }
};

exports.createAdminUser = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      email,
      password: hashedPassword,
      name: name || 'Admin',
      role: 'admin'
    });

    await user.save();

    res.status(201).json({ message: 'Admin user created successfully', user: { _id: user._id, email: user.email, name: user.name, role: user.role, createdAt: user.createdAt } });
  } catch (error) {
    console.error('[AdminController] Create Admin Error:', error);
    res.status(500).json({ message: 'Server error creating admin user' });
  }
};
