import React, { useEffect, useState } from 'react';
import { FiShoppingCart, FiTrash2, FiMinus, FiPlus, FiAlertCircle, FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Cart = () => {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/cart`,
        { headers: { Authorization: `Bearer ${token}` }}
      );

      if (response.data.success) {
        setCart(response.data.cart);
      }
    } catch (error) {
      toast.error('Failed to fetch cart', {
        icon: '❌',
        style: { background: '#333', color: '#fff' }
      });
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    const loadingToast = toast.loading('Updating cart...');
    try {
      setUpdating(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/cart/update/${itemId}`,
        { quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` }}
      );

      if (response.data.success) {
        setCart(response.data.cart);
        toast.dismiss(loadingToast);
        toast.success('Cart updated successfully', {
          icon: '✅',
          style: { background: '#333', color: '#fff' }
        });
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error.response?.data?.message || 'Failed to update cart', {
        icon: '❌',
        style: { background: '#333', color: '#fff' }
      });
    } finally {
      setUpdating(false);
    }
  };

  const removeItem = async (itemId) => {
    const loadingToast = toast.loading('Removing item...');
    try {
      setUpdating(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/cart/remove/${itemId}`,
        { headers: { Authorization: `Bearer ${token}` }}
      );

      if (response.data.success) {
        setCart(prev => ({
          ...prev,
          items: prev.items.filter(item => item.id !== itemId)
        }));
        toast.dismiss(loadingToast);
        toast.success('Item removed from cart', {
          icon: '🗑️',
          style: { background: '#333', color: '#fff' }
        });
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Failed to remove item', {
        icon: '❌',
        style: { background: '#333', color: '#fff' }
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (!localStorage.getItem('token')) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 flex items-center justify-center p-6"
      >
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-md w-full text-center border border-white/20">
          <FiShoppingCart className="mx-auto text-white w-16 h-16 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Please Log In to View Your Cart</h2>
          <p className="text-purple-200 mb-6">Sign in to access your shopping cart and continue shopping.</p>
          <Link
            to="/account"
            className="inline-block bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition duration-200"
          >
            Sign In
          </Link>
        </div>
      </motion.div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 flex items-center justify-center p-6"
      >
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-md w-full text-center border border-white/20">
          <FiShoppingCart className="mx-auto text-white w-16 h-16 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Your Cart is Empty</h2>
          <p className="text-purple-200 mb-6">Add some items to your cart and start shopping!</p>
          <Link
            to="/collections"
            className="inline-flex items-center gap-2 bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition duration-200"
          >
            <FiArrowLeft />
            Continue Shopping
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Shopping Cart</h1>
          <Link
            to="/collections"
            className="inline-flex items-center gap-2 text-purple-200 hover:text-white transition-colors"
          >
            <FiArrowLeft />
            Continue Shopping
          </Link>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20">
          <div className="divide-y divide-white/10">
            {cart.items.map(item => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center p-6 gap-6"
              >
                <div className="relative h-24 w-24 flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  {item.stock < 5 && (
                    <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-bl-lg rounded-tr-lg">
                      Low Stock
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">{item.name}</h3>
                  <p className="text-purple-200 text-sm mb-2">₹{item.price.toLocaleString()}</p>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center bg-white/5 rounded-lg border border-white/10">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                        disabled={updating || item.quantity <= 1}
                        className="p-2 text-purple-200 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FiMinus className="w-4 h-4" />
                      </button>
                      <span className="px-4 text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={updating || item.quantity >= item.stock}
                        className="p-2 text-purple-200 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FiPlus className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <button
                      onClick={() => removeItem(item.id)}
                      disabled={updating}
                      className="p-2 text-red-400 hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xl font-bold text-white">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="bg-white/5 p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-purple-200">Subtotal</span>
              <span className="text-white text-lg">₹{cart.total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-purple-200">Shipping</span>
              <span className="text-white text-lg">Free</span>
            </div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-semibold text-white">Total</span>
              <span className="text-2xl font-bold text-white">₹{cart.total.toLocaleString()}</span>
            </div>
            
            <button className="w-full bg-purple-600 text-white py-4 px-6 rounded-lg hover:bg-purple-700 transition duration-200 flex items-center justify-center gap-2">
              <span>Proceed to Checkout</span>
              <FiArrowLeft className="w-5 h-5 transform rotate-180" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Cart;