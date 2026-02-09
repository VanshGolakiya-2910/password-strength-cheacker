const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const createToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username, email: user.email },
    process.env.JWT_SECRET || 'dev-secret',
    { expiresIn: '7d' }
  );
};

const sanitizeUser = (user) => {
  const { passwordHash, __v, ...rest } = user.toObject();
  return rest;
};

// Register a new user
exports.register = async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      passwordHash,
      firstName: firstName || '',
      lastName: lastName || ''
    });

    const savedUser = await newUser.save();
    const token = createToken(savedUser);

    return res.status(201).json({
      message: 'User registered successfully',
      data: sanitizeUser(savedUser),
      token
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Identifier and password are required' });
    }

    const user = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }]
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = createToken(user);

    return res.json({
      message: 'Login successful',
      data: sanitizeUser(user),
      token
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

// Logout user (client should discard token)
exports.logout = async (req, res) => {
  return res.json({ message: 'Logged out successfully' });
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({
      message: 'User retrieved successfully',
      data: sanitizeUser(user)
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving user', error: error.message });
  }
};