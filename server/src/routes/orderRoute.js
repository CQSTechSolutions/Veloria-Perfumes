const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middlewares/authMiddleware');
const { createOrder,verifyPayment,getOrderHistory,getAllOrders,updateOrderStatus } = require('../controllers/orderController');

router.use(isAuthenticated);
router.post('/create', createOrder);
router.post('/verify', verifyPayment);
router.get('/history', getOrderHistory);

router.use(isAdmin);
router.get('/getallorders', getAllOrders);
router.put('/updateorderstatus/:id', updateOrderStatus);

module.exports = router; 