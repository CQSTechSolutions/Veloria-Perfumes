const express = require('express');
const router = express.Router();
const { getCollections, getCollectionById, createCollection, deleteCollection, updateCollection } = require('../controllers/collectionController');
const { isAdmin, isAuthenticated } = require('../middlewares/authMiddleware');

// Debug log
console.log('Collection routes being registered:');
console.log('- GET /');
console.log('- GET /:id');

// Public routes
router.get('/', getCollections);
router.get('/:id', getCollectionById);

// Admin routes
router.post('/', isAuthenticated, isAdmin, createCollection);
router.delete('/:id', isAuthenticated, isAdmin, deleteCollection);
router.put('/:id', isAuthenticated, isAdmin, updateCollection);

module.exports = router;