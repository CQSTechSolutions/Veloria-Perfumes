import React, { useState, useEffect } from 'react';
import { FiBox, FiUsers, FiShoppingBag, FiSettings, FiPieChart, FiTrendingUp, FiCalendar } from 'react-icons/fi';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import AdminSidebar from '../../components/admin/AdminSidebar';
import StatsCard from '../../components/admin/StatsCard';
import RecentOrders from '../../components/admin/RecentOrders';
import ProductsTable from '../../components/admin/ProductsTable';

const VeloriaAdministration = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('week');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      if (!decodedToken.admin) {
        window.location.href = '/';
      }
    } else {
      window.location.href = '/';
    }
    fetchDashboardStats();
  }, [timeframe]);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log("Token being sent:", token);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/getStats?timeframe=${timeframe}`,
        { headers: { Authorization: `Bearer ${token}` }}
      );

      if (response.data.success) {
        setStats(response.data.stats);
      } else {
        toast.error('Failed to fetch stats');
      }
    } catch (error) {
      console.error('Dashboard Error:', error);
      toast.error('Failed to fetch dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-900">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 overflow-y-auto p-8">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-400">Welcome to Veloria Admin Panel</p>
        </motion.div>

        {/* Time filter */}
        <div className="mb-6 flex items-center space-x-2">
          <FiCalendar className="text-gray-400" />
          <span className="text-gray-400 mr-2">Time Period:</span>
          <div className="flex bg-gray-800 rounded-lg p-1">
            {['day', 'week', 'month', 'year'].map((period) => (
              <button
                key={period}
                onClick={() => setTimeframe(period)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  timeframe === period 
                    ? 'bg-purple-600 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <StatsCard
              title="Total Products"
              value={stats.totalProducts}
              icon={<FiBox className="w-6 h-6" />}
              change={5.2}
              color="from-blue-500 to-blue-600"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <StatsCard
              title="Total Orders"
              value={stats.totalOrders}
              icon={<FiShoppingBag className="w-6 h-6" />}
              change={12.5}
              color="from-green-500 to-green-600"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <StatsCard
              title="Total Users"
              value={stats.totalUsers}
              icon={<FiUsers className="w-6 h-6" />}
              change={8.1}
              color="from-yellow-500 to-yellow-600"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <StatsCard
              title="Total Revenue"
              value={`₹${stats.totalRevenue.toLocaleString()}`}
              icon={<FiTrendingUp className="w-6 h-6" />}
              change={15.3}
              color="from-purple-500 to-purple-600"
            />
          </motion.div>
        </div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="bg-gray-800 rounded-xl p-6 mb-8"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FiShoppingBag className="mr-2" /> Recent Orders
          </h2>
          <RecentOrders />
        </motion.div>

        {/* Products Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          className="bg-gray-800 rounded-xl p-6"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FiBox className="mr-2" /> Popular Products
          </h2>
          <ProductsTable />
        </motion.div>
      </div>
    </div>
  );
};

export default VeloriaAdministration;