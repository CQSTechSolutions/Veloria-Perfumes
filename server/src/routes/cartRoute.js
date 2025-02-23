const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/authMiddleware');
const cartController = require('../controllers/cartController');

// Ensure all routes use isAuthenticated middleware
router.use(isAuthenticated);

router.get('/', cartController.getCart);
router.post('/add', cartController.addToCart);
router.put('/update/:itemId', cartController.updateCartItem);
router.delete('/remove/:itemId', cartController.removeFromCart);

module.exports = router;
