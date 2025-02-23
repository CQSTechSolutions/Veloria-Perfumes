const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Collection',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1
    }
});

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required for cart'],
        index: true
    },
    items: [cartItemSchema],
    total: {
        type: Number,
        default: 0
    }
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Calculate total before saving
cartSchema.pre('save', async function(next) {
    const cart = this;
    const populatedCart = await cart.populate('items.product');
    cart.total = cart.items.reduce((total, item) => {
        return total + (item.product.price * item.quantity);
    }, 0);
    if (this.isNew) {
        const User = mongoose.model('User');
        const userExists = await User.findById(this.user);
        if (!userExists) {
            next(new Error('User does not exist'));
            return;
        }
    }
    next();
});

module.exports = mongoose.model('Cart', cartSchema); 