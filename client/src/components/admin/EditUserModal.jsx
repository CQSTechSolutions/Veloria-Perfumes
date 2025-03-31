import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';

const EditUserModal = ({ user, isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: ''
    });

    useEffect(() => {
        console.log(user);
        if (isOpen && user) {
            setFormData({
                fullName: user.fullName || '',
                email: user.email || '',
                phone: user.phone || ''
            });
        }
    }, [isOpen, user]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md border border-gold/20 paper-texture">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-serif text-burgundy">Edit User</h2>
                    <button
                        onClick={onClose}
                        className="text-soft-black/70 hover:text-burgundy transition-colors"
                    >
                        <FiX size={24} />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-soft-black/70 mb-2">Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            className="w-full bg-cream/50 text-soft-black rounded-lg px-4 py-2 border border-gold/30 focus:outline-none focus:ring-2 focus:ring-burgundy"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-soft-black/70 mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full bg-cream/50 text-soft-black rounded-lg px-4 py-2 border border-gold/30 focus:outline-none focus:ring-2 focus:ring-burgundy"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-soft-black/70 mb-2">Phone</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full bg-cream/50 text-soft-black rounded-lg px-4 py-2 border border-gold/30 focus:outline-none focus:ring-2 focus:ring-burgundy"
                        />
                    </div>
                    
                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-soft-black/70 hover:text-burgundy transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-burgundy text-white rounded-lg hover:bg-burgundy/90 transition-colors"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditUserModal; 