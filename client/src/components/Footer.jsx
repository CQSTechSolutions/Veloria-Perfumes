import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-gray-900 text-white p-4 text-center">
      <p>&copy; {currentYear} Veloria Collections. All rights reserved.</p>
    </footer>
  );
};

export default Footer; 