const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/authMiddleware');
const { getWishlist, addToWishlist, removeFromWishlist } = require('../controllers/wishlistController');

router.use(isAuthenticated);
router.get('/', getWishlist);
router.post('/add/:productId', addToWishlist);
router.delete('/remove/:productId', removeFromWishlist);

module.exports = router;
