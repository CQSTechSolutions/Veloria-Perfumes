import express from 'express';
import { 
  createOrder, 
  getUserOrders, 
  getOrderDetails 
} from '../controllers/orderController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// All order routes require authentication
router.use(auth);

// @route   POST /api/orders
// @desc    Create a new order
// @access  Private
router.post('/', createOrder);

// @route   GET /api/orders
// @desc    Get user's order history
// @access  Private
router.get('/', getUserOrders);

// @route   GET /api/orders/recent
// @desc    Get user's recent orders (limited)
// @access  Private
router.get('/recent', getUserOrders); // Reusing the getUserOrders controller

// @route   GET /api/orders/:orderId
// @desc    Get order details
// @access  Private
router.get('/:orderId', getOrderDetails);

export default router;