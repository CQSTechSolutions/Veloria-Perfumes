import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const BestSellers = () => {
  const [bestSellerProducts, setBestSellerProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchBestSellers = async () => {
      let response;
      try {
        response = await fetch('http://localhost:3000/api/bestsellers');
        
        if (!response.ok) {
          if (response.status === 404) {
            setNotFound(true);
            setLoading(false);
            return;
          }
          throw new Error('Failed to fetch best sellers');
        }
        const result = await response.json();
        
        // Check the structure of the response and extract the data array
        const products = result.data || [];
        setBestSellerProducts(products.slice(0, 4));
        setLoading(false);
      } catch (err) {
        if (response && response.status === 404) {
          setNotFound(true);
          console.error('No best sellers found');
        }
        else{
          setError(err.message);
          console.error('Error fetching best sellers:', err);
        }
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, []);

  // Don't render anything if 404 Not Found
  if (notFound) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">Error: {error}</div>;
  }

  // Also don't render if no products found
  if (bestSellerProducts.length === 0) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 bg-gray-50">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Best Sellers</h2>
        <Link to="/bestsellers" className="text-indigo-600 font-medium hover:text-indigo-800">
          View All →
        </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {bestSellerProducts.map((product) => (
          <div key={product._id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
            <Link to={`/product/${product._id}`}>
              <div className="h-64 overflow-hidden relative">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  Best Seller
                </div>
              </div>
              
              <div className="p-4">
                <span className="text-sm text-indigo-600 font-medium">{product.category}</span>
                <h3 className="font-semibold text-lg mt-1">{product.name}</h3>
                
                <div className="flex items-center mt-1">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-gray-500 text-sm ml-1">({product.rating})</span>
                </div>
                
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-bold text-lg">₹{product.price.toFixed(2)}</span>
                  <button className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm hover:bg-indigo-700 transition-colors">
                    Add to Cart
                  </button>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BestSellers;
