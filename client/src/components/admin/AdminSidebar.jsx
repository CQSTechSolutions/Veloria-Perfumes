import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiBox, 
  FiUsers, 
  FiShoppingBag, 
  FiSettings, 
  FiUser,
  FiLogOut 
} from 'react-icons/fi';

const AdminSidebar = () => {
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const menuItems = [
    { path: '/admin', icon: FiHome, label: 'Dashboard' },
    { path: '/admin/products', icon: FiBox, label: 'Products' },
    { path: '/admin/orders', icon: FiShoppingBag, label: 'Orders' },
    { path: '/admin/users', icon: FiUsers, label: 'Users' },
    { path: '/admin/settings', icon: FiSettings, label: 'Settings' },
  ];

  return (
    <div className="w-64 bg-gray-800 h-screen flex flex-col">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-white">Veloria Admin</h2>
      </div>

      <nav className="flex-1 px-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center px-4 py-3 text-gray-300">
          <FiUser className="w-5 h-5 mr-3" />
          <span>Admin User</span>
        </div>
        <button
          onClick={handleLogout}
          className="w-full mt-2 flex items-center px-4 py-3 text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <FiLogOut className="w-5 h-5 mr-3" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar; 