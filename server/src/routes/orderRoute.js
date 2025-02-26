const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/authMiddleware');
const { 
    createOrder,
    verifyPayment,
    getOrderHistory
} = require('../controllers/orderController');

router.use(isAuthenticated);

router.post('/create', createOrder);
router.post('/verify', verifyPayment);
router.get('/history', getOrderHistory);

module.exports = router; 