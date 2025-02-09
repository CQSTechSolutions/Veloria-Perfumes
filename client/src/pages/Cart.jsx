import React, { useEffect, useState } from 'react';
import { FiShoppingCart, FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Cart = () => {
  const [token, setToken] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      fetchCartItems(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCartItems = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setCartItems(data.items);
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    try {
      const response = await fetch(`http://localhost:5000/api/cart/update/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ quantity: newQuantity })
      });
      if (response.ok) {
        fetchCartItems(token);
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeItem = async (itemId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/cart/remove/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        fetchCartItems(token);
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-red-200 to-red-500 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-red-200 to-red-500 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <FiShoppingCart className="mx-auto text-red-500 w-16 h-16 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Please Log In to View Your Cart</h2>
          <p className="text-gray-600 mb-6">Sign in to access your shopping cart and continue shopping.</p>
          <Link
            to="/account"
            className="inline-block bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition duration-200"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-red-200 to-red-500 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <FiShoppingCart className="mx-auto text-red-500 w-16 h-16 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-6">Add some items to your cart and start shopping!</p>
          <Link
            to="/collections"
            className="inline-block bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition duration-200"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-red-200 to-red-500 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-red-800 mb-8">Your Cart</h1>
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="p-6">
            {cartItems.map(item => (
              <div key={item.id} className="flex items-center py-6 border-b border-gray-200">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="flex-1 ml-4">
                  <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                  <p className="text-gray-600">₹{item.price.toFixed(2)}</p>
                  <div className="flex items-center mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                      className="p-1 rounded-full hover:bg-red-100"
                    >
                      <FiMinus className="w-5 h-5 text-red-600" />
                    </button>
                    <span className="mx-4 text-gray-700">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 rounded-full hover:bg-red-100"
                    >
                      <FiPlus className="w-5 h-5 text-red-600" />
                    </button>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p className="text-lg font-bold text-gray-800">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="mt-2 text-red-600 hover:text-red-800"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-gray-50 px-6 py-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Total</h3>
              <p className="text-2xl font-bold text-red-600">₹{totalPrice.toFixed(2)}</p>
            </div>
            <button className="mt-4 w-full bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition duration-200">
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;