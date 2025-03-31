const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById, deleteUserById, editUserById, updateProfile } = require('../controllers/userController');
const { isAdmin, isAuthenticated } = require('../middlewares/authMiddleware');
const User = require('../models/userModel.js');

router.get('/getUserById', isAuthenticated, getUserById);
router.get('/getAllUsers', isAuthenticated, isAdmin, getAllUsers);
router.delete('/deleteUserById', isAuthenticated, isAdmin, deleteUserById);
router.put('/editUserById', isAuthenticated, isAdmin, editUserById);
router.put('/updateProfile', isAuthenticated, updateProfile);

module.exports = router;
