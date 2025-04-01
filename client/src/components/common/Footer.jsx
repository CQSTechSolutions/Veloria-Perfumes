import React from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook, FiTwitter, FiYoutube, FiMail, FiPhone, FiClock, FiMapPin } from 'react-icons/fi';

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
      // { name: "Track Order", path: "/track-order" },
      { name: "Return Policy", path: "/returns" },
      { name: "FAQs", path: "/faq" },
      { name: "My Account", path: "/account" },
    ],
    "CATEGORIES": [
      { name: "Perfumes", path: "/collections?category=Perfumes" },
      { name: "Bath & Body", path: "/collections?category=Bath-Body" },
      { name: "Skincare", path: "/collections?category=Skincare" },
      { name: "Gift Sets", path: "/collections?category=Gift-Sets" },
    ]
  };

  return (
    <footer className="bg-soft-black text-soft-white relative">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold/50 to-transparent"></div>
      
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Newsletter */}
        <div className="mb-12 md:mb-16 text-center max-w-3xl mx-auto">
          <h3 className="text-xl md:text-2xl font-serif text-gold mb-2 md:mb-3">Join Our Newsletter</h3>
          <p className="mb-4 md:mb-6 text-soft-white/70 text-sm font-sans">Stay updated with our latest fragrances and exclusive offers</p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-transparent text-soft-white border-b border-gold/50 focus:border-gold focus:outline-none placeholder-soft-white/40 transition-colors"
              required
            />
            <button className="btn-primary whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>

        {/* Decorative element */}
        <div className="flex items-center justify-center mb-8 md:mb-12">
          <div className="h-px w-12 md:w-16 bg-gold/30"></div>
          <span className="mx-3 md:mx-4 text-gold">✦</span>
          <div className="h-px w-12 md:w-16 bg-gold/30"></div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 mb-12 md:mb-16">
          {Object.entries(footerLinks).map(([title, links], index) => (
            <div key={title} className={index === 0 ? "col-span-1" : ""}>
              <h4 className="font-sans text-xs tracking-widest mb-4 md:mb-6 text-gold">{title}</h4>
              <ul className="space-y-2 md:space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.path} 
                      className="text-soft-white/70 hover:text-gold text-sm transition-colors inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Info */}
          <div className="col-span-1 xs:col-span-2 md:col-span-1">
            <h4 className="font-sans text-xs tracking-widest mb-4 md:mb-6 text-gold">CONTACT US</h4>
            <ul className="space-y-3 md:space-y-4 text-soft-white/70 text-sm">
              <li className="flex items-start">
                <FiMail className="mr-3 text-gold mt-1 flex-shrink-0" />
                <a href="mailto:support@veloriaperfumes.com" className="hover:text-gold transition-colors">
                  support@veloriaperfumes.com
                </a>
              </li>
              <li className="flex items-start">
                <FiPhone className="mr-3 text-gold mt-1 flex-shrink-0" />
                <a href="tel:+15551234567" className="hover:text-gold transition-colors">
                  +1 (555) 123-4567
                </a>
              </li>
              <li className="flex items-start">
                <FiClock className="mr-3 text-gold mt-1 flex-shrink-0" />
                <span>Mon - Fri: 9:00 AM - 6:00 PM</span>
              </li>
              <li className="flex items-start">
                <FiMapPin className="mr-3 text-gold mt-1 flex-shrink-0" />
                <address className="not-italic">
                  123 Fragrance Boulevard<br />
                  Scent City, SC 90210
                </address>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex justify-center space-x-4 md:space-x-6 mb-8 md:mb-12">
          {[
            { Icon: FiInstagram, label: 'Instagram', url: 'https://instagram.com' },
            { Icon: FiFacebook, label: 'Facebook', url: 'https://facebook.com' },
            { Icon: FiTwitter, label: 'Twitter', url: 'https://twitter.com' },
            { Icon: FiYoutube, label: 'YouTube', url: 'https://youtube.com' }
          ].map(({ Icon, label, url }) => (
            <a
              key={label}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-soft-white/60 hover:text-gold transition-colors w-8 h-8 md:w-10 md:h-10 flex items-center justify-center border border-soft-white/20 hover:border-gold"
              aria-label={label}
            >
              <Icon className="w-4 h-4 md:w-5 md:h-5" />
            </a>
          ))}
        </div>

        {/* Payment methods */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 mb-8 md:mb-12">
          <span className="text-soft-white/40 text-xs mb-2 sm:mb-0">Payment Methods:</span>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {['Visa', 'Mastercard', 'Amex', 'PayPal'].map(method => (
              <span key={method} className="px-2 py-1 bg-soft-white/5 border border-soft-white/10 text-soft-white/60 text-xs rounded-sm">
                {method}
              </span>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-soft-white/40 text-xs pt-6 md:pt-8 border-t border-soft-white/10">
          <p className="mb-1 md:mb-2">&copy; {currentYear} Veloria Perfumes. All rights reserved.</p>
          <p>Designed with ♥ for the finest fragrances</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 