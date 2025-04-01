import React, { useState, useEffect } from 'react';
import { FiX, FiUser, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { motion } from 'framer-motion';

const EditUserModal = ({ user, isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen && user) {
            setFormData({
                fullName: user.fullName || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || '',
                city: user.city || '',
                state: user.state || '',
                zipCode: user.zipCode || ''
            });
        }
    }, [isOpen, user]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            await onSave(formData);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-soft-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <motion.div 
                className="bg-white rounded-lg w-full max-w-2xl border border-gold/20 shadow-xl overflow-hidden"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-6 bg-gradient-to-r from-cream to-soft-white border-b border-gold/10">
                    <h2 className="text-2xl font-serif text-burgundy flex items-center">
                        <FiUser className="mr-2" /> Edit User
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-soft-black/70 hover:text-burgundy transition-colors p-2 rounded-full hover:bg-burgundy/10"
                    >
                        <FiX size={24} />
                    </button>
                </div>
                
                <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Personal Information */}
                            <div className="space-y-4 md:col-span-2">
                                <h3 className="text-lg font-medium text-soft-black flex items-center">
                                    <FiUser className="mr-2 text-burgundy" /> Personal Information
                                </h3>
                                
                                <div>
                                    <label className="block text-soft-black/70 mb-2 text-sm">Full Name</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FiUser className="text-burgundy/70" />
                                        </div>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 bg-cream/30 text-soft-black rounded-lg border border-gold/30 focus:outline-none focus:ring-2 focus:ring-burgundy/30"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            {/* Contact Information */}
                            <div>
                                <label className="block text-soft-black/70 mb-2 text-sm">Email</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiMail className="text-burgundy/70" />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-cream/30 text-soft-black rounded-lg border border-gold/30 focus:outline-none focus:ring-2 focus:ring-burgundy/30"
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-soft-black/70 mb-2 text-sm">Phone</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiPhone className="text-burgundy/70" />
                                    </div>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-cream/30 text-soft-black rounded-lg border border-gold/30 focus:outline-none focus:ring-2 focus:ring-burgundy/30"
                                    />
                                </div>
                            </div>
                            
                            {/* Address Information */}
                            <div className="md:col-span-2 pt-2">
                                <h3 className="text-lg font-medium text-soft-black flex items-center mb-4">
                                    <FiMapPin className="mr-2 text-burgundy" /> Address Information
                                </h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-soft-black/70 mb-2 text-sm">Street Address</label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-cream/30 text-soft-black rounded-lg border border-gold/30 focus:outline-none focus:ring-2 focus:ring-burgundy/30"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-soft-black/70 mb-2 text-sm">City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-cream/30 text-soft-black rounded-lg border border-gold/30 focus:outline-none focus:ring-2 focus:ring-burgundy/30"
                                        />
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-soft-black/70 mb-2 text-sm">State</label>
                                            <input
                                                type="text"
                                                name="state"
                                                value={formData.state}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 bg-cream/30 text-soft-black rounded-lg border border-gold/30 focus:outline-none focus:ring-2 focus:ring-burgundy/30"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-soft-black/70 mb-2 text-sm">Zip Code</label>
                                            <input
                                                type="text"
                                                name="zipCode"
                                                value={formData.zipCode}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 bg-cream/30 text-soft-black rounded-lg border border-gold/30 focus:outline-none focus:ring-2 focus:ring-burgundy/30"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                
                <div className="flex justify-end items-center gap-3 p-6 bg-gradient-to-r from-cream to-soft-white border-t border-gold/10">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 border border-burgundy/20 text-burgundy rounded-lg hover:bg-burgundy/10 transition-colors"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="px-5 py-2.5 bg-burgundy text-white rounded-lg hover:bg-burgundy/90 transition-colors shadow-sm flex items-center"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                                Saving...
                            </>
                        ) : (
                            'Save Changes'
                        )}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default EditUserModal; 