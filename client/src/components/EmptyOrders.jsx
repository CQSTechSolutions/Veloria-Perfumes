import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingBag, FaHistory } from 'react-icons/fa';

const EmptyOrders = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Your Order History</h1>
      
      <div className="bg-white rounded-lg shadow-md p-10">
        <div className="text-center max-w-md mx-auto">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 rounded-full mb-6">
            <FaHistory className="w-10 h-10 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-semibold mb-3">No orders yet</h2>
          <p className="text-gray-600 mb-8">
            You haven't placed any orders with us yet. Start shopping and discover our premium fragrances.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/shop" 
              className="inline-flex items-center justify-center bg-indigo-600 text-white py-3 px-6 rounded-md hover:bg-indigo-700 transition-colors"
            >
              <FaShoppingBag className="mr-2" /> Start Shopping
            </Link>
            <Link 
              to="/bestsellers" 
              className="inline-flex items-center justify-center border border-indigo-600 text-indigo-600 py-3 px-6 rounded-md hover:bg-indigo-50 transition-colors"
            >
              View Best Sellers
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyOrders;