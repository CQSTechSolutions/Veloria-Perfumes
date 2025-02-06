import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { jwtDecode} from 'jwt-decode';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userIsAdmin, setUserIsAdmin] = useState(false);
  const location = useLocation();
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const expirationTime = localStorage.getItem('expirationTime');
    if (token && expirationTime && new Date().getTime() < parseInt(expirationTime)) {
      const decodedToken = jwtDecode(token);
      setIsLoggedIn(true);
      setUserIsAdmin(decodedToken.role === 'admin');
    } else {
      localStorage.clear();
      setIsLoggedIn(false);
      setUserIsAdmin(false);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUserIsAdmin(false);
    navigate('/');
  };

  const getLinkClass = (path) => {
    const baseClass = "hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium";
    return location.pathname === path
      ? `bg-gray-700 text-white ${baseClass}`
      : `text-gray-300 ${baseClass}`;
  };

  return (
    <>
      <motion.nav className="bg-gray-800 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                {/* <motion.img 
                  src="/" 
                  alt="Veloria" 
                  className="h-20 w-20 mr-2 rounded-full border-4 border-white"
                /> */}
                <h2 className="text-white text-2xl font-bold">Veloria Collections</h2>
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-4">
                <Link to="/" className={getLinkClass('/')}>Home</Link>
                <Link to="/about" className={getLinkClass('/about')}>About</Link>
                <Link to="/collections" className={getLinkClass('/collections')}>Collections</Link>
                <Link to="/contact" className={getLinkClass('/contact')}>Contact</Link>
                {isLoggedIn ? (
                  <>
                    <Link to="/orders" className={getLinkClass('/orders')}>Orders</Link>
                    <button onClick={handleLogout} className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Logout</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className={getLinkClass('/login')}>Login</Link>
                    {/* <Link to="/register" className={getLinkClass('/register')}>Register</Link> */}
                  </>
                )}
                {isLoggedIn && userIsAdmin && (
                  <Link to="/veloriaAdministration" className={getLinkClass('/admin')}>Admin</Link>
                )}
              </div>
            </div>
            <div className="md:hidden">
              <button onClick={() => setIsOpen(!isOpen)} className="text-gray-400 hover:text-white">
                <span className="sr-only">Toggle main menu</span>
                {!isOpen ? (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>
      <AnimatePresence>
        {isOpen && (
          <motion.div className="md:hidden fixed inset-0 bg-gray-800 bg-opacity-75 z-50">
            <div ref={menuRef} className="fixed top-20 left-0 right-0 bg-gray-800 z-50 px-2 pt-2 pb-3 space-y-1">
              <Link to="/" className="text-gray-300 hover:bg-gray-700 block px-3 py-2 rounded-md">Home</Link>
              <Link to="/about" className="text-gray-300 hover:bg-gray-700 block px-3 py-2 rounded-md">About</Link>
              <Link to="/collections" className="text-gray-300 hover:bg-gray-700 block px-3 py-2 rounded-md">Collections</Link>
              <Link to="/contact" className="text-gray-300 hover:bg-gray-700 block px-3 py-2 rounded-md">Contact</Link>
              {isLoggedIn ? (
                <>
                  <Link to="/orders" className="text-gray-300 hover:bg-gray-700 block px-3 py-2 rounded-md">Orders</Link>
                  <button onClick={handleLogout} className="text-gray-300 hover:bg-gray-700 block px-3 py-2 rounded-md w-full text-left">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-300 hover:bg-gray-700 block px-3 py-2 rounded-md">Login</Link>
                  {/* <Link to="/register" className="text-gray-300 hover:bg-gray-700 block px-3 py-2 rounded-md">Register</Link> */}
                </>
              )}
              {isLoggedIn && userIsAdmin && (
                <Link to="/veloriaAdministration" className="text-gray-300 hover:bg-gray-700 block px-3 py-2 rounded-md">Admin</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;