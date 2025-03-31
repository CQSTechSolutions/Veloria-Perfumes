const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const Collection = require('../models/collectionModel');
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay with error handling for missing keys
let razorpay;
try {
    if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
        razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });
        console.log('Razorpay initialized successfully');
    } else {
        console.warn('Razorpay keys missing from environment variables');
        // Initialize with dummy values for development
        razorpay = {
            orders: {
                create: async () => ({ 
                    id: `mock_order_${Date.now()}` 
                })
            }
        };
    }
} catch (error) {
    console.error('Failed to initialize Razorpay:', error);
    // Initialize with dummy implementation
    razorpay = {
        orders: {
            create: async () => ({ 
                id: `mock_order_${Date.now()}` 
            })
        }
    };
}

exports.createOrder = async (req, res) => {
    try {
        let { shippingAddress, items, totalAmount } = req.body;

        // Validate cart is not empty
        if (!items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Cart is empty'
            });
        }

        // Use stored user address if no shipping address is provided
        if (!shippingAddress || Object.keys(shippingAddress).length === 0) {
            const user = req.user;
            
            // Check if user has a complete address
            if (user.address && user.city && user.state && user.zipCode) {
                shippingAddress = {
                    fullName: user.fullName,
                    addressLine1: user.address,
                    city: user.city,
                    state: user.state,
                    postalCode: user.zipCode,
                    phone: user.phone || ''
                };
            } else {
                // If address is incomplete, require it from the client
                return res.status(400).json({
                    success: false,
                    message: 'Shipping address is required'
                });
            }
        }

        // Validate shipping address
        if (!shippingAddress.fullName || !shippingAddress.addressLine1 || 
            !shippingAddress.city || !shippingAddress.state || !shippingAddress.postalCode) {
            return res.status(400).json({
                success: false,
                message: 'Complete shipping address is required'
            });
        }

        // Validate items structure and convert amounts to integers
        const validatedItems = [];
        for (const item of items) {
            if (!item.product || !item.quantity || !item.price) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid item structure'
                });
            }

            // Validate product exists and populate stock
            const product = await Collection.findById(item.product).select('name stock');
            if (!product) {
                return res.status(400).json({
                    success: false,
                    message: `Product not found: ${item.product}`
                });
            }


            if (!product.stock) {
                return res.status(400).json({
                    success: false,
                    message: `Stock information not available for product: ${product.name}`
                });
            }

            // Validate stock is sufficient
            const currentStock = parseInt(product.stock);
            if (isNaN(currentStock)) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid stock value for product: ${product.name}`
                });
            }

            if (currentStock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for product: ${product.name}. Available: ${currentStock}`
                });
            }

            validatedItems.push({
                product: item.product,
                quantity: Number(item.quantity),
                price: Math.round(Number(item.price))
            });
        }

        // Convert total amount to integer (paise)
        const amountInPaise = Math.round(Number(totalAmount) * 100);

        // Create Razorpay order
        const razorpayOrder = await razorpay.orders.create({
            amount: amountInPaise,
            currency: 'INR',
            receipt: `order_${Date.now()}`
        });

        // Create order in database
        const order = new Order({
            user: req.user._id,
            items: validatedItems,
            shippingAddress,
            totalAmount: Number(totalAmount),
            paymentInfo: {
                razorpayOrderId: razorpayOrder.id,
                status: 'pending'
            }
        });

        await order.save();

        res.json({
            success: true,
            order: {
                _id: order._id,
                razorpayOrderId: razorpayOrder.id,
                amount: totalAmount
            }
        });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Failed to create order'
        });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const { 
            orderId,
            razorpayOrderId, 
            razorpayPaymentId,
            razorpaySignature 
        } = req.body;

        // Find the order and populate product details
        const order = await Order.findById(orderId).populate('items.product');
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Verify signature
        const body = razorpayOrderId + "|" + razorpayPaymentId;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        const isAuthentic = expectedSignature === razorpaySignature;

        if (!isAuthentic) {
            order.paymentInfo.status = 'failed';
            await order.save();
            return res.status(400).json({
                success: false,
                message: 'Payment verification failed'
            });
        }

        // Update product quantities first - with better error handling
        const updatePromises = order.items.map(async (item) => {
            try {
                const product = await Collection.findById(item.product).select('name stock soldCount');
                if (!product) {
                    throw new Error(`Product not found: ${item.product}`);
                }

                if (!product.stock) {
                    throw new Error(`Stock information not available for product: ${product.name}`);
                }

                const currentStock = parseInt(product.stock);
                if (isNaN(currentStock)) {
                    throw new Error(`Invalid stock value for product: ${product.name}`);
                }

                if (currentStock < item.quantity) {
                    throw new Error(`Insufficient stock for product: ${product.name}. Available: ${currentStock}`);
                }

                product.stock = currentStock - item.quantity;
                product.soldCount = parseInt(product.soldCount) + item.quantity;
                await product.save();
            } catch (error) {
                console.error(`Error updating stock for product: ${item.product}`, error);
            }
        });

        await Promise.all(updatePromises);

        order.paymentInfo.status = 'completed';
        await order.save();

        res.json({
            success: true,
            message: 'Payment verified and stock updated successfully'
        });
    } catch (error) {
        console.error('Verify payment error:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Failed to verify payment'
        });
    }
};

// Add the missing controller functions
exports.getOrderHistory = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate({
                path: 'items.product',
                model: 'Collection',
                select: 'name price image description'
            })
            .sort('-createdAt');

        const formattedOrders = orders.map(order => ({
            _id: order._id,
            items: order.items.map(item => ({
                _id: item._id,
                product: {
                    _id: item.product?._id,
                    name: item.product?.name || 'Product Not Found',
                    image: item.product?.image || '',
                },
                quantity: item.quantity,
                price: item.price
            })),
            totalAmount: order.totalAmount,
            status: order.status,
            paymentStatus: order.paymentInfo.status,
            shippingAddress: order.shippingAddress,
            createdAt: order.createdAt
        }));

        res.json({
            success: true,
            orders: formattedOrders
        });
    } catch (error) {
        console.error('Get order history error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch order history'
        });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'fullName email')
            .populate('items.product')
            .sort({ createdAt: -1 });
            
        res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        console.error('Error fetching all orders:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching orders',
            error: error.message
        });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        const order = await Order.findByIdAndUpdate(
            id, 
            { status }, 
            { new: true }
        );
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        
        res.json({ 
            success: true, 
            order 
        });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update order status',
            error: error.message
        });
    }
};

exports.getRecentOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'fullName email')
            .populate('items.product')
            .sort({ createdAt: -1 })
            .limit(10);

        res.json({
            success: true,
            orders
        });
    } catch (error) {
        console.error('Error fetching recent orders:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching recent orders',
            error: error.message
        });
    }
};