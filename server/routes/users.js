// =============================================
// server/routes/users.js - User Management
// =============================================

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { requireRole } = require('../middleware/auth');

// GET /api/users - Get all users (Admin only)
router.get('/', requireRole('admin'), async (req, res) => {
  try {
    // Return users without passwords
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// DELETE /api/users/:id - Delete a user (Admin only)
router.delete('/:id', requireRole('admin'), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user' });
  }
});

module.exports = router;
