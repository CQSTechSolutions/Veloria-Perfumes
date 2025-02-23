import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiStar, FiHeart, FiShoppingBag } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const CollectionsCard = ({ product, onCartUpdate }) => {
    if (!product) return null;

    const {
        _id,
        name,
        price = 0,
        description = '',
        image = '/default-collection-image.jpg',
        rating = 5,
        reviews = 0,
        category = 'Collection',
        stock = 0
    } = product;

    const handleAddToCart = async () => {
        // Show loading toast
        const loadingToast = toast.loading('Adding to cart...');

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.dismiss(loadingToast);
                toast.error('Please login to add items to cart', {
                    icon: '🔒',
                    duration: 3000,
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                });
                return;
            }

            if (stock <= 0) {
                toast.dismiss(loadingToast);
                toast.error('Product is out of stock', {
                    icon: '😔',
                    duration: 3000,
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                });
                return;
            }

            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/cart/add`,
                { 
                    productId: _id,
                    quantity: 1
                },
                { 
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                toast.dismiss(loadingToast);
                toast.success(
                    <div className="flex items-center gap-2">
                        <FiShoppingBag className="w-5 h-5" />
                        <span>{name} added to cart!</span>
                    </div>,
                    {
                        duration: 3000,
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                        },
                        iconTheme: {
                            primary: '#4ade80',
                            secondary: '#fff',
                        },
                    }
                );
                onCartUpdate?.();
            }
        } catch (error) {
            toast.dismiss(loadingToast);
            toast.error(
                error.response?.data?.message || 'Failed to add to cart',
                {
                    icon: '❌',
                    duration: 3000,
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                }
            );
            console.error('Add to cart error:', error);
        }
    };

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden group relative shadow-lg hover:shadow-xl transition-all duration-300 border border-white/10"
        >
            {/* Image Container */}
            <div className="relative h-72 overflow-hidden">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                        e.target.src = '/default-collection-image.jpg';
                    }}
                />
                
                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Category Badge */}
                <div className="absolute top-4 left-4 z-10">
                    <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-white text-sm font-medium shadow-lg border border-white/20">
                        {category}
                    </span>
                </div>

                {/* Rating Badge */}
                <div className="absolute top-4 right-4 z-10">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-400/90 backdrop-blur-md rounded-full shadow-lg">
                        <FiStar className="text-white w-4 h-4" />
                        <span className="text-white text-sm font-semibold">{rating?.toFixed(1) || '5.0'}</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="absolute bottom-4 right-4 flex gap-3 z-10">
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all duration-300 shadow-lg border border-white/20"
                    >
                        <FiHeart className="w-5 h-5" />
                    </motion.button>
                    <motion.button 
                        onClick={handleAddToCart}
                        disabled={stock <= 0}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-3 backdrop-blur-md rounded-full transition-all duration-300 shadow-lg border border-white/20
                            ${stock <= 0 
                                ? 'bg-gray-500/50 cursor-not-allowed text-gray-400' 
                                : 'bg-white/10 text-white hover:bg-white/20'}`}
                    >
                        <FiShoppingBag className="w-5 h-5" />
                    </motion.button>
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                <div className="mb-4">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors line-clamp-1">
                        {name}
                    </h3>
                    <p className="text-purple-200/80 text-sm line-clamp-2">
                        {description}
                    </p>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <p className="text-2xl font-bold text-white">
                                ₹{typeof price === 'number' ? price.toLocaleString() : '0'}
                            </p>
                            {stock > 0 ? (
                                <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">
                                    In Stock
                                </span>
                            ) : (
                                <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full">
                                    Out of Stock
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <p className="text-purple-300 text-sm">
                                {typeof reviews === 'number' ? reviews.toLocaleString() : '0'} reviews
                            </p>
                            <span className="text-purple-300/50">•</span>
                            <p className="text-purple-300 text-sm">
                                Stock: {stock}
                            </p>
                        </div>
                    </div>

                    <Link 
                        to={`/collection/${_id}`}
                        className="group/btn relative p-3 bg-purple-500/20 rounded-full text-purple-300 hover:bg-purple-500/30 hover:text-white transition-all duration-300 shadow-lg"
                    >
                        <FiArrowRight className="w-6 h-6 transform group-hover/btn:translate-x-1 transition-transform duration-300" />
                        <div className="absolute inset-0 bg-purple-400/20 rounded-full blur opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 -z-10" />
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default CollectionsCard;
