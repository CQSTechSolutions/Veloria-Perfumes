import React from 'react';
import { Link } from 'react-router-dom';

const BestSellers = () => {
  const bestSellerProducts = [
    {
      id: 1,
      name: 'Veloria Midnight Bloom',
      image: 'https://images.unsplash.com/photo-1615265449494-ee3321e88b61?q=80&w=500&auto=format&fit=crop',
      price: 89.99,
      rating: 4.8,
      category: 'Floral'
    },
    {
      id: 3,
      name: 'Amber Mystique',
      image: 'https://images.unsplash.com/photo-1592945403407-9caf930b0c6a?q=80&w=500&auto=format&fit=crop',
      price: 129.99,
      rating: 4.9,
      category: 'Oriental'
    },
    {
      id: 4,
      name: 'Velvet Oud',
      image: 'https://images.unsplash.com/photo-1595425970377-c9fcfdd257a7?q=80&w=500&auto=format&fit=crop',
      price: 150.00,
      rating: 4.7,
      category: 'Woody'
    },
    {
      id: 7,
      name: 'Midnight Noir',
      image: 'https://images.unsplash.com/photo-1608528577891-eb055944f2e7?q=80&w=500&auto=format&fit=crop',
      price: 110.00,
      rating: 4.9,
      category: 'Woody'
    }
  ];

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
          <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
            <Link to={`/product/${product.id}`}>
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
    </div>
  );
};

export default BestSellers; 