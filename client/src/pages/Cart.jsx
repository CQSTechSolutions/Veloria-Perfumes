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
      await fetchUserProfile();
    };
    init();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) return;
      
      const payload = JSON.parse(atob(tokenParts[1]));
      const userId = payload.id;

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/getUserById?userId=${userId}`,
        { headers: { Authorization: `Bearer ${token}` }}
      );

      if (response.data) {
        if (response.data.address && response.data.city && response.data.state && response.data.zipCode) {
          setShippingAddress({
            fullName: response.data.fullName || '',
            addressLine1: response.data.address || '',
            addressLine2: '',
            city: response.data.city || '',
            state: response.data.state || '',
            postalCode: response.data.zipCode || '',
            phone: response.data.phone || ''
          });
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

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
        setCart(response.data.cart || { items: [], total: 0 });
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCart({ items: [], total: 0 });
      
      if (error.response && error.response.status !== 404) {
        toast.error('Failed to fetch cart');
      }
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
        toast.success('Cart updated successfully');
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error.response?.data?.message || 'Failed to update cart');
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
        setCart(response.data.cart);
        toast.dismiss(loadingToast);
        toast.success('Item removed from cart');
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Failed to remove item');
    } finally {
      setUpdating(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error when field is being edited
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!shippingAddress.fullName) errors.fullName = 'Full name is required';
    if (!shippingAddress.addressLine1) errors.addressLine1 = 'Address is required';
    if (!shippingAddress.city) errors.city = 'City is required';
    if (!shippingAddress.state) errors.state = 'State is required';
    if (!shippingAddress.postalCode) errors.postalCode = 'Postal code is required';
    if (!shippingAddress.phone) errors.phone = 'Phone number is required';
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCheckout = async () => {
    // Only validate if there are items in the cart
    if (!cart?.items?.length) {
      toast.error('Your cart is empty');
      return;
    }
    
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please log in to checkout');
      return;
    }
    
    if (!validateForm()) {
      toast.error('Please complete all required fields');
      return;
    }
    
    try {
      setIsProcessing(true);
      
      // Format the items correctly for the API
      const orderItems = cart.items.map(item => ({
        product: item.productId, // Server expects 'product' field, not 'productId'
        quantity: item.quantity,
        price: item.price
      }));
      
      // Calculate total manually as a fallback
      const calculatedTotal = cart.items.reduce((total, item) => 
        total + (item.price * item.quantity), 0);
      
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/orders/create`,
        {
          items: orderItems,
          totalAmount: cart.total || calculatedTotal,
          shippingAddress
        },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      if (response.data.success) {
        const { order } = response.data;
        
        // Check if Razorpay key is available
        if (!import.meta.env.VITE_RAZORPAY_KEY_ID) {
          console.error('Razorpay key not found in environment variables');
          toast.error('Payment gateway configuration error. Please contact support.');
          setIsProcessing(false);
          return;
        }
        
        // Check if Razorpay script is loaded
        if (!window.Razorpay) {
          console.error('Razorpay script not loaded');
          toast.error('Payment gateway not loaded. Please refresh the page or contact support.');
          setIsProcessing(false);
          return;
        }
        
        // Initialize Razorpay payment
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: order.amount * 100, // Razorpay expects amount in paise
          currency: "INR",
          name: "Veloria Perfumes",
          description: "Payment for your order",
          order_id: order.razorpayOrderId,
          handler: async function (response) {
            try {
              // Verify payment on the server
              const verifyResponse = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/orders/verify`,
                {
                  orderId: order._id,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature
                },
                { headers: { Authorization: `Bearer ${token}` }}
              );
              
              if (verifyResponse.data.success) {
                setCart({ items: [], total: 0 });
                toast.success('Payment successful! Order placed.');
                // Refresh order history
                fetchOrderHistory();
              }
            } catch (error) {
              console.error('Payment verification error:', error);
              toast.error(error.response?.data?.message || 'Payment verification failed');
            } finally {
              setIsProcessing(false);
            }
          },
          prefill: {
            name: shippingAddress.fullName,
            contact: shippingAddress.phone,
          },
          theme: {
            color: "#800020", // Burgundy color
          },
          modal: {
            ondismiss: function() {
              setIsProcessing(false);
              toast.error('Payment cancelled. Your order has been saved.');
            }
          }
        };
        
        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error.response?.data?.message || 'Failed to place order');
      setIsProcessing(false);
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
          <FiShoppingCart className="w-16 h-16 text-burgundy" />
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
            <FiShoppingCart className="w-8 h-8" />
            My Cart
          </h1>
          {cart?.items?.length > 0 && (
            <button
              onClick={() => setShowOrderHistory(!showOrderHistory)}
              className="text-burgundy hover:text-gold transition-colors duration-200 flex items-center gap-2"
            >
              <FiClock />
              {showOrderHistory ? 'Hide Order History' : 'View Order History'}
            </button>
          )}
        </div>
        
        <AnimatePresence>
          {showOrderHistory && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-8"
            >
              <div className="bg-soft-white border border-gold/10 shadow-sm p-6 mb-8">
                <h2 className="text-2xl font-serif text-burgundy mb-6">Order History</h2>
                
                {orderHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <FiPackage className="mx-auto w-12 h-12 text-burgundy/50 mb-4" />
                    <p className="text-soft-black/70">You haven't placed any orders yet.</p>
                  </div>
                ) : (
                  <motion.div
                    variants={{
                      hidden: { opacity: 0 },
                      show: {
                        opacity: 1,
                        transition: {
                          staggerChildren: 0.1
                        }
                      }
                    }}
                    initial="hidden"
                    animate="show"
                    className="space-y-4"
                  >
                    {orderHistory.map((order) => (
                      <motion.div
                        key={order._id}
                        variants={{
                          hidden: { opacity: 0, y: 20 },
                          show: { opacity: 1, y: 0 }
                        }}
                        className="bg-cream/50 border border-gold/10 p-4"
                      >
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-serif text-burgundy">
                            Order #{order._id.substring(order._id.length - 8)}
                          </h4>
                          <div className="text-sm text-soft-black/70">
                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
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
                                className="w-16 h-16 object-cover border border-gold/10"
                                onError={(e) => {
                                  e.target.src = 'https://placehold.co/300x300/f8f5f0/1a1a1a?text=No+Image';
                                }}
                              />
                              <div>
                                <h4 className="text-soft-black font-medium">
                                  {item.product.name}
                                </h4>
                                <p className="text-soft-black/70">
                                  {item.quantity} x ₹{item.price.toLocaleString()}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-4 pt-4 border-t border-gold/10 flex justify-between items-center">
                          <div className="text-soft-black/70">
                            Status: <span className="text-burgundy">{order.status}</span>
                          </div>
                          <div className="text-soft-black font-serif font-bold">
                            Total: ₹{order.totalAmount.toLocaleString()}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Show empty cart message if cart is empty */}
        {!cart?.items?.length ? (
          <div className="bg-soft-white border border-gold/10 shadow-sm p-8 text-center">
            <FiShoppingCart className="mx-auto text-burgundy w-16 h-16 mb-4" />
            <h2 className="text-2xl font-serif text-soft-black mb-4">Your Cart is Empty</h2>
            <p className="text-soft-black/70 mb-6">Add some items to your cart and start shopping!</p>
            <Link
              to="/collections"
              className="inline-flex items-center gap-2 btn-primary"
            >
              <FiArrowLeft />
              Browse Collections
            </Link>
          </div>
        ) : (
          // Show cart items and checkout form if cart has items
          <>
            <div className="bg-soft-white border border-gold/10 shadow-sm overflow-hidden">
              <div className="divide-y divide-gold/10">
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
                        className="w-full h-full object-cover border border-gold/10"
                        onError={(e) => {
                          e.target.src = 'https://placehold.co/300x300/f8f5f0/1a1a1a?text=No+Image';
                        }}
                      />
                      {item.stock < 5 && (
                        <div className="absolute top-0 right-0 bg-burgundy text-soft-white text-xs px-2 py-1">
                          Low Stock
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-serif text-soft-black mb-1">{item.name}</h3>
                      <p className="text-soft-black/70 text-sm mb-2">₹{item.price.toLocaleString()}</p>
                      
                      <div className="flex items-center gap-4">
                        <div className="quantity-selector">
                          <button
                            onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                            disabled={updating || item.quantity <= 1}
                            className="text-burgundy"
                            aria-label="Decrease quantity"
                          >
                            <FiMinus className="w-4 h-4" />
                          </button>
                          <span className="px-4 text-soft-black">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={updating || item.quantity >= item.stock}
                            className="text-burgundy"
                            aria-label="Increase quantity"
                          >
                            <FiPlus className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <button
                          onClick={() => removeItem(item.id)}
                          disabled={updating}
                          className="p-2 text-burgundy hover:text-burgundy/70 disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Remove item"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xl font-serif font-bold text-burgundy">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="bg-cream/50 p-6 border-t border-gold/10">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-soft-black/70">Subtotal</span>
                  <span className="text-soft-black text-lg">₹{(cart?.total || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-soft-black/70">Shipping</span>
                  <span className="text-soft-black text-lg">Free</span>
                </div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-serif text-soft-black">Total</span>
                  <span className="text-2xl font-serif font-bold text-burgundy">₹{(cart?.total || 0).toLocaleString()}</span>
                </div>
                
                {/* Shipping Address Form */}
                <div className="mb-6 border-t border-gold/10 pt-6">
                  <h3 className="text-xl font-serif text-burgundy mb-4">Shipping Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                      <label htmlFor="fullName" className="block text-soft-black mb-1">Full Name *</label>
                      <input 
                        type="text" 
                        id="fullName"
                        name="fullName"
                        value={shippingAddress.fullName} 
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border ${validationErrors.fullName ? 'border-red-500' : 'border-gold/20'} focus:border-burgundy bg-soft-white text-soft-black outline-none`}
                      />
                      {validationErrors.fullName && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.fullName}</p>
                      )}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="phone" className="block text-soft-black mb-1">Phone Number *</label>
                      <input 
                        type="text" 
                        id="phone"
                        name="phone"
                        value={shippingAddress.phone} 
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border ${validationErrors.phone ? 'border-red-500' : 'border-gold/20'} focus:border-burgundy bg-soft-white text-soft-black outline-none`}
                      />
                      {validationErrors.phone && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.phone}</p>
                      )}
                    </div>
                    
                    <div className="form-group md:col-span-2">
                      <label htmlFor="addressLine1" className="block text-soft-black mb-1">Address Line 1 *</label>
                      <input 
                        type="text" 
                        id="addressLine1"
                        name="addressLine1"
                        value={shippingAddress.addressLine1} 
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border ${validationErrors.addressLine1 ? 'border-red-500' : 'border-gold/20'} focus:border-burgundy bg-soft-white text-soft-black outline-none`}
                      />
                      {validationErrors.addressLine1 && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.addressLine1}</p>
                      )}
                    </div>
                    
                    <div className="form-group md:col-span-2">
                      <label htmlFor="addressLine2" className="block text-soft-black mb-1">Address Line 2 (Optional)</label>
                      <input 
                        type="text" 
                        id="addressLine2"
                        name="addressLine2"
                        value={shippingAddress.addressLine2} 
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gold/20 focus:border-burgundy bg-soft-white text-soft-black outline-none"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="city" className="block text-soft-black mb-1">City *</label>
                      <input 
                        type="text" 
                        id="city"
                        name="city"
                        value={shippingAddress.city} 
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border ${validationErrors.city ? 'border-red-500' : 'border-gold/20'} focus:border-burgundy bg-soft-white text-soft-black outline-none`}
                      />
                      {validationErrors.city && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.city}</p>
                      )}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="state" className="block text-soft-black mb-1">State *</label>
                      <input 
                        type="text" 
                        id="state"
                        name="state"
                        value={shippingAddress.state} 
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border ${validationErrors.state ? 'border-red-500' : 'border-gold/20'} focus:border-burgundy bg-soft-white text-soft-black outline-none`}
                      />
                      {validationErrors.state && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.state}</p>
                      )}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="postalCode" className="block text-soft-black mb-1">Postal Code *</label>
                      <input 
                        type="text" 
                        id="postalCode"
                        name="postalCode"
                        value={shippingAddress.postalCode} 
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border ${validationErrors.postalCode ? 'border-red-500' : 'border-gold/20'} focus:border-burgundy bg-soft-white text-soft-black outline-none`}
                      />
                      {validationErrors.postalCode && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.postalCode}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={handleCheckout}
                  disabled={isProcessing || !cart?.items?.length}
                  className="w-full btn-primary py-4 px-6 flex items-center justify-center gap-2"
                >
                  <span>{isProcessing ? 'Processing...' : 'Proceed to Checkout'}</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default Cart;