const express = require('express');
const router = express.Router();
const { getCollections, createCollection, deleteCollection } = require('../controllers/collectionController');
const { isAdmin, isAuthenticated } = require('../middlewares/authMiddleware');

// Public route
router.get('/', getCollections);

// Admin routes
router.post('/', isAuthenticated, isAdmin, createCollection);
router.delete('/:id', isAuthenticated, isAdmin, deleteCollection);

module.exports = router;