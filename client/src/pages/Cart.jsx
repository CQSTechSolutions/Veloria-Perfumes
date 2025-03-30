import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EmptyCart from '../components/EmptyCart';
import { FaTrash, FaMinus, FaPlus, FaHistory, FaShoppingCart } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// API URL from environment or default
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const Cart = () => {
  const { cart, loading, updateCartItem, removeFromCart } = useContext(CartContext);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('cart');
  const [recentOrders, setRecentOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState(null);

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!currentUser) {
      navigate('/signin', { state: { message: 'Please sign in to view your cart' } });
    }
  }, [currentUser, navigate]);

  // Fetch recent orders
  useEffect(() => {
    if (currentUser) {
      fetchRecentOrders();
    }
  }, [currentUser]);

  const fetchRecentOrders = async () => {
    setOrdersLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Use the regular orders endpoint if the recent one fails
      const response = await fetch(`${API_URL}/orders`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch recent orders');
      }
      
      const data = await response.json();
      setRecentOrders(data.orders || []);
    } catch (err) {
      setOrdersError('Unable to load recent orders');
      console.error('Error fetching recent orders:', err);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-10 min-h-screen">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Calculate cart totals
  const subtotal = cart && cart.items ? cart.items.reduce((total, item) => {
    return total + (item.product.price * item.quantity);
  }, 0) : 0;
  
  const shipping = 500; // Fixed shipping at 500rs
  const tax = subtotal * 0.18; // 18% tax
  const total = subtotal + shipping + tax;

  return (
    <>
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-8">Your Account</h1>
        
        {/* Tabs */}
        <div className="flex border-b mb-8">
          <button
            className={`py-3 px-6 font-medium ${activeTab === 'cart' 
              ? 'border-b-2 border-indigo-600 text-indigo-600' 
              : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('cart')}
          >
            <FaShoppingCart className="inline mr-2" /> Shopping Cart
          </button>
          <button
            className={`py-3 px-6 font-medium ${activeTab === 'orders' 
              ? 'border-b-2 border-indigo-600 text-indigo-600' 
              : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('orders')}
          >
            <FaHistory className="inline mr-2" /> Recent Orders
          </button>
        </div>
        
        {/* Cart Tab */}
        {activeTab === 'cart' && (
          <>
            {(!cart || !cart.items || cart.items.length === 0) ? (
              <EmptyCart />
            ) : (
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Cart Items */}
                <div className="lg:w-2/3">
                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left pb-4">Product</th>
                            <th className="text-center pb-4">Quantity</th>
                            <th className="text-right pb-4">Price</th>
                            <th className="text-right pb-4">Total</th>
                            <th className="text-right pb-4">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cart.items.map((item) => (
                            <tr key={item.product._id} className="border-b">
                              <td className="py-4">
                                <div className="flex items-center">
                                  <img 
                                    src={item.product.image} 
                                    alt={item.product.name} 
                                    className="w-16 h-16 object-cover rounded"
                                  />
                                  <div className="ml-4">
                                    <h3 className="font-medium">{item.product.name}</h3>
                                    <p className="text-sm text-gray-500">{item.product.category}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4">
                                <div className="flex items-center justify-center">
                                  <button 
                                    onClick={() => updateCartItem(item.product._id, Math.max(1, item.quantity - 1))}
                                    className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
                                  >
                                    <FaMinus className="w-3 h-3" />
                                  </button>
                                  <span className="mx-3">{item.quantity}</span>
                                  <button 
                                    onClick={() => updateCartItem(item.product._id, item.quantity + 1)}
                                    className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
                                  >
                                    <FaPlus className="w-3 h-3" />
                                  </button>
                                </div>
                              </td>
                              <td className="py-4 text-right">
                                ₹{item.product.price.toFixed(2)}
                              </td>
                              <td className="py-4 text-right">
                                ₹{(item.product.price * item.quantity).toFixed(2)}
                              </td>
                              <td className="py-4 text-right">
                                <button 
                                  onClick={() => removeFromCart(item.product._id)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <FaTrash />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                
                {/* Order Summary */}
                <div className="lg:w-1/3">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>₹{subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>₹{shipping.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax (18%)</span>
                        <span>₹{tax.toFixed(2)}</span>
                      </div>
                      <div className="border-t pt-3 mt-3">
                        <div className="flex justify-between font-bold">
                          <span>Total</span>
                          <span>₹{total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <Link 
                      to="/checkout" 
                      className="w-full block text-center bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      Proceed to Checkout
                    </Link>
                    
                    <div className="mt-4">
                      <Link 
                        to="/shop" 
                        className="text-indigo-600 hover:text-indigo-800 text-sm flex justify-center"
                      >
                        Continue Shopping
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        
        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            {ordersLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
              </div>
            ) : ordersError ? (
              <div className="bg-red-100 p-4 rounded-md text-red-700 mb-6">
                Error: {ordersError}
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
                  <FaHistory className="w-8 h-8 text-indigo-600" />
                </div>
                <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
                <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
                <Link 
                  to="/shop" 
                  className="inline-block bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Your Recent Orders</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Items
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {recentOrders.slice(0, 5).map((order) => (
                        <tr key={order._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{order._id.substring(order._id.length - 8)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(order.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₹{order.totalPrice.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order.orderItems.length} {order.orderItems.length === 1 ? 'item' : 'items'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link 
                              to={`/orders/${order._id}`}
                              className="text-indigo-600 hover:text-indigo-900 px-3 py-1 border border-indigo-600 rounded-md"
                            >
                              View Details
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-6 text-center">
                  <Link 
                    to="/orders" 
                    className="inline-block bg-indigo-100 text-indigo-800 py-2 px-6 rounded-md hover:bg-indigo-200 transition-colors font-medium"
                  >
                    View All Orders
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Cart;