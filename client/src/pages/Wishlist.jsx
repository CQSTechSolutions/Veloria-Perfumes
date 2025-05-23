import React, { useEffect, useState } from 'react';
import { FiHeart, FiTrash2, FiShoppingBag, FiAlertCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/wishlist`,
        { headers: { Authorization: `Bearer ${token}` }}
      );

      if (response.data.success && response.data.wishlist) {
        setWishlistItems(response.data.wishlist.items || []);
      }
    } catch (error) {
      if(response.status == 404){
        // leave due to no items
      }
      else{
        console.error('Wishlist fetch error:', error);
        toast.error('Failed to fetch wishlist');
      }
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/wishlist/remove/${productId}`,
        { headers: { Authorization: `Bearer ${token}` }}
      );

      if (response.data.success) {
        setWishlistItems(current => 
          current.filter(item => item.product._id !== productId)
        );
        toast.success('Removed from wishlist');
      }
    } catch (error) {
      console.error('Remove from wishlist error:', error);
      toast.error('Failed to remove item');
    }
  };

  const addToCart = async (productId, name) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/cart/add`,
        { productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` }}
      );

      if (response.data.success) {
        toast.success(`${name} added to cart!`);
        await removeFromWishlist(productId);
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      toast.error('Failed to add to cart');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream paper-texture flex items-center justify-center">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="animate-pulse"
        >
          <FiHeart className="w-16 h-16 text-burgundy" />
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-cream paper-texture py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-serif text-burgundy flex items-center gap-3">
            <FiHeart className="w-8 h-8" />
            My Wishlist
          </h1>
          <Link 
            to="/collections"
            className="text-burgundy hover:text-gold transition-colors duration-200"
          >
            Continue Shopping
          </Link>
        </div>

        {!wishlistItems?.length ? (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-soft-white border border-gold/10 shadow-sm p-8 text-center"
          >
            <FiAlertCircle className="w-16 h-16 text-burgundy mx-auto mb-4" />
            <h2 className="text-2xl font-serif text-soft-black mb-2">Your wishlist is empty</h2>
            <p className="text-soft-black/70 mb-6">Start adding items you love!</p>
            <Link 
              to="/collections"
              className="inline-flex items-center justify-center px-6 py-3 btn-primary"
            >
              Explore Collections
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {wishlistItems.map((item) => (
                <motion.div
                  key={item.product._id}
                  layout
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-soft-white border border-gold/10 shadow-sm p-6 text-soft-black"
                >
                  <div className="relative aspect-w-16 aspect-h-9 mb-4">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="object-cover w-full h-48"
                      onError={(e) => {
                        e.target.src = 'https://placehold.co/300x300/f8f5f0/1a1a1a?text=No+Image';
                      }}
                    />
                  </div>

                  <h3 className="text-xl font-serif mb-2">{item.product.name}</h3>
                  <p className="text-soft-black/70 mb-4 line-clamp-2">{item.product.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-serif text-burgundy">₹{item.product.price?.toLocaleString()}</span>
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => addToCart(item.product._id, item.product.name)}
                        className="p-2 bg-burgundy/10 text-burgundy hover:bg-burgundy/20 transition-colors duration-200"
                        aria-label="Add to cart"
                      >
                        <FiShoppingBag className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => removeFromWishlist(item.product._id)}
                        className="p-2 bg-burgundy/10 text-burgundy hover:bg-burgundy/20 transition-colors duration-200"
                        aria-label="Remove from wishlist"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Wishlist; 