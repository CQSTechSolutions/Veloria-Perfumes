import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiStar, FiHeart, FiShoppingBag } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const CollectionsCard = ({ 
    product, 
    onCartUpdate, 
    isInCart, 
    onWishlistUpdate,
    isInWishlist 
}) => {
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
        const loadingToast = toast.loading('Adding to cart...');
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.dismiss(loadingToast);
                toast.error('Please login to add items to cart');
                return;
            }

            if (stock <= 0) {
                toast.dismiss(loadingToast);
                toast.error('Product is out of stock');
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
        }
    };

    const handleToggleWishlist = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Please login to manage wishlist');
                return;
            }

            const loadingToast = toast.loading(
                isInWishlist ? 'Removing from wishlist...' : 'Adding to wishlist...'
            );

            await onWishlistUpdate(_id);
            toast.dismiss(loadingToast);

        } catch (error) {
            toast.error('Failed to update wishlist');
        }
    };

    return (
        <motion.div 
            className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20 group relative"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
        >
            <div className="relative">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleToggleWishlist}
                        className={`p-3 rounded-full backdrop-blur-md transition-all duration-300 ${
                            isInWishlist 
                                ? 'bg-red-500 text-white' 
                                : 'bg-white/20 text-white hover:bg-white/30'
                        }`}
                    >
                        <FiHeart 
                            className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} 
                        />
                    </motion.button>
                    {isInCart && (
                        <div className="p-3 rounded-full bg-green-500/20 text-green-400 backdrop-blur-md">
                            <FiShoppingBag className="w-5 h-5" />
                        </div>
                    )}
                </div>
            </div>

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

                    <div className="flex gap-2">
                        {!isInCart && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleAddToCart}
                                disabled={stock <= 0}
                                className={`p-3 rounded-full ${
                                    stock <= 0
                                        ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
                                        : 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30'
                                } transition-all duration-300`}
                            >
                                <FiShoppingBag className="w-5 h-5" />
                            </motion.button>
                        )}
                        <Link 
                            to={`/collection/${_id}`}
                            className="p-3 bg-purple-500/20 rounded-full text-purple-300 hover:bg-purple-500/30 transition-all duration-300"
                        >
                            <FiArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default CollectionsCard;
