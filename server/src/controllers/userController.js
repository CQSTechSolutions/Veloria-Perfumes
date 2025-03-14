const User = require('../models/userModel');

const getAllUsers = async (req, res) => {
    const users = await User.find().select('fullName email phone');
    res.json(users);
};

const getUserById = async (req, res) => {
    const {userId} = req.query;
    const user = await User.findById(userId).select('-password');
    res.json(user);
};

const deleteUserById = async (req, res) => {
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
};

const editUserById = async (req, res) => {
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
};


module.exports = { getAllUsers, getUserById , deleteUserById, editUserById};