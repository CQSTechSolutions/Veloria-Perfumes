import React from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchBar = () => {
  return (
    <div className="bg-white rounded-lg shadow-md py-6 px-8 mx-auto max-w-7xl mt-4 mb-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-2/5">
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <input
              type="text"
              placeholder="Search perfumes by name, brand or scent..."
              className="w-full py-3 px-4 focus:outline-none"
            />
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3">
              <FaSearch className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="w-full md:w-1/4">
          <div className="flex flex-col">
            <label className="text-gray-600 mb-1 text-sm">Category</label>
            <div className="relative">
              <select 
                className="w-full appearance-none border border-gray-300 rounded-lg py-3 px-4 pr-8 focus:outline-none"
              >
                <option value="">All Categories</option>
                <option value="floral">Floral</option>
                <option value="woody">Woody</option>
                <option value="oriental">Oriental</option>
                <option value="fresh">Fresh</option>
                <option value="citrus">Citrus</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Sort By */}
        <div className="w-full md:w-1/4">
          <div className="flex flex-col">
            <label className="text-gray-600 mb-1 text-sm">Sort By</label>
            <div className="relative">
              <select 
                className="w-full appearance-none border border-gray-300 rounded-lg py-3 px-4 pr-8 focus:outline-none"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="popular">Most Popular</option>
                <option value="best-rated">Best Rated</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar; 