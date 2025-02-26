const express = require('express');
const router = express.Router();
const { getCollections , createCollection, deleteCollection } = require('../controllers/collectionController.js');
const { isAuthenticated, isAdmin } = require('../middlewares/authMiddleware');

router.get('/', getCollections);

router.use(isAuthenticated);
router.use(isAdmin);
router.post('/', createCollection);
router.delete('/:id', deleteCollection);

module.exports = router;