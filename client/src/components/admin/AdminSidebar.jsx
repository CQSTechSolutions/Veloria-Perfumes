import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiBox, 
  FiUsers, 
  FiShoppingBag, 
  FiSettings, 
  FiUser,
  FiLogOut,
  FiMenu,
  FiX,
  FiChevronDown,
  FiChevronRight
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const AdminSidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showProductSubmenu, setShowProductSubmenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const menuItems = [
    { path: '/admin', icon: FiHome, label: 'Dashboard' },
    { 
      path: '/admin/products', 
      icon: FiBox, 
      label: 'Products',
      submenu: [
        { path: '/admin/products', label: 'All Products' },
        { path: '/admin/products/add', label: 'Add Product' },
        { path: '/admin/products/categories', label: 'Categories' }
      ]
    },
    { path: '/admin/orders', icon: FiShoppingBag, label: 'Orders' },
    { path: '/admin/users', icon: FiUsers, label: 'Users' },
    { path: '/admin/settings', icon: FiSettings, label: 'Settings' },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <motion.div 
      className={`bg-gray-800 h-screen flex flex-col ${isCollapsed ? 'w-20' : 'w-64'} transition-all duration-300 relative`}
      initial={false}
      animate={{ width: isCollapsed ? 80 : 256 }}
    >
      <div className="p-6 flex items-center justify-between">
        {!isCollapsed && (
          <h2 className="text-2xl font-bold text-white">Veloria</h2>
        )}
        <button 
          onClick={toggleSidebar} 
          className={`text-gray-300 hover:text-white ${isCollapsed ? 'mx-auto' : ''}`}
        >
          {isCollapsed ? <FiMenu size={24} /> : <FiX size={24} />}
        </button>
      </div>

      <nav className="flex-1 px-4 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path} className="relative">
              {item.submenu ? (
                <>
                  <button
                    onClick={() => setShowProductSubmenu(!showProductSubmenu)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                      location.pathname.includes(item.path)
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center">
                      <item.icon className={`w-5 h-5 ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
                      {!isCollapsed && <span>{item.label}</span>}
                    </div>
                    {!isCollapsed && (
                      showProductSubmenu ? <FiChevronDown /> : <FiChevronRight />
                    )}
                  </button>
                  
                  <AnimatePresence>
                    {showProductSubmenu && !isCollapsed && (
                      <motion.ul
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-1 ml-6 space-y-1 overflow-hidden"
                      >
                        {item.submenu.map((subItem) => (
                          <li key={subItem.path}>
                            <Link
                              to={subItem.path}
                              className={`block px-4 py-2 rounded-md text-sm ${
                                location.pathname === subItem.path
                                  ? 'bg-purple-700 text-white'
                                  : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                              }`}
                            >
                              {subItem.label}
                            </Link>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center px-4 py-3 text-gray-300">
          <FiUser className={`w-5 h-5 ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
          {!isCollapsed && <span>Admin User</span>}
        </div>
        <button
          onClick={handleLogout}
          className="w-full mt-2 flex items-center px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
        >
          <FiLogOut className={`w-5 h-5 ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </motion.div>
  );
};

export default AdminSidebar;