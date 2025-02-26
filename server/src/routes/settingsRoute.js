const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middlewares/authMiddleware');
const { getSettings, updateSettings } = require('../controllers/settingsController');

// Get settings - accessible to all
router.get('/', getSettings);

// Update settings - only admin can update
router.use(isAuthenticated, isAdmin);
router.put('/update', updateSettings);

module.exports = router; 