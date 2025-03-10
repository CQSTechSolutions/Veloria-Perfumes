import React, { useEffect, useState } from 'react';
import { FiShoppingCart, FiTrash2, FiMinus, FiPlus, FiAlertCircle, FiArrowLeft, FiClock, FiPackage } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Cart = () => {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const [orderHistory, setOrderHistory] = useState([]);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    phone: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const init = async () => {
      await fetchCart();
      await fetchOrderHistory();
    };
    init();
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

  const fetchOrderHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/orders/history`,
        { headers: { Authorization: `Bearer ${token}` }}
      );

      if (response.data.success) {
        console.log('Fetched order history:', response.data.orders);
        setOrderHistory(response.data.orders);
        setShowOrderHistory(true);
      }
    } catch (error) {
      console.error('Fetch order history error:', error);
      toast.error('Failed to fetch order history');
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

  const validateShippingAddress = () => {
    const errors = {};
    const fields = {
      fullName: 'Full Name',
      addressLine1: 'Address Line 1',
      city: 'City',
      state: 'State',
      postalCode: 'Postal Code',
      phone: 'Phone Number'
    };

    Object.entries(fields).forEach(([key, label]) => {
      if (!shippingAddress[key]?.trim()) {
        errors[key] = `${label} is required`;
      }
    });

    // Phone number validation
    if (shippingAddress.phone && !/^\d{10}$/.test(shippingAddress.phone.trim())) {
      errors.phone = 'Please enter a valid 10-digit phone number';
    }

    // Postal code validation
    if (shippingAddress.postalCode && !/^\d{6}$/.test(shippingAddress.postalCode.trim())) {
      errors.postalCode = 'Please enter a valid 6-digit postal code';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCheckout = async () => {
    if (!validateShippingAddress()) {
      toast.error('Please fill all required shipping details correctly');
      return;
    }

    try {
      setIsProcessing(true);
      const token = localStorage.getItem('token');
      
      console.log('Cart items:', cart.items);

      // Map cart items to the correct structure
      const formattedItems = cart.items.map(item => ({
        product: item.productId, // Use productId instead of product._id
        quantity: item.quantity,
        price: Number(item.price)
      }));

      // Create order with proper structure
      const orderResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/orders/create`,
        { 
          shippingAddress,
          items: formattedItems,
          totalAmount: Number(cart.total)
        },
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!orderResponse.data.success) {
        throw new Error(orderResponse.data.message);
      }

      const { order } = orderResponse.data;

      // Initialize Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: Math.round(Number(order.amount) * 100), // Ensure integer amount in paise
        currency: "INR",
        name: "Veloria Collections",
        description: "Payment for your order",
        order_id: order.razorpayOrderId,
        handler: async function(response) {
          try {
            const verifyResponse = await axios.post(
              `${import.meta.env.VITE_API_URL}/api/orders/verify`,
              {
                orderId: order._id,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature
              },
              { 
                headers: { 
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              }
            );

            if (verifyResponse.data.success) {
              toast.success('Payment successful! Order confirmed.');
              
              // Fetch updated cart and order history
              await Promise.all([
                fetchCart(),
                fetchOrderHistory()
              ]);

              // Reset shipping address
              setShippingAddress({
                fullName: '',
                addressLine1: '',
                addressLine2: '',
                city: '',
                state: '',
                postalCode: '',
                phone: ''
              });

              // Navigate to order history or show success message
              toast.success('Your order has been placed successfully!');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error('Payment verification failed. Please contact support.');
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: shippingAddress.fullName,
          contact: shippingAddress.phone
        },
        theme: {
          color: "#7c3aed"
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
          }
        }
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error.response?.data?.message || 'Failed to process checkout');
      setIsProcessing(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Order ID copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
      toast.error('Failed to copy order ID');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
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

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto space-y-8">
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

        {/* Show empty cart message if cart is empty */}
        {cart.items.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center border border-white/20 mb-8">
            <FiShoppingCart className="mx-auto text-white w-16 h-16 mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Your Cart is Empty</h2>
            <p className="text-purple-200 mb-6">Add some items to your cart and start shopping!</p>
            <Link
              to="/collections"
              className="inline-flex items-center gap-2 bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition duration-200"
            >
              <FiArrowLeft />
              Browse Collections
            </Link>
          </div>
        ) : (
          // Show cart items and checkout form if cart has items
          <>
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
                
                <button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="w-full bg-purple-600 text-white py-4 px-6 rounded-lg hover:bg-purple-700 transition duration-200 flex items-center justify-center gap-2"
                >
                  <span>{isProcessing ? 'Processing...' : 'Proceed to Checkout'}</span>
                </button>
              </div>
            </div>

            {/* Shipping Address Form */}
            <div className="mt-8 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6">Shipping Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    placeholder="Full Name *"
                    value={shippingAddress.fullName}
                    onChange={(e) => setShippingAddress({
                      ...shippingAddress,
                      fullName: e.target.value
                    })}
                    className={`w-full bg-white/5 border ${
                      validationErrors.fullName ? 'border-red-500' : 'border-white/10'
                    } rounded-lg px-4 py-2 text-white placeholder-white/50`}
                  />
                  {validationErrors.fullName && (
                    <p className="mt-1 text-red-400 text-sm">{validationErrors.fullName}</p>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Phone Number *"
                    value={shippingAddress.phone}
                    onChange={(e) => setShippingAddress({
                      ...shippingAddress,
                      phone: e.target.value
                    })}
                    className={`w-full bg-white/5 border ${
                      validationErrors.phone ? 'border-red-500' : 'border-white/10'
                    } rounded-lg px-4 py-2 text-white placeholder-white/50`}
                  />
                  {validationErrors.phone && (
                    <p className="mt-1 text-red-400 text-sm">{validationErrors.phone}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <input
                    type="text"
                    placeholder="Address Line 1 *"
                    value={shippingAddress.addressLine1}
                    onChange={(e) => setShippingAddress({
                      ...shippingAddress,
                      addressLine1: e.target.value
                    })}
                    className={`w-full bg-white/5 border ${
                      validationErrors.addressLine1 ? 'border-red-500' : 'border-white/10'
                    } rounded-lg px-4 py-2 text-white placeholder-white/50`}
                  />
                  {validationErrors.addressLine1 && (
                    <p className="mt-1 text-red-400 text-sm">{validationErrors.addressLine1}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <input
                    type="text"
                    placeholder="Address Line 2 (Optional)"
                    value={shippingAddress.addressLine2}
                    onChange={(e) => setShippingAddress({
                      ...shippingAddress,
                      addressLine2: e.target.value
                    })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/50"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="City *"
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({
                      ...shippingAddress,
                      city: e.target.value
                    })}
                    className={`w-full bg-white/5 border ${
                      validationErrors.city ? 'border-red-500' : 'border-white/10'
                    } rounded-lg px-4 py-2 text-white placeholder-white/50`}
                  />
                  {validationErrors.city && (
                    <p className="mt-1 text-red-400 text-sm">{validationErrors.city}</p>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="State *"
                    value={shippingAddress.state}
                    onChange={(e) => setShippingAddress({
                      ...shippingAddress,
                      state: e.target.value
                    })}
                    className={`w-full bg-white/5 border ${
                      validationErrors.state ? 'border-red-500' : 'border-white/10'
                    } rounded-lg px-4 py-2 text-white placeholder-white/50`}
                  />
                  {validationErrors.state && (
                    <p className="mt-1 text-red-400 text-sm">{validationErrors.state}</p>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Postal Code *"
                    value={shippingAddress.postalCode}
                    onChange={(e) => setShippingAddress({
                      ...shippingAddress,
                      postalCode: e.target.value
                    })}
                    className={`w-full bg-white/5 border ${
                      validationErrors.postalCode ? 'border-red-500' : 'border-white/10'
                    } rounded-lg px-4 py-2 text-white placeholder-white/50`}
                  />
                  {validationErrors.postalCode && (
                    <p className="mt-1 text-red-400 text-sm">{validationErrors.postalCode}</p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Order History Section - Always show if there are orders */}
        {orderHistory && orderHistory.length > 0 && (
          <div className="mt-12">
            <button
              onClick={() => setShowOrderHistory(!showOrderHistory)}
              className="flex items-center gap-2 text-white mb-6 hover:text-purple-300 transition-colors"
            >
              <FiClock className="w-5 h-5" />
              <span className="text-xl font-bold">
                Previous Orders ({orderHistory.length})
              </span>
            </button>

            <AnimatePresence>
              {showOrderHistory && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  {orderHistory.map((order) => (
                    <motion.div
                      key={order._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <FiPackage className="w-5 h-5 text-purple-300" />
                          <button
                            onClick={() => copyToClipboard(order._id)}
                            className="text-white font-semibold hover:text-purple-300 transition-colors flex items-center gap-2"
                          >
                            <span>Order ID</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                        </div>
                        <span className="text-purple-300">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="space-y-4">
                        {order.items.map((item) => (
                          <div
                            key={item._id}
                            className="flex items-center gap-4"
                          >
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div>
                              <h4 className="text-white font-medium">
                                {item.product.name}
                              </h4>
                              <p className="text-purple-300">
                                {item.quantity} x ₹{item.price.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                        <div className="text-purple-300">
                          Status: <span className="text-white">{order.status}</span>
                        </div>
                        <div className="text-white font-bold">
                          Total: ₹{order.totalAmount.toLocaleString()}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Cart;