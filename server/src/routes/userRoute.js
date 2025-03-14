const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById } = require('../controllers/userController');
const { isAdmin, isAuthenticated } = require('../middlewares/authMiddleware');

router.get('/getUserById', isAuthenticated, getUserById);
router.get('/getAllUsers', isAuthenticated, isAdmin, getAllUsers);
router.delete('/deleteUserById', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const userId = req.query.id;
        const result = await User.findByIdAndDelete(userId);
        if (!result) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete user', error: error.message });
    }
});
router.put('/editUserById', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const userId = req.query.id;
        const updatedData = req.body;
        const result = await User.findByIdAndUpdate(userId, updatedData, { new: true });
        if (!result) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, message: 'User updated successfully', user: result });
    } catch (error) {
        console.error('Edit user error:', error);
        res.status(500).json({ success: false, message: 'Failed to update user', error: error.message });
    }
});

module.exports = router;
