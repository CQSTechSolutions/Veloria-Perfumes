const Cart = require('../models/cartModel');
const Collection = require('../models/collectionModel');

exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id })
            .populate('items.product');

        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        res.json({
            success: true,
            cart: {
                items: cart.items.map(item => ({
                    id: item._id,
                    productId: item.product._id,
                    name: item.product.name,
                    price: item.product.price,
                    image: item.product.image,
                    quantity: item.quantity,
                    stock: item.product.stock
                })),
                total: cart.total
            }
        });
    } catch (error) {
        console.error('Cart fetch error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user._id;

        console.log('User ID:', userId);
        console.log('Request Body:', req.body);

        // Validate product exists
        const product = await Collection.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Check stock
        if (product.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: 'Not enough stock available'
            });
        }

        // Find or create cart
        let cart = await Cart.findOne({ user: userId });
        
        if (!cart) {
            // Create new cart with explicit user ID
            cart = new Cart({
                user: userId,
                items: [{
                    product: productId,
                    quantity: quantity
                }]
            });
        } else {
            // Check if product already in cart
            const existingItem = cart.items.find(item => 
                item.product.toString() === productId
            );

            if (existingItem) {
                // Update quantity if product exists
                existingItem.quantity += quantity;
            } else {
                // Add new item if product doesn't exist
                cart.items.push({
                    product: productId,
                    quantity: quantity
                });
            }
        }

        await cart.save();
        await cart.populate('items.product');

        res.json({
            success: true,
            message: 'Item added to cart',
            cart: {
                items: cart.items.map(item => ({
                    id: item._id,
                    productId: item.product._id,
                    name: item.product.name,
                    price: item.product.price,
                    image: item.product.image,
                    quantity: item.quantity,
                    stock: item.product.stock
                })),
                total: cart.total
            }
        });
    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to add item to cart'
        });
    }
};

exports.updateCartItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        const { quantity } = req.body;

        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        const cartItem = cart.items.id(itemId);
        if (!cartItem) {
            return res.status(404).json({ success: false, message: 'Item not found in cart' });
        }

        // Validate stock
        const product = await Collection.findById(cartItem.product);
        if (product.stock < quantity) {
            return res.status(400).json({ success: false, message: 'Not enough stock' });
        }

        if (quantity <= 0) {
            cart.items.pull(itemId);
        } else {
            cartItem.quantity = quantity;
        }

        await cart.save();
        await cart.populate('items.product');

        res.json({
            success: true,
            cart: {
                items: cart.items.map(item => ({
                    id: item._id,
                    productId: item.product._id,
                    name: item.product.name,
                    price: item.product.price,
                    image: item.product.image,
                    quantity: item.quantity,
                    stock: item.product.stock
                })),
                total: cart.total
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const { itemId } = req.params;
        
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        cart.items.pull(itemId);
        await cart.save();

        res.json({
            success: true,
            message: 'Item removed from cart',
            cartId: itemId
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};