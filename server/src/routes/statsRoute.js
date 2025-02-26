const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/statsController');
const { isAuthenticated, isAdmin } = require('../middlewares/authMiddleware');

router.use(isAuthenticated);
router.use(isAdmin);
router.get('/', getStats);

module.exports = router;