import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiSearch, FiUser, FiShoppingBag, FiHeart, FiX, FiMenu } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close mobile menu when location changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

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
    <nav className={`bg-soft-white border-b border-gold/20 sticky top-0 z-50 paper-texture transition-shadow duration-300 ${scrolled ? 'shadow-md' : ''}`}>
      {/* Main Navigation */}
      <div className="max-w-[1440px] mx-auto px-4">
        {/* Upper Nav - Logo and Icons */}
        <div className="h-20 flex items-center justify-between relative">
          {/* Mobile Menu Button - Only visible on small screens */}
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 hover:bg-cream rounded-full transition-colors"
            aria-label="Open menu"
          >
            <FiMenu className="w-5 h-5 text-soft-black" />
          </button>

          {/* Search Icon */}
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="p-2 hover:bg-cream rounded-full transition-colors"
            aria-label="Search"
          >
            <FiSearch className="w-5 h-5 text-soft-black" />
          </button>

          {/* Logo */}
          <Link to="/" className="flex-shrink-0 absolute left-1/2 transform -translate-x-1/2 lg:static lg:translate-x-0">
            <h1 className="text-xl md:text-2xl font-serif font-bold tracking-wider text-burgundy whitespace-nowrap">
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

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-soft-black/80 z-50 lg:hidden"
            >
              <motion.div 
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'tween', duration: 0.3 }}
                className="fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-soft-white paper-texture overflow-y-auto"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-8">
                    <Link to="/" className="flex-shrink-0">
                      <h2 className="text-xl font-serif font-bold tracking-wider text-burgundy">
                        VELORIA <span className="text-gold">PERFUMES</span>
                      </h2>
                    </Link>
                    <button 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-2 hover:bg-cream rounded-full transition-colors"
                      aria-label="Close menu"
                    >
                      <FiX className="w-5 h-5 text-soft-black" />
                    </button>
                  </div>
                  
                  <nav className="mb-8">
                    <ul className="space-y-4">
                      {categories.map((category) => (
                        <li key={category.name}>
                          <Link
                            to={category.path}
                            className={`block py-2 text-sm font-sans tracking-wider hover:text-burgundy transition-colors
                              ${location.pathname === category.path ? 'text-burgundy font-medium' : 'text-soft-black'}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {category.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </nav>
                  
                  <div className="pt-6 border-t border-gold/20">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <Link 
                        to="/account" 
                        className="flex items-center text-sm text-soft-black hover:text-burgundy transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <FiUser className="mr-2" /> My Account
                      </Link>
                      <Link 
                        to="/wishlist" 
                        className="flex items-center text-sm text-soft-black hover:text-burgundy transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <FiHeart className="mr-2" /> Wishlist
                      </Link>
                      <Link 
                        to="/cart" 
                        className="flex items-center text-sm text-soft-black hover:text-burgundy transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <FiShoppingBag className="mr-2" /> Cart
                      </Link>
                    </div>
                    
                    <button 
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsSearchOpen(true);
                      }}
                      className="w-full py-3 px-4 bg-cream hover:bg-cream/70 text-burgundy rounded-md transition-colors flex items-center justify-center"
                    >
                      <FiSearch className="mr-2" /> Search Products
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Categories Menu - Only visible on large screens */}
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