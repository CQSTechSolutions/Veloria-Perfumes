const express = require('express');
const router = express.Router();
const { getCollections , createCollection } = require('../controllers/collectionController.js');

router.get('/', getCollections);
router.post('/', createCollection);

module.exports = router;