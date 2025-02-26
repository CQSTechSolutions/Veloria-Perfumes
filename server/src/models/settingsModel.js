const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    siteName: {
        type: String,
        required: true,
        default: 'Veloria Perfumes'
    },
    siteDescription: {
        type: String,
        required: true,
        default: 'Luxury Perfumes Online Store'
    },
    contactEmail: {
        type: String,
        required: true,
        default: 'contact@veloria.com'
    },
    phoneNumber: {
        type: String,
        required: true,
        default: '+1234567890'
    },
    address: {
        type: String,
        required: true,
        default: '123 Perfume Street, Fragrance City'
    },
    currency: {
        type: String,
        required: true,
        default: 'INR',
        enum: ['INR', 'USD', 'EUR']
    },
    taxRate: {
        type: Number,
        required: true,
        default: 18
    },
    shippingFee: {
        type: Number,
        required: true,
        default: 100
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema); 