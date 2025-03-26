const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const isAuthenticated = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        let token; // Declare token outside the if block

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Please login to access this resource'
            });
        }

        token = authHeader.split(' ')[1]; // Assign token here

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Please login to access this resource'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('JWT Verification Error:', error, 'Token:', token); // Log token here
        res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};
const isAdmin = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        let token; // Declare token OUTSIDE the if block

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(403).json({
                success: false,
                message: 'Please provide a valid token'
            });
        }

        token = authHeader.split(' ')[1]; // Assign token INSIDE the if block

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        const adminIds = process.env.ADMIN_ID.split(',');

        console.log(process.env.ADMIN_ID);
        console.log(decoded.id);
        console.log(userId, adminIds);

        if (adminIds.includes(userId)) {
            next();
        } else {
            return res.status(403).json({
                success: false,
                message: 'Access forbidden - Admin privileges required'
            });
        }
    } catch (error) {
        console.error('Admin auth error:', error, 'Token:', token); // Log token here
        return res.status(403).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};

module.exports = { isAuthenticated, isAdmin };