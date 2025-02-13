import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiSearch, FiUser, FiShoppingBag, FiHeart } from 'react-icons/fi';

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
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

  return (
    <nav className="bg-white border-b">
      {/* Main Navigation */}
      <div className="max-w-[1440px] mx-auto px-4">
        {/* Upper Nav - Logo and Icons */}
        <div className="h-20 flex items-center justify-between">
          {/* Search Icon (Mobile) */}
          <div className="lg:hidden">
            <FiSearch className="w-6 h-6" />
          </div>

          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <h1 className="text-2xl font-bold">VELORIA COLLECTIONS</h1>
          </Link>

          {/* Search Bar (Desktop) */}
          <div className="hidden lg:block flex-grow max-w-xl mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-gray-500"
              />
              <FiSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            <Link to="/wishlist">
              <FiHeart className="w-6 h-6" />
            </Link>
            <Link to="/account">
              <FiUser className="w-6 h-6" />
            </Link>
            <Link to="/cart">
              <div className="relative">
                <FiShoppingBag className="w-6 h-6" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* Lower Nav - Categories */}
        <div className="hidden lg:block">
          <div className="flex justify-center space-x-8 py-4">
            {categories.map((category) => (
              <Link
                key={category.path}
                to={category.path}
                className={`text-sm font-medium hover:text-red-500 transition-colors
                  ${location.pathname === category.path ? 'text-red-500' : 'text-gray-700'}`}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-white z-50 lg:hidden">
          <div className="p-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-gray-500"
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;