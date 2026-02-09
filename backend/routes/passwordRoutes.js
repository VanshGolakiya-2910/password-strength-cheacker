const express = require('express');
const router = express.Router();
const passwordController = require('../controllers/passwordController');

// Save a new password
router.post('/', passwordController.savePassword);

// Get all passwords for a user
router.get('/user/:userId', passwordController.getUserPasswords);

// Get password statistics
router.get('/user/:userId/stats', passwordController.getPasswordStats);

// Search passwords
router.get('/user/:userId/search', passwordController.searchPasswords);

// Get password by ID
router.get('/:id', passwordController.getPasswordById);

// Update password
router.put('/:id', passwordController.updatePassword);

// Delete password
router.delete('/:id', passwordController.deletePassword);

// Delete all passwords for a user
router.delete('/user/:userId/all', passwordController.deleteAllUserPasswords);

module.exports = router;
