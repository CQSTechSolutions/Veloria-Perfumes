import React, { useState, useEffect } from 'react';
import { FiBox, FiUsers, FiShoppingBag, FiSettings, FiPieChart } from 'react-icons/fi';
import axios from 'axios';
import { toast } from 'react-hot-toast';
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
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/getStats`,
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
        <div className="flex-1 p-8">
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-900">
      <AdminSidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-white mb-8">
            Dashboard Overview
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Products"
              value={stats.totalProducts || 0}
              icon={<FiBox className="w-6 h-6" />}
              color="bg-blue-600"
            />
            <StatsCard
              title="Total Orders"
              value={stats.totalOrders || 0}
              icon={<FiShoppingBag className="w-6 h-6" />}
              color="bg-green-600"
            />
            <StatsCard
              title="Total Users"
              value={stats.totalUsers || 0}
              icon={<FiUsers className="w-6 h-6" />}
              color="bg-purple-600"
            />
            <StatsCard
              title="Total Revenue"
              value={`₹${(stats.totalRevenue || 0).toLocaleString()}`}
              icon={<FiPieChart className="w-6 h-6" />}
              color="bg-red-600"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-8 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className="h-auto overflow-y-auto">
                <RecentOrders />
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className="h-auto overflow-y-auto">
                <ProductsTable />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VeloriaAdministration; 