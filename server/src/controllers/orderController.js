const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const Collection = require('../models/collectionModel');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

exports.createOrder = async (req, res) => {
    try {
        const { shippingAddress, items, totalAmount } = req.body;

        // Validate cart is not empty
        if (!items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Cart is empty'
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

                // Convert stock to number and validate
                const currentStock = parseInt(product.stock);
                if (isNaN(currentStock)) {
                    throw new Error(`Invalid stock value for product: ${product.name}`);
                }

                // Ensure stock is sufficient before updating
                if (currentStock < item.quantity) {
                    throw new Error(`Insufficient stock for product: ${product.name}`);
                }

                const newStock = currentStock - item.quantity;

                // Update stock and sold count
                const result = await Collection.findByIdAndUpdate(
                    item.product,
                    {
                        $set: { stock: newStock.toString() },
                        $inc: { soldCount: item.quantity }
                    },
                    { new: true }
                );

                if (!result) {
                    throw new Error(`Failed to update product: ${item.product}`);
                }

                return result;
            } catch (error) {
                console.error(`Error updating product ${item.product}:`, error);
                error.productId = item.product;
                throw error;
            }
        });

        // Wait for all product updates to complete
        const updateResults = await Promise.allSettled(updatePromises);

        // Check if any updates failed
        const failedUpdates = updateResults.filter(result => result.status === 'rejected');
        if (failedUpdates.length > 0) {
            console.error('Some product updates failed:', failedUpdates);
            
            // Implement rollback for failed updates
            for (const update of failedUpdates) {
                const failedItem = order.items.find(item => 
                    item.product._id.toString() === update.reason.productId
                );
                if (failedItem) {
                    try {
                        const product = await Collection.findById(failedItem.product._id);
                        if (product) {
                            const currentStock = parseInt(product.stock);
                            await Collection.findByIdAndUpdate(
                                failedItem.product._id,
                                {
                                    $set: { stock: (currentStock + failedItem.quantity).toString() },
                                    $inc: { soldCount: -failedItem.quantity }
                                }
                            );
                        }
                    } catch (rollbackError) {
                        console.error(`Rollback failed for product ${failedItem.product._id}:`, rollbackError);
                    }
                }
            }
            return res.status(500).json({
                success: false,
                message: 'Failed to update product stock'
            });
        }

        // Update payment info
        order.paymentInfo.razorpayPaymentId = razorpayPaymentId;
        order.paymentInfo.status = 'completed';
        order.status = 'processing';
        await order.save();

        // Clear the cart
        await Cart.findOneAndUpdate(
            { user: req.user._id },
            { $set: { items: [] } }
        );

        // Get updated order with populated items
        const updatedOrder = await Order.findById(orderId).populate({
            path: 'items.product',
            select: 'name price image description stock'
        });

        res.json({
            success: true,
            message: 'Payment verified and stock updated successfully',
            order: updatedOrder
        });
    } catch (error) {
        console.error('Verify payment error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error'
        });
    }
};

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