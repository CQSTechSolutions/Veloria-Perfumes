import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaArrowLeft } from 'react-icons/fa';

// API URL from environment or default
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const OrderDetails = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { orderId } = useParams();
  const navigate = useNavigate();

  // Fetch order details on component mount
  useEffect(() => {
    if (!currentUser) {
      navigate('/signin', { state: { message: 'Please sign in to view order details' } });
      return;
    }
    
    const fetchOrderDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/orders/${orderId}`, {
          headers: {
            'x-auth-token': token
          }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch order details');
        }
        
        setOrder(data.order);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching order details:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [currentUser, navigate, orderId]);

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
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

  // Calculate subtotal for display purposes
  const subtotal = order?.orderItems?.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0) || 0;

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

  if (error) {
    return (
      <>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-10 min-h-screen">
          <div className="bg-red-100 p-4 rounded-md text-red-700 mb-6">
            Error: {error}
          </div>
          <Link 
            to="/orders"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
          >
            <FaArrowLeft className="mr-2" /> Back to Orders
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-10 min-h-screen">
          <div className="bg-yellow-100 p-4 rounded-md text-yellow-700 mb-6">
            Order not found
          </div>
          <Link 
            to="/orders"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
          >
            <FaArrowLeft className="mr-2" /> Back to Orders
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-6">
          <Link 
            to="/orders"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
          >
            <FaArrowLeft className="mr-2" /> Back to Orders
          </Link>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold">Order #{order._id.substring(order._id.length - 8)}</h1>
            <p className="text-gray-600 mt-1">Placed on {formatDate(order.createdAt)}</p>
          </div>
          <div className="mt-4 md:mt-0">
            <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Shipping Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Shipping Information</h2>
            <address className="not-italic">
              <p>{order.shippingAddress.address}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
              <p>{order.shippingAddress.country}</p>
            </address>
            {order.isDelivered ? (
              <div className="mt-4 bg-green-100 p-2 rounded text-green-700 text-sm">
                Delivered on {formatDate(order.deliveredAt)}
              </div>
            ) : (
              <div className="mt-4 bg-yellow-100 p-2 rounded text-yellow-700 text-sm">
                Not yet delivered
              </div>
            )}
          </div>
          
          {/* Payment Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Payment Information</h2>
            <p><strong>Method:</strong> Cash on Delivery (COD)</p>
            {order.isPaid ? (
              <div className="mt-4 bg-green-100 p-2 rounded text-green-700 text-sm">
                Paid on {formatDate(order.paidAt)}
              </div>
            ) : (
              <div className="mt-4 bg-yellow-100 p-2 rounded text-yellow-700 text-sm">
                Payment will be collected on delivery
              </div>
            )}
          </div>
          
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Items:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>₹500.00</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (18%):</span>
                <span>₹{(subtotal * 0.18).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold border-t pt-2 mt-2">
                <span>Total:</span>
                <span>₹{order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Order Items</h2>
            
            <div className="space-y-4">
              {order.orderItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between pb-4 border-b last:border-b-0">
                  <div className="flex items-center">
                    <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm">{item.name}</h3>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      <p className="text-xs text-gray-500">₹{item.price.toFixed(2)} each</p>
                    </div>
                  </div>
                  <p className="text-sm font-medium">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderDetails;