const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

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

// New endpoint for updating a user's own profile
const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            fullName,
            email,
            phone,
            countryCode,
            address,
            city,
            state,
            zipCode,
            password
        } = req.body;

        // Basic validation
        if (!fullName || !email) {
            return res.status(400).json({
                success: false,
                message: 'Name and email are required'
            });
        }

        // Check if another user already has this email
        const existingUser = await User.findOne({ email, _id: { $ne: userId } });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email address is already in use'
            });
        }

        // Prepare update data
        const updateData = {
            fullName,
            email,
            phone,
            countryCode,
            address,
            city,
            state,
            zipCode,
            // Check if profile is now complete
            isProfileComplete: Boolean(address && city && state && zipCode)
        };

        // If password was provided, hash it
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        // Update the user
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: updatedUser
        });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update profile',
            error: error.message
        });
    }
};

module.exports = { 
    getAllUsers, 
    getUserById, 
    deleteUserById, 
    editUserById,
    updateProfile
};