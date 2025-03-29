import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaPinterest, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-white text-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Top section with columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand and description */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              </svg>
              <span className="text-xl font-bold text-gray-900">Veloria Perfume</span>
            </div>
            <p className="text-gray-600 mb-4">
              Discover exquisite fragrances that tell your unique story. Crafted with passion and precision for the discerning individual.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-indigo-600">
                <FaFacebook className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-indigo-600">
                <FaTwitter className="w-5 h-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-indigo-600">
                <FaInstagram className="w-5 h-5" />
              </a>
              <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-indigo-600">
                <FaPinterest className="w-5 h-5" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-indigo-600">
                <FaYoutube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Shop</h3>
            <ul className="space-y-2">
              <li><Link to="/category/floral" className="text-gray-600 hover:text-indigo-600">Floral</Link></li>
              <li><Link to="/category/oriental" className="text-gray-600 hover:text-indigo-600">Oriental</Link></li>
              <li><Link to="/category/woody" className="text-gray-600 hover:text-indigo-600">Woody</Link></li>
              <li><Link to="/category/fresh" className="text-gray-600 hover:text-indigo-600">Fresh</Link></li>
              <li><Link to="/category/citrus" className="text-gray-600 hover:text-indigo-600">Citrus</Link></li>
              <li><Link to="/category/gourmand" className="text-gray-600 hover:text-indigo-600">Gourmand</Link></li>
            </ul>
          </div>

          {/* Account Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Account</h3>
            <ul className="space-y-2">
              <li><Link to="/account" className="text-gray-600 hover:text-indigo-600">My Account</Link></li>
              <li><Link to="/orders" className="text-gray-600 hover:text-indigo-600">Orders</Link></li>
              <li><Link to="/wishlist" className="text-gray-600 hover:text-indigo-600">Wishlist</Link></li>
              <li><Link to="/cart" className="text-gray-600 hover:text-indigo-600">Shopping Cart</Link></li>
            </ul>
          </div>

          {/* Information Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Information</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-600 hover:text-indigo-600">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-indigo-600">Contact Us</Link></li>
              <li><Link to="/shipping" className="text-gray-600 hover:text-indigo-600">Shipping & Returns</Link></li>
              <li><Link to="/privacy" className="text-gray-600 hover:text-indigo-600">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-600 hover:text-indigo-600">Terms & Conditions</Link></li>
              <li><Link to="/faq" className="text-gray-600 hover:text-indigo-600">FAQ</Link></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Veloria Perfume. All rights reserved.
            </p>
            <div className="flex items-center space-x-4">
              <img src="https://cdn-icons-png.flaticon.com/128/349/349221.png" alt="Visa" className="h-8 w-auto" />
              <img src="https://cdn-icons-png.flaticon.com/128/349/349228.png" alt="MasterCard" className="h-8 w-auto" />
              <img src="https://cdn-icons-png.flaticon.com/128/349/349230.png" alt="American Express" className="h-8 w-auto" />
              <img src="https://cdn-icons-png.flaticon.com/128/349/349203.png" alt="PayPal" className="h-8 w-auto" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 