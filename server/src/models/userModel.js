const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true,
    },
    phone: {
        type: String,
        required: false,
    },
    countryCode: {
        type: String,
        default: '+91'
    },
    password: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        default: ''
    },
    city: {
        type: String,
        default: ''
    },
    state: {
        type: String,
        default: ''
    },
    zipCode: {
        type: String,
        default: ''
    },
    isProfileComplete: {
        type: Boolean,
        default: false
    }
},{timestamps: true});

userSchema.pre('save', async function (next) {
    try {
        // Only hash the password if it has been modified (or is new)
        if (!this.isModified('password')) {
            return next();
        }

        // Generate salt
        const salt = await bcrypt.genSalt(10);
        
        // Hash password
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Add a method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
