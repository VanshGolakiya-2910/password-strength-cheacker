const Password = require('../models/Password');

// Create and save a new password
exports.savePassword = async (req, res) => {
  try {
    const {
      userId,
      password,
      mode,
      strength,
      strengthScore,
      isGenerated,
      feedback,
      personalDetails,
      tags,
      notes
    } = req.body;

    // Validation
    if (!password || !mode || !strength || strengthScore === undefined) {
      return res.status(400).json({
        message: 'Missing required fields: password, mode, strength, strengthScore'
      });
    }

    const newPassword = new Password({
      userId: userId || 'anonymous',
      password,
      mode,
      strength,
      strengthScore,
      isGenerated: isGenerated || false,
      feedback: feedback || [],
      personalDetails: personalDetails || {},
      tags: tags || [],
      notes: notes || ''
    });

    const savedPassword = await newPassword.save();

    res.status(201).json({
      message: 'Password saved successfully',
      data: savedPassword
    });
  } catch (error) {
    res.status(500).json({
      message: 'Unable to save password right now.'
    });
  }
};

// Get all passwords for a user
exports.getUserPasswords = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 20, skip = 0 } = req.query;

    const passwords = await Password.find({ userId })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Password.countDocuments({ userId });

    res.json({
      message: 'Passwords retrieved successfully',
      data: passwords,
      pagination: {
        total,
        limit: parseInt(limit),
        skip: parseInt(skip),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Unable to retrieve passwords right now.'
    });
  }
};

// Get password by ID
exports.getPasswordById = async (req, res) => {
  try {
    const { id } = req.params;

    const password = await Password.findById(id);

    if (!password) {
      return res.status(404).json({ message: 'Password not found' });
    }

    res.json({
      message: 'Password retrieved successfully',
      data: password
    });
  } catch (error) {
    res.status(500).json({
      message: 'Unable to retrieve password right now.'
    });
  }
};

// Update password record
exports.updatePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes, tags } = req.body;

    const password = await Password.findByIdAndUpdate(
      id,
      { notes, tags, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!password) {
      return res.status(404).json({ message: 'Password not found' });
    }

    res.json({
      message: 'Password updated successfully',
      data: password
    });
  } catch (error) {
    res.status(500).json({
      message: 'Unable to update password right now.'
    });
  }
};

// Delete password
exports.deletePassword = async (req, res) => {
  try {
    const { id } = req.params;

    const password = await Password.findByIdAndDelete(id);

    if (!password) {
      return res.status(404).json({ message: 'Password not found' });
    }

    res.json({
      message: 'Password deleted successfully',
      data: password
    });
  } catch (error) {
    res.status(500).json({
      message: 'Unable to delete password right now.'
    });
  }
};

// Get password statistics
exports.getPasswordStats = async (req, res) => {
  try {
    const { userId } = req.params;

    const stats = await Password.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          totalPasswords: { $sum: 1 },
          generatedPasswords: {
            $sum: { $cond: ['$isGenerated', 1, 0] }
          },
          averageStrengthScore: { $avg: '$strengthScore' },
          strengthDistribution: {
            $push: '$strength'
          },
          modeDistribution: {
            $push: '$mode'
          }
        }
      }
    ]);

    if (stats.length === 0) {
      return res.json({
        message: 'No password data found',
        data: {
          totalPasswords: 0,
          generatedPasswords: 0,
          averageStrengthScore: 0,
          strengthDistribution: [],
          modeDistribution: []
        }
      });
    }

    // Count distributions
    const distribution = stats[0];
    const strengthCounts = distribution.strengthDistribution.reduce((acc, strength) => {
      acc[strength] = (acc[strength] || 0) + 1;
      return acc;
    }, {});

    const modeCounts = distribution.modeDistribution.reduce((acc, mode) => {
      acc[mode] = (acc[mode] || 0) + 1;
      return acc;
    }, {});

    res.json({
      message: 'Password statistics retrieved successfully',
      data: {
        totalPasswords: distribution.totalPasswords,
        generatedPasswords: distribution.generatedPasswords,
        averageStrengthScore: Math.round(distribution.averageStrengthScore),
        strengthDistribution: strengthCounts,
        modeDistribution: modeCounts
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Unable to retrieve statistics right now.'
    });
  }
};

// Search passwords by tags or notes
exports.searchPasswords = async (req, res) => {
  try {
    const { userId } = req.params;
    const { query, limit = 20, skip = 0 } = req.query;

    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const passwords = await Password.find({
      userId,
      $or: [
        { tags: { $in: [query] } },
        { notes: { $regex: query, $options: 'i' } },
        { strength: query }
      ]
    })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Password.countDocuments({
      userId,
      $or: [
        { tags: { $in: [query] } },
        { notes: { $regex: query, $options: 'i' } },
        { strength: query }
      ]
    });

    res.json({
      message: 'Search results retrieved successfully',
      data: passwords,
      pagination: {
        total,
        limit: parseInt(limit),
        skip: parseInt(skip),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Unable to search passwords right now.'
    });
  }
};

// Delete all passwords for a user
exports.deleteAllUserPasswords = async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await Password.deleteMany({ userId });

    res.json({
      message: 'All passwords deleted successfully',
      deletedCount: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({
      message: 'Unable to delete passwords right now.'
    });
  }
};
