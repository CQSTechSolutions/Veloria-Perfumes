import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaShoppingCart } from 'react-icons/fa';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const closeTimeoutRef = useRef(null);

  // Handle hover functionality with delay on close
  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    // Add a small delay before closing to allow user to move to dropdown
    closeTimeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 150);
  };

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  // Keep click functionality as well
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const categories = [
    { 
      id: 'floral', 
      name: 'Floral', 
      description: 'Rose, jasmine, and lily'
    },
    { 
      id: 'oriental', 
      name: 'Oriental',
      description: 'Spices, amber, and vanilla'
    },
    { 
      id: 'woody', 
      name: 'Woody',
      description: 'Cedarwood and sandalwood'
    },
    { 
      id: 'fresh', 
      name: 'Fresh',
      description: 'Aquatic and green notes'
    },
    { 
      id: 'citrus', 
      name: 'Citrus',
      description: 'Bergamot, lemon, grapefruit'
    },
    { 
      id: 'gourmand', 
      name: 'Gourmand',
      description: 'Honey, caramel, chocolate'
    }
  ];

  return (
    <nav className="flex items-center justify-between p-4 border-b border-gray-200 bg-white sticky top-0 z-50">
      {/* Logo/Brand */}
      <div className="flex items-center">
        <Link to="/" className="text-xl font-bold flex items-center gap-2">
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
          </svg>
          Veloria Perfume
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="hidden md:flex items-center space-x-8">
        <Link to="/" className="text-indigo-600 font-medium border-b-2 border-indigo-600 pb-1">
          Home
        </Link>
        <div 
          className="relative" 
          ref={dropdownRef}
        >
          <button 
            onClick={toggleDropdown}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="flex items-center font-medium text-gray-700 hover:text-indigo-600 focus:outline-none"
          >
            Categories
            <svg 
              className={`ml-1 w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          
          {/* Grid Dropdown Menu */}
          {isDropdownOpen && (
            <div 
              className="absolute left-0 mt-0 pt-2 w-[500px] z-20"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="bg-white rounded-lg shadow-xl overflow-hidden p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Explore by Category</h3>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      to={`/category/${category.id}`}
                      className="group p-3 rounded-md hover:bg-indigo-50 transition-colors duration-200"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <div>
                        <h4 className="font-medium text-gray-800 group-hover:text-indigo-600">{category.name}</h4>
                        <p className="text-xs text-gray-500 mt-1">{category.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        <Link to="/bestsellers" className="font-medium text-gray-700 hover:text-indigo-600">
          Bestsellers
        </Link>
        <Link to="/new-releases" className="font-medium text-gray-700 hover:text-indigo-600">
          New Releases
        </Link>
        <Link to="/discover" className="font-medium text-gray-700 hover:text-indigo-600">
          Discover
        </Link>
      </div>

      {/* Search, Cart and Sign In */}
      <div className="flex items-center space-x-4">
        <button className="text-gray-700 hover:text-indigo-600 focus:outline-none">
          <FaSearch className="w-5 h-5" />
        </button>
        <Link to="/cart" className="text-gray-700 hover:text-indigo-600">
          <FaShoppingCart className="w-5 h-5" />
        </Link>
        <Link to="/signin" className="px-4 py-2 rounded-full bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-50 font-medium">
          Sign In
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
