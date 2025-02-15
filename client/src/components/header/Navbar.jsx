import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiSearch, FiUser, FiShoppingBag, FiHeart, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const categories = [
    // { name: 'BOGO', path: '/bogo' },
    // { name: 'SHOP ALL', path: '/shop-all' },
    // { name: 'BESTSELLERS', path: '/bestsellers' },
    // { name: 'PERFUMES', path: '/perfumes' },
    // { name: 'BATH & BODY', path: '/bath-body' },
    // { name: 'COSMETICS', path: '/cosmetics' },
    // { name: 'NEW ARRIVALS', path: '/new-arrivals' },
    // { name: 'SKINCARE', path: '/skincare' },
    // { name: 'GIFTING', path: '/gifting' },
    { name: 'HOME', path: '/' },
    { name: 'ABOUT', path: '/about' },
    { name: 'COLLECTIONS', path: '/collections' },
    { name: 'CONTACT', path: '/contact' },
    { name: 'FAQ', path: '/faq' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/collections?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      {/* Main Navigation */}
      <div className="max-w-[1440px] mx-auto px-4">
        {/* Upper Nav - Logo and Icons */}
        <div className="h-20 flex items-center justify-between relative">
          {/* Search Icon */}
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiSearch className="w-6 h-6" />
          </button>

          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <h1 className="text-2xl font-bold">VELORIA COLLECTIONS</h1>
          </Link>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            <Link to="/wishlist" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <FiHeart className="w-6 h-6" />
            </Link>
            <Link to="/cart" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <FiShoppingBag className="w-6 h-6" />
            </Link>
            <Link to="/account" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <FiUser className="w-6 h-6" />
            </Link>
          </div>
        </div>

        {/* Search Overlay */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed inset-0 bg-black/50 z-50"
            >
              <div className="bg-white p-4">
                <div className="max-w-3xl mx-auto">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Search Products</h2>
                    <button 
                      onClick={() => setIsSearchOpen(false)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <FiX className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={handleSearchKeyPress}
                      placeholder="Search for perfumes, gift sets..."
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                      autoFocus
                    />
                    <button
                      onClick={handleSearch}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <FiSearch className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Press Enter to search
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Categories Menu */}
        <div className="hidden lg:flex items-center justify-center space-x-8 py-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={category.path}
              className={`text-sm font-medium hover:text-purple-600 transition-colors
                ${location.pathname === category.path ? 'text-purple-600' : 'text-gray-600'}`}
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;