import React, { useState, useEffect } from 'react';
import Navbar from '../header/Navbar';
import TopBar from '../header/TopBar';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setIsScrolled(offset > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'md:translate-y-0' : 'md:translate-y-0'}`}>
      <div className={`transition-all duration-300 ${isScrolled ? 'md:h-0 md:opacity-0 md:overflow-hidden' : ''}`}>
        <TopBar />
      </div>
      <Navbar />
    </div>
  );
};

export default Header;