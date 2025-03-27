import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiPackage, FiClock, FiCheck, FiX, FiTruck, FiAlertCircle } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const statusIcons = {
  'pending': <FiClock className="text-yellow-500" />,
  'processing': <FiPackage className="text-blue-500" />,
  'shipped': <FiTruck className="text-purple-500" />,
  'delivered': <FiCheck className="text-green-500" />,
  'cancelled': <FiX className="text-red-500" />,
  'refunded': <FiAlertCircle className="text-orange-500" />
};

const RecentOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/orders/recent`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success) {
          setOrders(response.data.orders);
        } else {
          toast.error('Failed to fetch recent orders');
        }
      } catch (error) {
        console.error('Error fetching recent orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <FiPackage className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No recent orders found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-700">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Order ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Customer
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {orders.map((order) => (
            <tr key={order._id} className="hover:bg-gray-700/50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                #{order._id.substring(0, 8)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {order.user?.name || 'Guest User'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {new Date(order.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                ₹{order.totalAmount.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <span className="mr-2">
                    {statusIcons[order.status.toLowerCase()] || statusIcons['pending']}
                  </span>
                  <span className="text-sm text-gray-300 capitalize">
                    {order.status}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Link
                  to={`/admin/orders/${order._id}`}
                  className="text-purple-400 hover:text-purple-300"
                >
                  View Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentOrders;