import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FeaturedProducts = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  
  const allPerfumes = [
    {
      id: 1,
      name: 'Veloria Midnight Bloom',
      image: 'https://images.unsplash.com/photo-1615265449494-ee3321e88b61?q=80&w=500&auto=format&fit=crop',
      price: 89.99,
      rating: 4.8,
      category: 'Floral'
    },
    {
      id: 2,
      name: 'Azure Dreams',
      image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=500&auto=format&fit=crop',
      price: 75.50,
      rating: 4.6,
      category: 'Fresh'
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
      id: 5,
      name: 'Citrus Breeze',
      image: 'https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?q=80&w=500&auto=format&fit=crop',
      price: 65.99,
      rating: 4.5,
      category: 'Citrus'
    },
    {
      id: 6,
      name: 'Rose Elixir',
      image: 'https://images.unsplash.com/photo-1590736969955-71f627a216ea?q=80&w=500&auto=format&fit=crop',
      price: 95.00,
      rating: 4.8,
      category: 'Floral'
    },
    {
      id: 7,
      name: 'Midnight Noir',
      image: 'https://images.unsplash.com/photo-1608528577891-eb055944f2e7?q=80&w=500&auto=format&fit=crop',
      price: 110.00,
      rating: 4.9,
      category: 'Woody'
    },
    {
      id: 8,
      name: 'Lavender Fields',
      image: 'https://images.unsplash.com/photo-1612097790261-49fa27593ad1?q=80&w=500&auto=format&fit=crop',
      price: 85.99,
      rating: 4.7,
      category: 'Floral'
    },
    {
      id: 9,
      name: 'Sandalwood Musk',
      image: 'https://images.unsplash.com/photo-1596742578443-7682ef5251cd?q=80&w=500&auto=format&fit=crop',
      price: 115.50,
      rating: 4.6,
      category: 'Woody'
    },
    {
      id: 10,
      name: 'Ocean Breeze',
      image: 'https://images.unsplash.com/photo-1593487568720-92097fb460fb?q=80&w=500&auto=format&fit=crop',
      price: 79.99,
      rating: 4.4,
      category: 'Fresh'
    },
    {
      id: 11,
      name: 'Vanilla Dreams',
      image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=500&auto=format&fit=crop',
      price: 82.50,
      rating: 4.7,
      category: 'Oriental'
    },
    {
      id: 12,
      name: 'Jasmine Whisper',
      image: 'https://images.unsplash.com/photo-1566977776052-6e61e28f31d9?q=80&w=500&auto=format&fit=crop',
      price: 92.99,
      rating: 4.8,
      category: 'Floral'
    }
  ];

  // Get current perfumes for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPerfumes = allPerfumes.slice(indexOfFirstItem, indexOfLastItem);
  
  // Calculate total pages
  const totalPages = Math.ceil(allPerfumes.length / itemsPerPage);
  
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // Next and previous page
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">All Perfumes</h2>
        <div className="text-gray-600">
          Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, allPerfumes.length)} of {allPerfumes.length} products
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentPerfumes.map((perfume) => (
          <div key={perfume.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
            <Link to={`/product/${perfume.id}`}>
              <div className="h-64 overflow-hidden">
                <img 
                  src={perfume.image} 
                  alt={perfume.name} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              <div className="p-4">
                <span className="text-sm text-indigo-600 font-medium">{perfume.category}</span>
                <h3 className="font-semibold text-lg mt-1">{perfume.name}</h3>
                
                <div className="flex items-center mt-1">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(perfume.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-gray-500 text-sm ml-1">({perfume.rating})</span>
                </div>
                
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-bold text-lg">${perfume.price.toFixed(2)}</span>
                  <button className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm hover:bg-indigo-700 transition-colors">
                    Add to Cart
                  </button>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
      
      {/* Pagination */}
      <div className="flex justify-center mt-10">
        <nav className="inline-flex rounded-md shadow">
          <button 
            onClick={goToPrevPage} 
            disabled={currentPage === 1}
            className={`px-3 py-2 rounded-l-md border border-gray-300 ${
              currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Previous
          </button>
          
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => paginate(i + 1)}
              className={`px-4 py-2 border-t border-b border-gray-300 ${
                currentPage === i + 1 
                  ? 'bg-indigo-600 text-white border-indigo-600' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {i + 1}
            </button>
          ))}
          
          <button 
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className={`px-3 py-2 rounded-r-md border border-gray-300 ${
              currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Next
          </button>
        </nav>
      </div>
    </div>
  );
};

export default FeaturedProducts; 