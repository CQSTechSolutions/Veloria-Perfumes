import React, { useState, useEffect } from 'react';
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
  FiChevronRight,
  FiTag
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const AdminSidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showProductSubmenu, setShowProductSubmenu] = useState(false);
  
  // Check if screen is mobile when component mounts
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };
    
    // Set initial state
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
        { path: '/admin/products/new', label: 'Add Product' },
      ]
    },
    { path: '/admin/categories', icon: FiTag, label: 'Categories' },
    { path: '/admin/orders', icon: FiShoppingBag, label: 'Orders' },
    { path: '/admin/users', icon: FiUsers, label: 'Users' },
    { path: '/admin/settings', icon: FiSettings, label: 'Settings' },
  ];

  const toggleSidebar = () => {
    if (window.innerWidth < 768) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  // Dynamic classes based on state
  const sidebarClasses = `
    fixed md:static z-50 h-screen flex flex-col 
    bg-gradient-to-b from-soft-white to-cream border-r border-gold/10 shadow-lg
    transition-all duration-300 
    ${isCollapsed && !isMobileOpen ? 'w-20' : 'w-64'} 
    ${isMobileOpen ? 'left-0' : '-left-full md:left-0'}
  `;

  return (
    <>
      {/* Mobile menu button - only visible on mobile */}
      <button 
        onClick={toggleSidebar}
        className="fixed z-50 top-4 left-4 md:hidden p-2 rounded-full bg-burgundy text-white shadow-lg"
        aria-label="Toggle menu"
      >
        <FiMenu size={24} />
      </button>
      
      {/* Backdrop - only shown when mobile menu is open */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-soft-black/30 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        ></div>
      )}
      
      <motion.div 
        className={sidebarClasses}
        initial={false}
        animate={{ 
          width: isCollapsed && !isMobileOpen ? 80 : 256,
          x: isMobileOpen || window.innerWidth >= 768 ? 0 : -320
        }}
      >
        <div className="p-6 flex items-center justify-between border-b border-gold/10">
          {(!isCollapsed || isMobileOpen) && (
            <h2 className="text-2xl font-serif text-burgundy">Veloria</h2>
          )}
          <button 
            onClick={toggleSidebar} 
            className={`text-burgundy hover:text-gold ${isCollapsed && !isMobileOpen ? 'mx-auto' : ''}`}
          >
            {isCollapsed && !isMobileOpen ? <FiMenu size={24} /> : <FiX size={24} />}
          </button>
        </div>

        <nav className="flex-1 px-4 overflow-y-auto custom-scrollbar">
          <ul className="space-y-2 py-4">
            {menuItems.map((item) => (
              <li key={item.path} className="relative">
                {item.submenu ? (
                  <>
                    <button
                      onClick={() => setShowProductSubmenu(!showProductSubmenu)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                        location.pathname.includes(item.path) && !location.pathname.includes('/categories')
                          ? 'bg-burgundy text-white font-medium shadow-md'
                          : 'text-soft-black/80 hover:bg-cream/70 hover:text-burgundy'
                      }`}
                    >
                      <div className="flex items-center">
                        <item.icon className={`w-5 h-5 ${isCollapsed && !isMobileOpen ? 'mx-auto' : 'mr-3'}`} />
                        {(!isCollapsed || isMobileOpen) && <span>{item.label}</span>}
                      </div>
                      {(!isCollapsed || isMobileOpen) && (
                        showProductSubmenu ? <FiChevronDown /> : <FiChevronRight />
                      )}
                    </button>
                    
                    <AnimatePresence>
                      {showProductSubmenu && (!isCollapsed || isMobileOpen) && (
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
                                    ? 'bg-burgundy/80 text-white font-medium'
                                    : 'text-soft-black/70 hover:bg-cream hover:text-burgundy'
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
                        ? 'bg-burgundy text-white font-medium shadow-md'
                        : 'text-soft-black/80 hover:bg-cream/70 hover:text-burgundy'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${isCollapsed && !isMobileOpen ? 'mx-auto' : 'mr-3'}`} />
                    {(!isCollapsed || isMobileOpen) && <span>{item.label}</span>}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gold/10">
          <div className="flex items-center px-4 py-3 text-soft-black/80 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-burgundy/80 flex items-center justify-center shadow-sm">
              <FiUser className="w-4 h-4 text-white" />
            </div>
            {(!isCollapsed || isMobileOpen) && <span className="ml-3">Admin User</span>}
          </div>
          <button
            onClick={handleLogout}
            className="w-full mt-2 flex items-center px-4 py-3 rounded-lg text-soft-black/80 hover:bg-burgundy/10 hover:text-burgundy transition-colors"
          >
            <FiLogOut className={`w-5 h-5 ${isCollapsed && !isMobileOpen ? 'mx-auto' : 'mr-3'}`} />
            {(!isCollapsed || isMobileOpen) && <span>Logout</span>}
          </button>
        </div>
      </motion.div>
    </>
  );
};

export default AdminSidebar;