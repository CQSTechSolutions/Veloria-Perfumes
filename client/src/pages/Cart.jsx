import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaTrash, FaArrowLeft, FaLock } from 'react-icons/fa';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);

  // This would be replaced with actual cart data from context/redux/localStorage
  useEffect(() => {
    // Simulate fetching cart data
    const fetchCartItems = async () => {
      try {
        // For demo purposes, we'll use mock data
        // In a real app, this would come from an API or local storage
        const mockCartItems = [
          {
            _id: '1',
            name: 'Veloria Signature',
            price: 89.99,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80',
            category: 'Floral'
          },
          {
            _id: '2',
            name: 'Midnight Bloom',
            price: 75.50,
            quantity: 2,
            image: 'https://images.unsplash.com/photo-1615368144592-28b2c5e22b14?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80',
            category: 'Oriental'
          }
        ];
        
        setCartItems(mockCartItems);
        setLoading(false);
      } catch (err) {
        setError('Failed to load cart items');
        setLoading(false);
        console.error('Error fetching cart items:', err);
      }
    };

    fetchCartItems();
  }, []);

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item._id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item._id !== id));
  };

  const handleApplyCoupon = () => {
    // In a real app, this would validate the coupon with an API
    if (couponCode.toLowerCase() === 'welcome10') {
      setCouponApplied(true);
      setDiscount(10); // 10% discount
    } else {
      alert('Invalid coupon code');
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateDiscount = () => {
    return couponApplied ? (calculateSubtotal() * (discount / 100)) : 0;
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount();
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="text-center py-20 text-red-600">Error: {error}</div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
        
        {cartItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Your cart is empty</h3>
            <p className="mt-2 text-gray-500">
              Looks like you haven't added any perfumes to your cart yet.
            </p>
            <div className="mt-6">
              <Link to="/shop" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                <FaArrowLeft className="mr-2" /> Continue Shopping
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold">Cart Items ({cartItems.length})</h2>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <div key={item._id} className="p-6 flex flex-col sm:flex-row items-center">
                      <div className="sm:w-24 h-24 flex-shrink-0 mb-4 sm:mb-0">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>
                      
                      <div className="sm:ml-6 flex-1">
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                            <p className="mt-1 text-sm text-gray-500">{item.category}</p>
                          </div>
                          <p className="mt-2 sm:mt-0 text-lg font-medium text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                        
                        <div className="mt-4 flex justify-between items-center">
                          <div className="flex items-center border border-gray-300 rounded-md">
                            <button 
                              onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                              className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                            >
                              -
                            </button>
                            <span className="px-3 py-1 border-x border-gray-300">{item.quantity}</span>
                            <button 
                              onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                              className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                            >
                              +
                            </button>
                          </div>
                          
                          <button 
                            onClick={() => handleRemoveItem(item._id)}
                            className="text-red-500 hover:text-red-700 flex items-center"
                          >
                            <FaTrash className="mr-1" /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-6">
                <Link to="/shop" className="inline-flex items-center text-indigo-600 hover:text-indigo-800">
                  <FaArrowLeft className="mr-2" /> Continue Shopping
                </Link>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${calculateSubtotal().toFixed(2)}</span>
                  </div>
                  
                  {couponApplied && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({discount}%)</span>
                      <span>-${calculateDiscount().toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">Free</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4 flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-xl">${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
                
                {/* Coupon Code */}
                {!couponApplied && (
                  <div className="mt-6">
                    <label htmlFor="coupon" className="block text-sm font-medium text-gray-700 mb-2">
                      Apply Coupon Code
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        id="coupon"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Enter coupon code"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        className="bg-gray-200 text-gray-800 px-4 py-2 rounded-r-md hover:bg-gray-300 transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Try "WELCOME10" for 10% off</p>
                  </div>
                )}
                
                {/* Checkout Button */}
                <button
                  className="w-full mt-6 bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center"
                >
                  <FaLock className="mr-2" /> Proceed to Checkout
                </button>
                
                <div className="mt-4 text-center text-sm text-gray-500">
                  <p>Secure checkout powered by Stripe</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Cart;