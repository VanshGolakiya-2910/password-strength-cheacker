const express = require('express');
const router = express.Router();

/**
 * @route   POST /api/v1/data/export
 * @desc    Export user's passwords as JSON
 * @param   {string} userId - User ID
 * @return  {JSON} Exported passwords
 */
router.post('/export', async (req, res) => {
  try {
    const { userId } = req.body;
    const Password = require('../models/Password');

    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    const passwords = await Password.find({ userId });

    res.json({
      message: 'Passwords exported successfully',
      exportDate: new Date(),
      userId,
      count: passwords.length,
      data: passwords
    });
  } catch (error) {
    res.status(500).json({
      message: 'Unable to export passwords right now.'
    });
  }
});

/**
 * @route   POST /api/v1/data/import
 * @desc    Import passwords from JSON
 * @param   {string} userId - User ID
 * @param   {array} passwords - Array of password objects
 * @return  {JSON} Import result
 */
router.post('/import', async (req, res) => {
  try {
    const { userId, passwords } = req.body;
    const Password = require('../models/Password');

    if (!userId || !Array.isArray(passwords)) {
      return res.status(400).json({
        message: 'userId and passwords array are required'
      });
    }

    const passwordsWithUserId = passwords.map(pwd => ({
      ...pwd,
      userId
    }));

    const result = await Password.insertMany(passwordsWithUserId);

    res.json({
      message: 'Passwords imported successfully',
      importedCount: result.length,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      message: 'Unable to import passwords right now.'
    });
  }
});

module.exports = router;
