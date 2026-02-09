const bcrypt = require('bcryptjs');
const User = require('../models/User');

const sanitizeUser = (user) => {
  const { passwordHash, __v, ...rest } = user.toObject();
  return rest;
};

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: 'Username, email, and password are required'
      });
    }

    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'Username or email already exists'
      });
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

    res.status(201).json({
      message: 'User created successfully',
      data: sanitizeUser(savedUser)
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error creating user',
      error: error.message
    });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User retrieved successfully',
      data: sanitizeUser(user)
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving user',
      error: error.message
    });
  }
};

// Get user by username
exports.getUserByUsername = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User retrieved successfully',
      data: sanitizeUser(user)
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving user',
      error: error.message
    });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { firstName, lastName, email, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User updated successfully',
      data: sanitizeUser(user)
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating user',
      error: error.message
    });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User deleted successfully',
      data: sanitizeUser(user)
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting user',
      error: error.message
    });
  }
};

// Get all users (for admin purposes)
exports.getAllUsers = async (req, res) => {
  try {
    const { limit = 20, skip = 0 } = req.query;

    const users = await User.find()
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments();

    res.json({
      message: 'Users retrieved successfully',
      data: users.map(sanitizeUser),
      pagination: {
        total,
        limit: parseInt(limit),
        skip: parseInt(skip),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving users',
      error: error.message
    });
  }
};
