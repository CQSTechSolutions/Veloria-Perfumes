import React from 'react';
import Navbar from '../header/Navbar';
import TopBar from '../header/TopBar';

const Header = () => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <TopBar />
      <Navbar />
    </div>
  )
}

export default Header;