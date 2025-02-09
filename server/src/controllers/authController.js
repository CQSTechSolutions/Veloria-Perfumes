const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    try {
        const { fullName, email, phone, password } = req.body;
        const user = new User({ fullName, email, phone, password });
        await user.save();
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ message: 'User registered successfully', token, user });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token, user });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { register, login };