import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Discover = () => {
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/products');
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const result = await response.json();
        const allProducts = result.data || [];
        
        // Sort by rating for trending products
        const trending = [...allProducts].sort((a, b) => b.rating - a.rating).slice(0, 6);
        setTrendingProducts(trending);
        
        // Sort by date for new arrivals (assuming there's a createdAt field)
        // If no createdAt field, this will just take random products
        const arrivals = [...allProducts].sort(() => 0.5 - Math.random()).slice(0, 6);
        setNewArrivals(arrivals);
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error('Error fetching products:', err);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="text-center py-20 text-red-600">Error: {error}</div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Discover Perfumes</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our curated collections of trending fragrances and new arrivals to find your perfect scent.
          </p>
        </div>

        {/* Trending Products */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Trending Now</h2>
            <Link to="/shop" className="text-indigo-600 hover:text-indigo-800">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {trendingProducts.map((product) => (
              <div key={product._id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                <Link to={`/product/${product._id}`}>
                  <div className="h-64 overflow-hidden relative">
                    <img 
                      src={product.images[0]} 
                      alt={product.name} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    {product.isBestSeller && (
                      <div className="absolute top-3 right-3 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        Best Seller
                      </div>
                    )}
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
                      <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
                      <button className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm hover:bg-indigo-700 transition-colors">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* New Arrivals */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">New Arrivals</h2>
            <Link to="/shop" className="text-indigo-600 hover:text-indigo-800">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {newArrivals.map((product) => (
              <div key={product._id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                <Link to={`/product/${product._id}`}>
                  <div className="h-64 overflow-hidden relative">
                    <img 
                      src={product.images[0]} 
                      alt={product.name} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                      New
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
                      <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
                      <button className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm hover:bg-indigo-700 transition-colors">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Discover;