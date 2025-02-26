const User = require('../models/userModel');
const Collection = require('../models/collectionModel');
const Order = require('../models/orderModel');
// const { all } = require('../routes/orderRoute');

const getStats = async (req, res) => {
    try {
        // Get counts
        const totalUsers = await User.countDocuments();
        const totalOrders = await Order.countDocuments();
        const totalProducts = await Collection.countDocuments();

        // Calculate total revenue from all orders
        // const orders = await Order.find({ status: 'delivered' });
        const orders = await Order.find();
        const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

        // Format response to match dashboard expectations
        const stats = {
            success: true,
            stats: {
                totalUsers,
                totalOrders,
                totalProducts,
                totalRevenue
            },
            lastUpdated: new Date()
        };

        res.json(stats);
    } catch (error) {
        console.error('Stats Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching stats', 
            error: error.message 
        });
    }
};

module.exports = { getStats };
