const User = require('../models/userModel');

const getAllUsers = async (req, res) => {
    const users = await User.find().select('fullname email phone');
    res.json(users);
};

module.exports = { getAllUsers };