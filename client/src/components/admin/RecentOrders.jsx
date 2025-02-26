import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FiPackage, FiClock } from 'react-icons/fi';

const RecentOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentOrders();
  }, []);

  const fetchRecentOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/orders/getallorders/`,
        { headers: { Authorization: `Bearer ${token}` }}
      );

      if (response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      toast.error('Failed to fetch recent orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'processing': return 'text-yellow-500';
      case 'shipped': return 'text-blue-500';
      case 'delivered': return 'text-green-500';
      case 'cancelled': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Recent Orders</h2>
        <FiClock className="text-gray-400 text-xl" />
      </div>

      <div className="space-y-4">
        {orders.slice(0, 5).map((order) => (
          <div key={order._id} className="bg-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <FiPackage className="text-purple-500 mr-3" />
                <div>
                  <p className="text-white font-medium">Order #{order._id.slice(-6)}</p>
                  <p className="text-gray-400 text-sm">{order.user?.email || 'Anonymous'}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-medium">₹{order.totalAmount}</p>
                <span className={`text-sm ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentOrders; 