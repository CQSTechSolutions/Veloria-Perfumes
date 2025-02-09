const User = require('../models/userModel');

const getAllUsers = async (req, res) => {
    const users = await User.find().select('fullname email phone');
    res.json(users);
};

const getUserById = async (req, res) => {
    const {userId} = req.query;
    const user = await User.findById(userId).select('-password');
    res.json(user);
};

module.exports = { getAllUsers, getUserById };