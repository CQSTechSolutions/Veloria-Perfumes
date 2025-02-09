const express = require('express');
const router = express.Router();
const { getAllUsers } = require('../controllers/userController');
// const { isAdmin, isAuthenticated } = require('../middlewares/authMiddleware');

router.get('/getAllUsers', getAllUsers);

module.exports = router;
