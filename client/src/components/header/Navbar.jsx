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
    <nav className="bg-soft-white border-b border-gold/20 sticky top-0 z-50 paper-texture">
      {/* Main Navigation */}
      <div className="max-w-[1440px] mx-auto px-4">
        {/* Upper Nav - Logo and Icons */}
        <div className="h-20 flex items-center justify-between relative">
          {/* Search Icon */}
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="p-2 hover:bg-cream rounded-full transition-colors"
            aria-label="Search"
          >
            <FiSearch className="w-5 h-5 text-soft-black" />
          </button>

          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <h1 className="text-xl md:text-2xl font-serif font-bold tracking-wider text-burgundy">
              VELORIA <span className="text-gold">PERFUMES</span>
            </h1>
          </Link>

          {/* Right Icons */}
          <div className="flex items-center gap-2">
            <Link to="/wishlist" className="p-2 hover:bg-cream rounded-full transition-colors" aria-label="Wishlist">
              <FiHeart className="w-5 h-5 text-soft-black" />
            </Link>
            <Link to="/cart" className="p-2 hover:bg-cream rounded-full transition-colors" aria-label="Shopping Bag">
              <FiShoppingBag className="w-5 h-5 text-soft-black" />
            </Link>
            <Link to="/account" className="p-2 hover:bg-cream rounded-full transition-colors" aria-label="Account">
              <FiUser className="w-5 h-5 text-soft-black" />
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
              className="fixed inset-0 bg-soft-black/80 z-50 backdrop-blur-sm"
            >
              <div className="bg-soft-white p-6">
                <div className="max-w-3xl mx-auto">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-serif text-burgundy">Search Our Collection</h2>
                    <button 
                      onClick={() => setIsSearchOpen(false)}
                      className="p-2 hover:bg-cream rounded-full transition-colors"
                      aria-label="Close search"
                    >
                      <FiX className="w-5 h-5 text-soft-black" />
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={handleSearchKeyPress}
                      placeholder="Search for perfumes, gift sets..."
                      className="w-full px-4 py-3 border-b-2 border-gold/50 bg-transparent rounded-none focus:border-burgundy focus:outline-none font-sans placeholder-soft-black/50"
                      autoFocus
                    />
                    <button
                      onClick={handleSearch}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-burgundy hover:text-gold transition-colors"
                      aria-label="Submit search"
                    >
                      <FiSearch className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-soft-black/60 font-sans">
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
              className={`text-xs font-sans tracking-widest hover:text-burgundy transition-colors relative
                ${location.pathname === category.path ? 'text-burgundy font-medium' : 'text-soft-black'}`}
            >
              {category.name}
              {location.pathname === category.path && (
                <span className="absolute -bottom-1 left-0 right-0 h-px bg-gold"></span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;