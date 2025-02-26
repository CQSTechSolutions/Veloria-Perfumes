const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById } = require('../controllers/userController');
const { isAdmin, isAuthenticated } = require('../middlewares/authMiddleware');

router.use(isAuthenticated);
router.use(isAdmin);
router.get('/getAllUsers', getAllUsers);
router.get('/getUserById', getUserById);

module.exports = router;
