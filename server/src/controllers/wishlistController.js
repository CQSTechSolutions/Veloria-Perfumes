const Wishlist = require('../models/wishlistModel');
const Collection = require('../models/collectionModel');

exports.getWishlist = async (req, res) => {
    try {
        let wishlist = await Wishlist.findOne({ user: req.user._id })
            .populate('items.product');

        if (!wishlist) {
            wishlist = await Wishlist.create({
                user: req.user._id,
                items: []
            });
        }

        res.json({
            success: true,
            wishlist: {
                items: wishlist.items
                    .filter(item => item.product)
                    .map(item => ({
                        product: {
                            _id: item.product._id,
                            name: item.product.name,
                            price: item.product.price,
                            description: item.product.description,
                            image: item.product.image,
                            stock: item.product.stock
                        }
                    }))
            }
        });
    } catch (error) {
        console.error('Get wishlist error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.addToWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user._id;

        let wishlist = await Wishlist.findOne({ user: userId });
        if (!wishlist) {
            wishlist = new Wishlist({ user: userId, items: [] });
        }

        // Check if product already in wishlist
        const isProductInWishlist = wishlist.items.some(item => 
            item.product.toString() === productId
        );

        if (!isProductInWishlist) {
            wishlist.items.push({ product: productId });
            await wishlist.save();
        }

        res.json({
            success: true,
            message: 'Product added to wishlist'
        });
    } catch (error) {
        console.error('Add to wishlist error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        const wishlist = await Wishlist.findOne({ user: req.user._id });

        if (!wishlist) {
            return res.status(404).json({ success: false, message: 'Wishlist not found' });
        }

        wishlist.items = wishlist.items.filter(item => 
            item.product.toString() !== productId
        );

        await wishlist.save();

        res.json({
            success: true,
            message: 'Product removed from wishlist'
        });
    } catch (error) {
        console.error('Remove from wishlist error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};