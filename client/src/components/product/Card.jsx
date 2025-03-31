import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingBag, FiHeart, FiPlus, FiStar, FiEye } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const Card = ({ product, category, onCartUpdate, isInCart, onWishlistUpdate, isInWishlist }) => {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  if (product) {
    const {
      _id,
      name,
      price = 0,
      originalPrice,
      description = '',
      image = '/default-collection-image.jpg',
      rating = 5,
      reviews = 0,
      category: productCategory,
      stock = 0,
      isNew = false
    } = product;

    const calculateDiscount = () => {
      if (originalPrice && price < originalPrice) {
        return Math.round(((originalPrice - price) / originalPrice) * 100);
      }
      return null;
    };

    const discount = calculateDiscount();

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
        className="veloria-card relative h-full"
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Product Image with Action Buttons */}
        <div className="relative h-full flex flex-col">
          {/* Badges */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
            {discount && (
              <span className="bg-burgundy text-soft-white text-xs font-medium px-2 py-1 tracking-wider">
                {discount}% OFF
              </span>
            )}
            
            {Number(stock) <= 0 && (
              <span className="bg-soft-black/80 text-soft-white text-xs font-medium px-2 py-1 tracking-wider">
                SOLD OUT
              </span>
            )}
            
            {isNew && (
              <span className="bg-gold text-soft-black text-xs font-medium px-2 py-1 tracking-wider">
                NEW
              </span>
            )}
          </div>

          <Link to={`/product/${_id}`} className="block">
            <div className="aspect-square overflow-hidden border-b border-gold/10 bg-cream">
              <motion.img
                src={image}
                alt={name}
                className="w-full h-full object-cover"
                initial={false}
                animate={isHovering ? { scale: 1.08 } : { scale: 1 }}
                transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1.0] }}
                onError={(e) => {
                  e.target.src = 'https://placehold.co/300x300/f8f5f0/1a1a1a?text=Veloria';
                }}
              />
              
              {/* Quick view button overlay */}
              <AnimatePresence>
                {isHovering && (
                  <motion.div 
                    className="absolute inset-0 bg-soft-black/30 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link 
                      to={`/product/${_id}`}
                      className="bg-soft-white text-burgundy hover:bg-burgundy hover:text-soft-white transition-colors px-4 py-2 text-sm uppercase tracking-wider flex items-center gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <FiEye /> Quick View
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Link>

          {/* Product Info */}
          <div className="p-4 flex-grow flex flex-col">
            {/* Category */}
            {productCategory && (
              <div className="mb-1">
                {Array.isArray(productCategory) ? (
                  <span className="text-xs uppercase tracking-widest text-burgundy/80">
                    {productCategory[0]}
                  </span>
                ) : (
                  <span className="text-xs uppercase tracking-widest text-burgundy/80">
                    {productCategory}
                  </span>
                )}
              </div>
            )}

            {/* Title */}
            <Link to={`/product/${_id}`}>
              <h3 className="font-serif text-soft-black group-hover:text-burgundy transition-colors line-clamp-2 min-h-[2.5rem]">
                {name}
              </h3>
            </Link>

            {/* Rating */}
            <div className="flex items-center mt-1 mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <FiStar 
                    key={i} 
                    className={`w-3 h-3 ${i < (rating || 5) ? 'text-gold fill-current' : 'text-soft-black/20'}`} 
                  />
                ))}
              </div>
              <span className="text-xs text-soft-black/50 ml-2">
                ({reviews || 0})
              </span>
            </div>

            {/* Price */}
            <div className="mt-auto pt-2">
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-burgundy">₹{typeof price === 'number' ? price.toLocaleString() : price}</span>
                
                {discount && (
                  <span className="text-soft-black/50 text-xs line-through">
                    ₹{originalPrice?.toLocaleString()}
                  </span>
                )}
              </div>
              
              {Number(stock) > 0 && stock < 10 && (
                <div className="mt-2">
                  <div className="h-1 bg-soft-black/10 w-full">
                    <div 
                      className="h-1 bg-gold" 
                      style={{ 
                        width: `${Math.min(100, (stock / 10) * 100)}%`,
                      }}
                    ></div>
                  </div>
                  {stock < 5 && (
                    <p className="text-xs text-burgundy/80 mt-1">
                      Only {stock} left
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="absolute z-20 transition-all duration-300">
            {/* Wishlist button - top right */}
            <motion.button
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: isHovering || isInWishlist ? 1 : 0.8, 
                opacity: isHovering || isInWishlist ? 1 : 0,
                top: isHovering ? '0.75rem' : '1.5rem',
                right: isHovering ? '0.75rem' : '0.5rem'
              }}
              transition={{ duration: 0.2 }}
              className={`absolute top-3 right-3 p-2 rounded-full shadow-md ${
                isInWishlist
                ? 'bg-burgundy text-soft-white'
                : 'bg-soft-white text-burgundy hover:bg-burgundy hover:text-soft-white'
              } transition-colors`}
              onClick={handleToggleWishlist}
              aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
            >
              <FiHeart className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`} />
            </motion.button>
            
            {/* Add to cart button - bottom */}
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ 
                y: isHovering ? 0 : 20, 
                opacity: isHovering ? 1 : 0
              }}
              transition={{ duration: 0.3 }}
              onClick={handleAddToCart}
              disabled={isAddingToCart || stock <= 0}
              className={`absolute bottom-0 left-0 right-0 py-3 flex items-center justify-center gap-2 ${
                stock <= 0
                ? 'bg-soft-black/10 text-soft-black/30 cursor-not-allowed'
                : isAddingToCart
                  ? 'bg-burgundy/90 text-soft-white'
                  : 'bg-burgundy text-soft-white hover:bg-burgundy-dark'
              } transition-colors`}
              aria-label="Add to cart"
            >
              {isAddingToCart ? (
                <>
                  <span className="animate-pulse">Adding</span>
                  <span className="w-5 h-5 animate-spin border-2 border-soft-white/20 border-t-soft-white rounded-full"></span>
                </>
              ) : (
                <>
                  {stock > 0 ? (
                    <>
                      <FiShoppingBag className="w-4 h-4" /> {isInCart ? 'View in Cart' : 'Add to Cart'}
                    </>
                  ) : (
                    <>Sold Out</>
                  )}
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Category card display
  if (category) {
    return (
      <motion.div 
        className="veloria-card overflow-hidden group"
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
      >
        <Link to={category.link}>
          <div className="aspect-square overflow-hidden border-b border-gold/10">
            <motion.img 
              src={category.image} 
              alt={category.title} 
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.7 }}
              onError={(e) => {
                e.target.src = 'https://placehold.co/300x300/f8f5f0/1a1a1a?text=Veloria';
              }}
            />
            <div className="absolute inset-0 bg-soft-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="bg-soft-white px-6 py-2 text-burgundy font-medium transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                Browse Collection
              </div>
            </div>
          </div>
          <div className="p-4 text-center">
            <h3 className="font-serif text-soft-black group-hover:text-burgundy transition-colors">
              {category.title}
            </h3>
            <div className="w-10 h-0.5 bg-gold mx-auto mt-2"></div>
          </div>
        </Link>
      </motion.div>
    );
  }

  return null; // Fallback if neither product nor category is provided
};

export default Card;