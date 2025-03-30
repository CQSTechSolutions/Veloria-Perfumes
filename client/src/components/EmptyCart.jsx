import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';

const EmptyCart = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 min-h-[60vh] flex flex-col items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-indigo-100 rounded-full mb-6">
          <FaShoppingCart className="w-10 h-10 text-indigo-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Looks like you haven't added any items to your cart yet. Explore our collection and find your perfect fragrance.
        </p>
        <Link 
          to="/shop" 
          className="inline-block bg-indigo-600 text-white py-3 px-6 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    </div>
  );
};

export default EmptyCart;