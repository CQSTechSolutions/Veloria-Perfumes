import React from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook, FiTwitter, FiYoutube, FiMail, FiPhone, FiClock } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    "INFORMATION": [
      { name: "About Us", path: "/about" },
      { name: "Contact Us", path: "/contact" },
      { name: "Terms & Conditions", path: "/terms" },
      { name: "Privacy Policy", path: "/privacy" },
      { name: "Shipping Policy", path: "/shipping" },
    ],
    "CUSTOMER SERVICE": [
      { name: "Track Order", path: "/track-order" },
      { name: "Return Policy", path: "/returns" },
      { name: "FAQs", path: "/faqs" },
      { name: "My Account", path: "/account" },
    ],
    "CATEGORIES": [
      { name: "Perfumes", path: "/category/perfumes" },
      { name: "Bath & Body", path: "/category/bath-body" },
      { name: "Skincare", path: "/category/skincare" },
      { name: "Gift Sets", path: "/category/gift-sets" },
    ]
  };

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-16">
        {/* Newsletter */}
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <h3 className="text-3xl font-bold mb-4">Join Our Newsletter</h3>
          <p className="mb-8 text-gray-300">Stay updated with our latest offers and fragrance releases</p>
          <div className="flex gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 text-white rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-400 border border-red-500 shadow-md"
              required
            />
            <button className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-3 rounded-full hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105">
              Subscribe
            </button>
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-bold mb-6 text-lg">{title}</h4>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.path} 
                      className="text-gray-400 hover:text-white transition-colors hover:translate-x-2 inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Info */}
          <div>
            <h4 className="font-bold mb-6 text-lg">CONTACT US</h4>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-center">
                <FiMail className="mr-3" />
                <a href="mailto:support@veloriacollections.com" className="hover:text-white transition-colors">support@veloriacollections.com</a>
              </li>
              <li className="flex items-center">
                <FiPhone className="mr-3" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <FiClock className="mr-3" />
                <span>Mon - Fri: 9:00 AM - 6:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex justify-center space-x-8 mb-12">
          {[
            { Icon: FiInstagram, label: 'Instagram' },
            { Icon: FiFacebook, label: 'Facebook' },
            { Icon: FiTwitter, label: 'Twitter' },
            { Icon: FiYoutube, label: 'YouTube' }
          ].map(({ Icon, label }) => (
            <a
              key={label}
              href="#"
              className="text-gray-400 hover:text-white transition-colors transform hover:scale-110"
              aria-label={label}
            >
              <Icon className="w-6 h-6" />
            </a>
          ))}
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-500 text-sm pt-8 border-t border-gray-800">
          <p>&copy; {currentYear} Veloria Collections. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 