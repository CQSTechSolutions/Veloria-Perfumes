import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiPackage, FiClock, FiCheck, FiX, FiTruck, FiAlertCircle } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const statusIcons = {
  'pending': <FiClock className="text-gold" />,
  'processing': <FiPackage className="text-burgundy/80" />,
  'shipped': <FiTruck className="text-burgundy" />,
  'delivered': <FiCheck className="text-green-600" />,
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
        <div className="w-8 h-8 border-2 border-burgundy border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-8 text-soft-black/50">
        <FiPackage className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No recent orders found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gold/10">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-soft-black/70 uppercase tracking-wider">
              Order ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-soft-black/70 uppercase tracking-wider">
              Customer
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-soft-black/70 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-soft-black/70 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-soft-black/70 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-soft-black/70 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gold/10">
          {orders.map((order) => (
            <tr key={order._id} className="hover:bg-cream/50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-soft-black">
                #{order._id.substring(0, 8)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-soft-black/80">
                {order.user?.name || 'Guest User'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-soft-black/80">
                {new Date(order.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-soft-black/80">
                ₹{order.totalAmount.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <span className="mr-2">
                    {statusIcons[order.status.toLowerCase()] || statusIcons['pending']}
                  </span>
                  <span className="text-sm text-soft-black/80 capitalize">
                    {order.status}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Link
                  to={`/admin/orders/${order._id}`}
                  className="text-burgundy hover:text-gold transition-colors"
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