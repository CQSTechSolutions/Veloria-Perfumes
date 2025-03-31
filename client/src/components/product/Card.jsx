import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingBag, FiHeart, FiPlus, FiStar } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const Card = ({ product, category, onCartUpdate, isInCart, onWishlistUpdate, isInWishlist }) => {
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  if (product) {
    const {
      _id,
      name,
      price = 0,
      description = '',
      image = '/default-collection-image.jpg',
      rating = 5,
      reviews = 0,
      category: productCategory,
      stock = 0
    } = product;

    const handleAddToCart = async () => {
      if (isAddingToCart) return;

      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to add items to cart');
        return;
      }

      if (stock <= 0) {
        toast.error('Product is out of stock');
        return;
      }

      const loadingToast = toast.loading('Adding to cart...');
      setIsAddingToCart(true);

      try {
        // Add to cart API call
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/cart/add`,
          { productId: _id, quantity: 1 },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success) {
          toast.dismiss(loadingToast);
          toast.success('Added to cart successfully');
          onCartUpdate?.();
        }
      } catch (error) {
        toast.dismiss(loadingToast);
        toast.error(error.response?.data?.message || 'Failed to add to cart');
      } finally {
        setIsAddingToCart(false);
      }
    };

    const handleToggleWishlist = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to add to wishlist');
        return;
      }

      try {
        await onWishlistUpdate(_id);
      } catch (error) {
        toast.error('Failed to update wishlist');
      }
    };

    return (
      <motion.div 
        className="bg-white rounded-lg shadow-sm overflow-hidden group"
        whileHover={{ y: -5 }}
        transition={{ duration: 0.2 }}
      >
        {/* Product Image with Action Buttons */}
        <div className="relative">
          <Link to={`/product/${_id}`}>
            <div className="aspect-square overflow-hidden">
              <img
                src={image}
                alt={name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.target.src = 'https://placehold.co/300x300/lightgray/gray?text=No+Image';
                }}
              />
            </div>
          </Link>

          {/* Quick Action Buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleToggleWishlist}
              className={`p-2 rounded-full shadow-md transition-all duration-300 ${
                isInWishlist 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FiHeart className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`} />
            </motion.button>
          </div>

          {/* Stock Badge */}
          {Number(stock) <= 0 && (
            <div className="absolute bottom-3 left-3 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">
              Out of Stock
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Category */}
          {productCategory && (
            <div className="mb-1">
              {Array.isArray(productCategory) ? (
                productCategory.map((cat, index) => (
                  <Link 
                    key={index} 
                    to={`/collections?category=${cat}`}
                    className="text-xs font-medium text-purple-600 hover:text-purple-800 mr-2"
                  >
                    {cat}
                  </Link>
                ))
              ) : (
                <Link 
                  to={`/collections?category=${productCategory}`}
                  className="text-xs font-medium text-purple-600 hover:text-purple-800"
                >
                  {productCategory}
                </Link>
              )}
            </div>
          )}

          {/* Title */}
          <Link to={`/product/${_id}`}>
            <h3 className="font-medium text-gray-900 mb-1 line-clamp-1 group-hover:text-purple-700 transition-colors">
              {name}
            </h3>
          </Link>

          {/* Description */}
          <p className="text-sm text-gray-500 mb-3 line-clamp-2">
            {description}
          </p>

          {/* Price and Rating */}
          <div className="flex items-center justify-between">
            <span className="font-bold text-gray-900">₹{typeof price === 'number' ? price.toLocaleString() : price}</span>
            
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <FiStar 
                  key={i} 
                  className={`w-3 h-3 ${i < (rating || 5) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                />
              ))}
            </div>
          </div>

          {/* View Details Button */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart || stock <= 0}
              className={`flex-1 py-2 px-4 rounded font-medium text-xs flex items-center justify-center gap-1 ${
                stock <= 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-purple-600 text-white hover:bg-purple-700'
              } transition`}
            >
              <FiShoppingBag className="w-3 h-3" />
              {isInCart ? 'In Cart' : 'Add to Cart'}
            </button>
            
            <Link 
              to={`/product/${_id}`}
              className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded font-medium text-xs hover:bg-gray-200 transition text-center"
            >
              View Details
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  if (category) {
    return (
      <motion.div 
        className="bg-white rounded-lg shadow-sm overflow-hidden group"
        whileHover={{ y: -5 }}
        transition={{ duration: 0.2 }}
      >
        <Link to={category.link}>
          <div className="aspect-square overflow-hidden">
            <img 
              src={category.image} 
              alt={category.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            />
          </div>
          <div className="p-4 text-center">
            <h3 className="font-medium text-gray-900 group-hover:text-purple-700 transition-colors">
              {category.title}
            </h3>
          </div>
        </Link>
      </motion.div>
    );
  }

  return null; // Fallback if neither product nor category is provided
};

export default Card;