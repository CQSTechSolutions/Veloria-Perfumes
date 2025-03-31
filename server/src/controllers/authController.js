const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    try {
        const { fullName, email, phone, password } = req.body;
        
        if (!fullName || !email || !phone || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }
        const user = new User({ fullName, email, phone, password });
        const savedUser = await user.save();
        const token = jwt.sign({ id: savedUser._id, admin: false }, process.env.JWT_SECRET, { expiresIn: '1h' });

        const userResponse = savedUser.toObject();
        delete userResponse.password;
        
        res.status(201).json({ 
            success: true,
            message: 'User registered successfully', 
            token, 
            user: userResponse 
        });

    } catch (error) {
        console.error('Registration error:', error);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        res.status(500).json({ 
            success: false,
            message: 'Registration failed', 
            error: error.message 
        });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check if user is admin - handle undefined ADMIN_ID
        let isAdmin = false;
        if (process.env.ADMIN_ID) {
            const adminIds = process.env.ADMIN_ID.split(',');
            isAdmin = adminIds.includes(user._id.toString());
        }

        const token = jwt.sign({ id: user._id, admin: isAdmin }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(200).json({ 
            success: true,
            message: 'Login successful', 
            token, 
            user: userResponse 
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Login failed', 
            error: error.message 
        });
    }
}

module.exports = { register, login };