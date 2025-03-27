import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FiPackage, FiEdit2, FiChevronDown, FiChevronUp, FiUser, FiBox, FiPhone, FiMapPin, FiCalendar, FiDollarSign, FiTruck } from 'react-icons/fi';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { motion, AnimatePresence } from 'framer-motion';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

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
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/orders/updateorderstatus/${orderId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

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
      case 'refunded':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FiCalendar className="mr-1" />;
      case 'processing':
        return <FiPackage className="mr-1" />;
      case 'shipped':
        return <FiTruck className="mr-1" />;
      case 'delivered':
        return <FiBox className="mr-1" />;
      case 'cancelled':
        return <FiEdit2 className="mr-1" />;
      case 'refunded':
        return <FiDollarSign className="mr-1" />;
      default:
        return <FiPackage className="mr-1" />;
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
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-900">
        <AdminSidebar />
        <div className="flex-1 p-8 flex justify-center items-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-900 overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Order Management</h1>
          <p className="text-gray-400">View and manage all customer orders</p>
        </div>

        {/* Filter Controls */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === 'all' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            All Orders
          </button>
          {['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === status 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {filteredOrders.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <FiPackage className="mx-auto text-4xl text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">No Orders Found</h3>
            <p className="text-gray-400">
              {filterStatus === 'all' 
                ? 'There are no orders in the system yet.' 
                : `There are no orders with status "${filterStatus}".`}
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredOrders.map((order) => (
              <motion.div 
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800 rounded-lg overflow-hidden shadow-lg"
              >
                {/* Order Header */}
                <div 
                  className="p-4 bg-gray-700 flex flex-col md:flex-row justify-between items-start md:items-center cursor-pointer"
                  onClick={() => toggleOrderExpand(order._id)}
                >
                  <div className="flex items-center mb-2 md:mb-0">
                    <FiPackage className="text-purple-400 mr-2" />
                    <div>
                      <h3 className="text-white font-medium">Order #{order._id.slice(-8)}</h3>
                      <p className="text-gray-400 text-sm">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center">
                      <FiDollarSign className="text-green-400 mr-1" />
                      <span className="text-white font-medium">₹{order.totalAmount.toFixed(2)}</span>
                    </div>
                    
                    <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </div>
                    
                    {expandedOrder === order._id ? (
                      <FiChevronUp className="text-gray-400" />
                    ) : (
                      <FiChevronDown className="text-gray-400" />
                    )}
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
                      <div className="p-4 border-t border-gray-700 grid md:grid-cols-2 gap-6">
                        {/* Customer Information */}
                        <div className="bg-gray-750 p-4 rounded-lg">
                          <h4 className="text-white font-medium mb-3 flex items-center">
                            <FiUser className="mr-2 text-purple-400" /> Customer Details
                          </h4>
                          <div className="space-y-2 text-sm">
                            <p className="text-gray-300">
                              <span className="text-gray-400">Name:</span> {order.shippingAddress.fullName}
                            </p>
                            <p className="text-gray-300">
                              <span className="text-gray-400">Phone:</span> {order.shippingAddress.phone}
                            </p>
                            <div className="text-gray-300">
                              <span className="text-gray-400">Address:</span>
                              <p className="mt-1 ml-2 text-gray-400">
                                {order.shippingAddress.addressLine1}<br />
                                {order.shippingAddress.addressLine2 && <>{order.shippingAddress.addressLine2}<br /></>}
                                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Order Status Management */}
                        <div className="bg-gray-750 p-4 rounded-lg">
                          <h4 className="text-white font-medium mb-3 flex items-center">
                            <FiTruck className="mr-2 text-purple-400" /> Order Status
                          </h4>
                          <div className="grid grid-cols-2 gap-2">
                            {['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'].map(status => (
                              <button
                                key={status}
                                onClick={() => updateOrderStatus(order._id, status)}
                                className={`px-3 py-2 rounded text-xs font-medium transition-colors ${
                                  order.status === status
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                              >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        {/* Order Items */}
                        <div className="md:col-span-2 bg-gray-750 p-4 rounded-lg">
                          <h4 className="text-white font-medium mb-3 flex items-center">
                            <FiBox className="mr-2 text-purple-400" /> Order Items
                          </h4>
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-700">
                              <thead>
                                <tr>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Product</th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Price</th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Quantity</th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Total</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-700">
                                {order.items.map((item, index) => (
                                  <tr key={index} className="hover:bg-gray-700">
                                    <td className="px-4 py-3 whitespace-nowrap">
                                      <div className="flex items-center">
                                        {item.product && (
                                          <>
                                            <div className="h-10 w-10 flex-shrink-0 mr-3">
                                              <img 
                                                className="h-10 w-10 rounded-md object-cover" 
                                                src={item.product.images && item.product.images.length > 0 
                                                  ? item.product.images[0] 
                                                  : '/placeholder.jpg'} 
                                                alt={item.product.name} 
                                              />
                                            </div>
                                            <div>
                                              <div className="text-sm font-medium text-white">{item.product.name}</div>
                                              <div className="text-xs text-gray-400">{item.product.category}</div>
                                            </div>
                                          </>
                                        )}
                                        {!item.product && (
                                          <div className="text-sm text-gray-400">Product no longer available</div>
                                        )}
                                      </div>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                                      ₹{item.price.toFixed(2)}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                                      {item.quantity}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                                      ₹{(item.price * item.quantity).toFixed(2)}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                              <tfoot className="bg-gray-700">
                                <tr>
                                  <td colSpan="3" className="px-4 py-2 text-right text-sm font-medium text-white">
                                    Order Total:
                                  </td>
                                  <td className="px-4 py-2 text-sm font-bold text-white">
                                    ₹{order.totalAmount.toFixed(2)}
                                  </td>
                                </tr>
                              </tfoot>
                            </table>
                          </div>
                        </div>
                        
                        {/* Payment Information */}
                        {order.paymentInfo && (
                          <div className="md:col-span-2 bg-gray-750 p-4 rounded-lg">
                            <h4 className="text-white font-medium mb-3 flex items-center">
                              <FiDollarSign className="mr-2 text-purple-400" /> Payment Information
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-gray-300">
                                  <span className="text-gray-400">Payment ID:</span> {order.paymentInfo.razorpayPaymentId || 'N/A'}
                                </p>
                                <p className="text-gray-300">
                                  <span className="text-gray-400">Order ID:</span> {order.paymentInfo.razorpayOrderId || 'N/A'}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-300">
                                  <span className="text-gray-400">Payment Status:</span>{' '}
                                  <span className={order.paymentInfo.status === 'completed' ? 'text-green-400' : 'text-yellow-400'}>
                                    {order.paymentInfo.status || 'N/A'}
                                  </span>
                                </p>
                                <p className="text-gray-300">
                                  <span className="text-gray-400">Payment Date:</span> {order.paymentInfo.paidAt ? formatDate(order.paymentInfo.paidAt) : 'N/A'}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderList;