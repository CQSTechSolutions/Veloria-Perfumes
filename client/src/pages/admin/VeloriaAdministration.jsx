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
      <div className="flex h-screen bg-cream paper-texture">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-burgundy border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-cream paper-texture">
      <AdminSidebar />

      <div className="flex-1 p-6 overflow-y-auto admin-section">
        <h1 className="text-3xl font-serif text-burgundy mb-6">Admin Dashboard</h1>

        <div className="flex items-center gap-4 mb-6">
          <select
            value={timeframe}
            onChange={e => setTimeframe(e.target.value)}
            className="veloria-input border border-gold/30 bg-soft-white p-2"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
            <option value="all">All Time</option>
          </select>
          <span className="text-soft-black/70">Select timeframe for stats</span>
        </div>

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
              change={8.2}
              color="from-burgundy/80 to-burgundy"
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
              color="from-burgundy/70 to-burgundy/90"
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
              change={5.1}
              color="from-burgundy/60 to-burgundy/80"
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
              color="from-gold/60 to-gold"
            />
          </motion.div>
        </div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="bg-soft-white border border-gold/10 shadow-sm p-6 mb-8"
        >
          <h2 className="text-xl font-serif text-burgundy mb-4 flex items-center">
            <FiShoppingBag className="mr-2" /> Recent Orders
          </h2>
          <RecentOrders />
        </motion.div>

        {/* Products Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          className="bg-soft-white border border-gold/10 shadow-sm p-6"
        >
          <h2 className="text-xl font-serif text-burgundy mb-4 flex items-center">
            <FiBox className="mr-2" /> Popular Products
          </h2>
          <ProductsTable />
        </motion.div>
      </div>
    </div>
  );
};

export default VeloriaAdministration;