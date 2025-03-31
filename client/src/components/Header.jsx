import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiSearch, FiShoppingBag, FiHeart, FiUser, FiMenu, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';

const Header = () => {
    const [navOpen, setNavOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const searchInputRef = useRef(null);
    const [isScrolled, setIsScrolled] = useState(false);
    
    const navigate = useNavigate();
    const location = useLocation();
    
    const { cartItems } = useSelector((state) => state.cart);
    const { wishlistItems } = useSelector((state) => state.wishlist);
    const { userInfo } = useSelector((state) => state.user);
    
    // Handle search form submission
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchOpen(false);
            setSearchQuery('');
        }
    };
    
    // Close mobile menu when route changes
    useEffect(() => {
        setNavOpen(false);
    }, [location.pathname]);
    
    // Focus search input when search box opens
    useEffect(() => {
        if (searchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [searchOpen]);
    
    // Track scroll position for header styling
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    // Animation variants
    const mobileMenuVariants = {
        closed: { opacity: 0, x: '100%', transition: { duration: 0.3 } },
        open: { opacity: 1, x: 0, transition: { duration: 0.3, staggerChildren: 0.1, delayChildren: 0.2 } },
    };
    
    const searchBoxVariants = {
        closed: { opacity: 0, y: -10, transition: { duration: 0.2 } },
        open: { opacity: 1, y: 0, transition: { duration: 0.2 } },
    };

    const menuItemVariants = {
        closed: { opacity: 0, x: 50 },
        open: { opacity: 1, x: 0, transition: { duration: 0.3 } }
    };
    
    const navItems = [
        { path: '/', label: 'Home' },
        { path: '/collections', label: 'Collections' },
        { path: '/about', label: 'About Us' },
        { path: '/contact', label: 'Contact' },
    ];
    
    return (
        <header 
            className={`fixed z-50 top-0 w-full transition-all duration-300 ${
                isScrolled ? 'bg-soft-white/95 backdrop-blur-sm shadow-sm' : 'bg-transparent'
            }`}
        >
            {/* Top bar with announcement */}
            <div className="bg-burgundy text-soft-white py-2 px-4 text-center text-sm">
                <p>Free shipping on orders over ₹999 | Use code WELCOME10 for 10% off</p>
            </div>
            
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="font-serif text-2xl tracking-wide text-burgundy">
                        Veloria
                    </Link>
                    
                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {navItems.map((item) => (
                            <Link 
                                key={item.path} 
                                to={item.path}
                                className={`text-sm uppercase tracking-widest hover:text-burgundy transition-colors ${
                                    location.pathname === item.path ? 'text-burgundy' : 'text-soft-black/80'
                                }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                    
                    {/* Header Actions */}
                    <div className="flex items-center space-x-4">
                        {/* Search Icon */}
                        <button 
                            onClick={() => setSearchOpen(!searchOpen)}
                            className="flex items-center justify-center w-10 h-10 hover:text-burgundy transition-colors"
                            aria-label="Search"
                        >
                            <FiSearch className="w-5 h-5" />
                        </button>
                        
                        {/* Wishlist Icon */}
                        <Link 
                            to="/wishlist"
                            className="flex items-center justify-center w-10 h-10 hover:text-burgundy transition-colors relative"
                            aria-label="Wishlist"
                        >
                            <FiHeart className="w-5 h-5" />
                            {wishlistItems.length > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-burgundy text-soft-white rounded-full text-xs flex items-center justify-center">
                                    {wishlistItems.length}
                                </span>
                            )}
                        </Link>
                        
                        {/* Cart Icon */}
                        <Link 
                            to="/cart"
                            className="flex items-center justify-center w-10 h-10 hover:text-burgundy transition-colors relative"
                            aria-label="Cart"
                        >
                            <FiShoppingBag className="w-5 h-5" />
                            {cartItems.length > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-burgundy text-soft-white rounded-full text-xs flex items-center justify-center">
                                    {cartItems.length}
                                </span>
                            )}
                        </Link>
                        
                        {/* Account Icon */}
                        <Link 
                            to={userInfo ? '/account' : '/login'}
                            className="flex items-center justify-center w-10 h-10 hover:text-burgundy transition-colors"
                            aria-label={userInfo ? 'Account' : 'Login'}
                        >
                            <FiUser className="w-5 h-5" />
                        </Link>
                        
                        {/* Mobile Menu Button */}
                        <button 
                            onClick={() => setNavOpen(!navOpen)}
                            className="flex md:hidden items-center justify-center w-10 h-10 hover:text-burgundy transition-colors"
                            aria-label={navOpen ? 'Close menu' : 'Open menu'}
                        >
                            {navOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Search Box */}
            <AnimatePresence>
                {searchOpen && (
                    <motion.div
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={searchBoxVariants}
                        className="absolute top-full left-0 w-full bg-soft-white shadow-md p-4"
                    >
                        <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto relative">
                            <div className="relative">
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    placeholder="Search for perfumes..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full px-4 py-3 pr-10 border border-gold/20 focus:border-burgundy focus:ring-0 focus:outline-none"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-0 top-0 h-full px-4 text-burgundy"
                                    aria-label="Submit search"
                                >
                                    <FiSearch className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="text-center mt-3">
                                <button
                                    type="button"
                                    onClick={() => setSearchOpen(false)}
                                    className="text-soft-black/60 text-sm hover:text-burgundy"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
            
            {/* Mobile Navigation Overlay */}
            <AnimatePresence>
                {navOpen && (
                    <motion.div
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={mobileMenuVariants}
                        className="fixed top-0 right-0 bottom-0 w-80 bg-soft-white shadow-xl z-50 overflow-y-auto"
                    >
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-8">
                                <Link to="/" className="font-serif text-2xl text-burgundy">
                                    Veloria
                                </Link>
                                <button 
                                    onClick={() => setNavOpen(false)}
                                    className="text-soft-black hover:text-burgundy transition-colors"
                                    aria-label="Close menu"
                                >
                                    <FiX className="w-6 h-6" />
                                </button>
                            </div>
                            
                            <nav className="space-y-6">
                                {navItems.map((item, index) => (
                                    <motion.div key={item.path} variants={menuItemVariants}>
                                        <Link 
                                            to={item.path}
                                            className={`block text-lg font-medium ${
                                                location.pathname === item.path 
                                                ? 'text-burgundy' 
                                                : 'text-soft-black hover:text-burgundy'
                                            } transition-colors`}
                                        >
                                            {item.label}
                                        </Link>
                                    </motion.div>
                                ))}
                                
                                <div className="pt-6 border-t border-gold/10">
                                    <motion.div variants={menuItemVariants}>
                                        <Link 
                                            to={userInfo ? '/account' : '/login'}
                                            className="flex items-center text-soft-black hover:text-burgundy transition-colors"
                                        >
                                            <FiUser className="w-5 h-5 mr-3" />
                                            <span>{userInfo ? 'My Account' : 'Login / Register'}</span>
                                        </Link>
                                    </motion.div>
                                </div>
                                
                                <motion.div variants={menuItemVariants} className="pt-6">
                                    <Link 
                                        to="/wishlist"
                                        className="flex items-center text-soft-black hover:text-burgundy transition-colors"
                                    >
                                        <FiHeart className="w-5 h-5 mr-3" />
                                        <span>Wishlist</span>
                                        {wishlistItems.length > 0 && (
                                            <span className="ml-2 bg-burgundy text-soft-white w-5 h-5 rounded-full text-xs flex items-center justify-center">
                                                {wishlistItems.length}
                                            </span>
                                        )}
                                    </Link>
                                </motion.div>
                                
                                <motion.div variants={menuItemVariants} className="pt-2">
                                    <Link 
                                        to="/cart"
                                        className="flex items-center text-soft-black hover:text-burgundy transition-colors"
                                    >
                                        <FiShoppingBag className="w-5 h-5 mr-3" />
                                        <span>Cart</span>
                                        {cartItems.length > 0 && (
                                            <span className="ml-2 bg-burgundy text-soft-white w-5 h-5 rounded-full text-xs flex items-center justify-center">
                                                {cartItems.length}
                                            </span>
                                        )}
                                    </Link>
                                </motion.div>
                            </nav>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            {/* Backdrop for mobile menu */}
            <AnimatePresence>
                {navOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-soft-black/50 z-40"
                        onClick={() => setNavOpen(false)}
                    />
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header; 