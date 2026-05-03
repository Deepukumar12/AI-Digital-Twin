require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const seedDefaultAdmin = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/aidigitaltwin';
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const email = 'admin@example.com';
    const password = 'AdminPassword123!';

    let user = await User.findOne({ email });

    if (user) {
      console.log('Admin user already exists! Updating password and role to be sure...');
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      user.role = 'admin';
      await user.save();
    } else {
      console.log('Creating new default admin user...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      user = new User({
        email,
        password: hashedPassword,
        name: 'System Admin',
        role: 'admin'
      });
      await user.save();
    }

    console.log('\n--- ADMIN CREDENTIALS ---');
    console.log(`Email:    ${email}`);
    console.log(`Password: ${password}`);
    console.log('-------------------------\n');
    process.exit(0);
  } catch (error) {
    console.error('Error creating default admin:', error);
    process.exit(1);
  }
};

seedDefaultAdmin();
