import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FiPackage, FiEdit2, FiChevronDown, FiChevronUp, FiUser, FiBox, FiPhone, FiMapPin, FiCalendar, FiDollarSign, FiTruck, FiSearch, FiFilter } from 'react-icons/fi';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { motion, AnimatePresence } from 'framer-motion';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleOrders, setVisibleOrders] = useState(10);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/orders/getallorders/`,
        { headers: { Authorization: `Bearer ${token}` }}
      );

      if (response.data.success) {
        // Sort orders by date (newest first)
        const sortedOrders = response.data.orders.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrders(sortedOrders);
      }
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/orders/updateorderstatus/${orderId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      if (response.data.success) {
        toast.success('Order status updated successfully');
        // Update local state
        setOrders(prev => 
          prev.map(order => 
            order._id === orderId ? { ...order, status } : order
          )
        );
      } else {
        toast.error(response.data.message || 'Failed to update order status');
      }
    } catch (error) {
      console.error('Update order status error:', error);
      toast.error('Failed to update order status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      case 'delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'refunded':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FiCalendar className="mr-1.5" />;
      case 'processing':
        return <FiPackage className="mr-1.5" />;
      case 'shipped':
        return <FiTruck className="mr-1.5" />;
      case 'delivered':
        return <FiBox className="mr-1.5" />;
      case 'cancelled':
        return <FiEdit2 className="mr-1.5" />;
      case 'refunded':
        return <FiDollarSign className="mr-1.5" />;
      default:
        return <FiPackage className="mr-1.5" />;
    }
  };

  const toggleOrderExpand = (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Filter and search orders
  const filteredOrders = orders
    .filter(order => filterStatus === 'all' || order.status === filterStatus)
    .filter(order => {
      if (!searchTerm) return true;
      const searchTermLower = searchTerm.toLowerCase();
      return (
        order._id.toLowerCase().includes(searchTermLower) ||
        (order.user?.fullName && order.user.fullName.toLowerCase().includes(searchTermLower)) ||
        (order.shippingAddress?.fullName && order.shippingAddress.fullName.toLowerCase().includes(searchTermLower))
      );
    });

  // Load more orders
  const loadMoreOrders = () => {
    setVisibleOrders(prev => prev + 10);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-cream paper-texture">
        <AdminSidebar />
        <div className="flex-1 p-8 flex justify-center items-center">
          <div className="w-12 h-12 border-4 border-burgundy border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-cream paper-texture overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-serif text-burgundy mb-2">Order Management</h1>
            <p className="text-soft-black/70">View and manage all customer orders</p>
          </div>

          {/* Search and Filter Controls */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6 border border-gold/20">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gold/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy/30"
                />
              </div>
              
              <div className="flex items-center">
                <FiFilter className="mr-2 text-burgundy" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border border-gold/20 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-burgundy/30"
                >
                  <option value="all">All Orders</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
            </div>
          </div>

          {/* Status Filters */}
          <div className="mb-6 flex flex-wrap gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm ${
                filterStatus === 'all' 
                  ? 'bg-burgundy text-white' 
                  : 'bg-white text-soft-black hover:bg-cream/80'
              }`}
            >
              All Orders
            </button>
            {['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center ${
                  filterStatus === status 
                    ? 'bg-burgundy text-white' 
                    : `bg-white ${getStatusColor(status).split(' ')[1]} hover:bg-cream/80`
                }`}
              >
                {getStatusIcon(status)}
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center border border-gold/20 shadow-md">
              <FiPackage className="mx-auto text-4xl text-gold mb-4" />
              <h3 className="text-xl font-medium text-soft-black mb-2">No Orders Found</h3>
              <p className="text-soft-black/70">
                {searchTerm
                  ? 'No orders match your search criteria.'
                  : filterStatus === 'all' 
                    ? 'There are no orders in the system yet.' 
                    : `There are no orders with status "${filterStatus}".`}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.slice(0, visibleOrders).map((order) => (
                <motion.div 
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg overflow-hidden shadow-md border border-gold/20"
                >
                  {/* Order Header */}
                  <div 
                    className="p-4 bg-gradient-to-r from-cream to-soft-white flex flex-col md:flex-row justify-between items-start md:items-center cursor-pointer"
                    onClick={() => toggleOrderExpand(order._id)}
                  >
                    <div className="flex items-center mb-3 md:mb-0">
                      <div className="bg-burgundy/10 p-2 rounded-full mr-3">
                        <FiPackage className="text-burgundy" />
                      </div>
                      <div>
                        <h3 className="text-soft-black font-medium">Order #{order._id.slice(-8)}</h3>
                        <p className="text-soft-black/70 text-sm">{formatDate(order.createdAt)}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
                      <div className="flex items-center">
                        <div className="bg-gold/10 p-1.5 rounded-full mr-2">
                          <FiDollarSign className="text-gold" />
                        </div>
                        <span className="text-soft-black font-medium">₹{order.totalAmount.toFixed(2)}</span>
                      </div>
                      
                      <div className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center border ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </div>
                      
                      <button className="text-burgundy ml-auto md:ml-0">
                        {expandedOrder === order._id ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
                      </button>
                    </div>
                  </div>
                  
                  {/* Order Details (Expanded) */}
                  <AnimatePresence>
                    {expandedOrder === order._id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="p-6 border-t border-gold/10 grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Customer Information */}
                          <div>
                            <h4 className="text-soft-black font-medium mb-4 flex items-center">
                              <FiUser className="mr-2 text-burgundy" /> Customer Information
                            </h4>
                            <div className="bg-cream/30 p-4 rounded-lg border border-gold/10">
                              <p className="flex items-start mb-2">
                                <span className="text-soft-black/70 mr-2">Name:</span>
                                <span className="text-soft-black font-medium">
                                  {order.user?.fullName || order.shippingAddress?.fullName || 'N/A'}
                                </span>
                              </p>
                              <p className="flex items-start mb-2">
                                <span className="text-soft-black/70 mr-2">Email:</span>
                                <span className="text-soft-black font-medium">
                                  {order.user?.email || 'N/A'}
                                </span>
                              </p>
                              <p className="flex items-start">
                                <span className="text-soft-black/70 mr-2">Phone:</span>
                                <span className="text-soft-black font-medium">
                                  {order.shippingAddress?.phone || order.user?.phone || 'N/A'}
                                </span>
                              </p>
                            </div>
                            
                            {/* Shipping Address */}
                            <h4 className="text-soft-black font-medium mt-6 mb-4 flex items-center">
                              <FiMapPin className="mr-2 text-burgundy" /> Shipping Address
                            </h4>
                            <div className="bg-cream/30 p-4 rounded-lg border border-gold/10">
                              <p className="text-soft-black mb-1">{order.shippingAddress?.fullName}</p>
                              <p className="text-soft-black mb-1">{order.shippingAddress?.addressLine1}</p>
                              <p className="text-soft-black mb-1">
                                {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}
                              </p>
                              <p className="text-soft-black">{order.shippingAddress?.phone}</p>
                            </div>
                          </div>
                          
                          {/* Order Items */}
                          <div>
                            <h4 className="text-soft-black font-medium mb-4 flex items-center">
                              <FiBox className="mr-2 text-burgundy" /> Order Items
                            </h4>
                            <div className="bg-cream/30 p-4 rounded-lg border border-gold/10">
                              <ul className="space-y-3">
                                {order.items.map((item, index) => (
                                  <li key={index} className="flex items-center justify-between border-b border-gold/10 pb-3 last:border-0 last:pb-0">
                                    <div className="flex items-center">
                                      {item.product?.image && (
                                        <div className="w-10 h-10 mr-3 border border-gold/20 rounded-md overflow-hidden">
                                          <img 
                                            src={item.product.image} 
                                            alt={item.product.name} 
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                              e.target.src = 'https://placehold.co/300x300/f8f5f0/1a1a1a?text=Veloria';
                                            }}
                                          />
                                        </div>
                                      )}
                                      <div>
                                        <p className="text-soft-black font-medium">{item.product?.name || 'Product'}</p>
                                        <p className="text-soft-black/70 text-sm">Qty: {item.quantity}</p>
                                      </div>
                                    </div>
                                    <span className="text-soft-black font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                                  </li>
                                ))}
                              </ul>
                              
                              <div className="mt-4 pt-3 border-t border-gold/10 flex justify-between items-center">
                                <span className="text-soft-black font-medium">Total</span>
                                <span className="text-burgundy font-serif text-lg">₹{order.totalAmount.toFixed(2)}</span>
                              </div>
                            </div>
                            
                            {/* Order Status */}
                            <h4 className="text-soft-black font-medium mt-6 mb-4 flex items-center">
                              <FiEdit2 className="mr-2 text-burgundy" /> Update Status
                            </h4>
                            <div className="bg-cream/30 p-4 rounded-lg border border-gold/10">
                              <select
                                value={order.status}
                                onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                className="w-full p-2 border border-gold/20 rounded-md focus:outline-none focus:ring-2 focus:ring-burgundy/30"
                              >
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="refunded">Refunded</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
              
              {filteredOrders.length > visibleOrders && (
                <div className="text-center mt-6">
                  <button
                    onClick={loadMoreOrders}
                    className="px-6 py-3 bg-burgundy text-white rounded-lg hover:bg-burgundy/90 transition-colors shadow-md"
                  >
                    Load More Orders
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderList;