import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';

const Search = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortBy, setSortBy] = useState('relevance');
  
  // Get unique categories from products
  const categories = [...new Set(products.map(product => product.category))];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/products');
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const result = await response.json();
        const allProducts = result.data || [];
        setProducts(allProducts);
        
        // Initial filtering based on search query
        filterProducts(allProducts, searchQuery, selectedCategories, priceRange, sortBy);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error('Error fetching products:', err);
      }
    };

    fetchProducts();
  }, [initialQuery]);

  // Filter products based on search query and filters
  const filterProducts = (allProducts, query, categories, price, sort) => {
    let filtered = [...allProducts];
    
    // Filter by search query
    if (query) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    // Filter by categories
    if (categories.length > 0) {
      filtered = filtered.filter(product => categories.includes(product.category));
    }
    
    // Filter by price range
    filtered = filtered.filter(product => 
      product.price >= price[0] && product.price <= price[1]
    );
    
    // Sort products
    switch (sort) {
      case 'price-low-high':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high-low':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // relevance - no specific sorting
        break;
    }
    
    setFilteredProducts(filtered);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    filterProducts(products, searchQuery, selectedCategories, priceRange, sortBy);
    
    // Update URL with search query
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('q', searchQuery);
    window.history.pushState({}, '', `${location.pathname}?${searchParams.toString()}`);
  };

  const handleCategoryChange = (category) => {
    const updatedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    
    setSelectedCategories(updatedCategories);
    filterProducts(products, searchQuery, updatedCategories, priceRange, sortBy);
  };

  const handlePriceChange = (e, index) => {
    const newPriceRange = [...priceRange];
    newPriceRange[index] = Number(e.target.value);
    setPriceRange(newPriceRange);
    filterProducts(products, searchQuery, selectedCategories, newPriceRange, sortBy);
  };

  const handleSortChange = (e) => {
    const newSortBy = e.target.value;
    setSortBy(newSortBy);
    filterProducts(products, searchQuery, selectedCategories, priceRange, newSortBy);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 500]);
    setSortBy('relevance');
    filterProducts(products, searchQuery, [], [0, 500], 'relevance');
  };

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
        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex w-full">
            <div className="relative flex-grow">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for perfumes..."
                className="w-full px-4 py-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    filterProducts(products, '', selectedCategories, priceRange, sortBy);
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FaTimes />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-3 rounded-r-md hover:bg-indigo-700 transition-colors"
            >
              <FaSearch />
            </button>
          </form>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters - Desktop */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">Filters</h3>
                <button 
                  onClick={clearFilters}
                  className="text-sm text-indigo-600 hover:text-indigo-800"
                >
                  Clear All
                </button>
              </div>
              
              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-medium mb-2">Categories</h4>
                <div className="space-y-2">
                  {categories.map(category => (
                    <div key={category} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`category-${category}`}
                        checked={selectedCategories.includes(category)}
                        onChange={() => handleCategoryChange(category)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`category-${category}`} className="ml-2 text-sm text-gray-700">
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium mb-2">Price Range</h4>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">${priceRange[0]}</span>
                    <span className="text-sm text-gray-600">${priceRange[1]}</span>
                  </div>
                  <div className="flex space-x-4">
                    <input
                      type="range"
                      min="0"
                      max="500"
                      value={priceRange[0]}
                      onChange={(e) => handlePriceChange(e, 0)}
                      className="w-full"
                    />
                    <input
                      type="range"
                      min="0"
                      max="500"
                      value={priceRange[1]}
                      onChange={(e) => handlePriceChange(e, 1)}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
              
              {/* Sort By */}
              <div>
                <h4 className="font-medium mb-2">Sort By</h4>
                <select
                  value={sortBy}
                  onChange={handleSortChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="relevance">Relevance</option>
                  <option value="price-low-high">Price: Low to High</option>
                  <option value="price-high-low">Price: High to Low</option>
                  <option value="rating">Rating</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Mobile Filters Button */}
          <div className="md:hidden mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full flex items-center justify-center space-x-2 bg-white p-3 rounded-lg shadow-md"
            >
              <FaFilter />
              <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
            </button>
          </div>
          
          {/* Mobile Filters */}
          {showFilters && (
            <div className="md:hidden mb-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg">Filters</h3>
                  <button 
                    onClick={clearFilters}
                    className="text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    Clear All
                  </button>
                </div>
                
                {/* Categories */}
                <div className="mb-6">
                  <h4 className="font-medium mb-2">Categories</h4>
                  <div className="space-y-2">
                    {categories.map(category => (
                      <div key={category} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`mobile-category-${category}`}
                          checked={selectedCategories.includes(category)}
                          onChange={() => handleCategoryChange(category)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`mobile-category-${category}`} className="ml-2 text-sm text-gray-700">
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Price Range */}
                <div className="mb-6">
                  <h4 className="font-medium mb-2">Price Range</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">${priceRange[0]}</span>
                      <span className="text-sm text-gray-600">${priceRange[1]}</span>
                    </div>
                    <div className="flex space-x-4">
                      <input
                        type="range"
                        min="0"
                        max="500"
                        value={priceRange[0]}
                        onChange={(e) => handlePriceChange(e, 0)}
                        className="w-full"
                      />
                      <input
                        type="range"
                        min="0"
                        max="500"
                        value={priceRange[1]}
                        onChange={(e) => handlePriceChange(e, 1)}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Sort By */}
                <div>
                  <h4 className="font-medium mb-2">Sort By</h4>
                  <select
                    value={sortBy}
                    onChange={handleSortChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="price-low-high">Price: Low to High</option>
                    <option value="price-high-low">Price: High to Low</option>
                    <option value="rating">Rating</option>
                  </select>
                </div>
              </div>
            </div>
          )}
          
          {/* Search Results */}
          <div className="flex-grow">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'Result' : 'Results'}
                {searchQuery && <span> for "{searchQuery}"</span>}
              </h2>
              
              {/* Sort By - Mobile */}
              <div className="md:hidden">
                <select
                  value={sortBy}
                  onChange={handleSortChange}
                  className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="relevance">Relevance</option>
                  <option value="price-low-high">Price: Low to High</option>
                  <option value="price-high-low">Price: High to Low</option>
                  <option value="rating">Rating</option>
                </select>
              </div>
            </div>
            
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-md">
                <FaSearch className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No products found</h3>
                <p className="mt-2 text-gray-500">
                  Try adjusting your search or filter criteria.
                </p>
                {(searchQuery || selectedCategories.length > 0 || priceRange[0] > 0 || priceRange[1] < 500) && (
                  <button
                    onClick={clearFilters}
                    className="mt-4 text-indigo-600 hover:text-indigo-800"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
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
                                          <button 
                                            onClick={(e) => {
                                              e.preventDefault();
                                              // Add to cart functionality will be implemented later
                                              console.log(`Added ${product.name} to cart`);
                                            }}
                                            className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm hover:bg-indigo-700 transition-colors"
                                          >
                                            Add to Cart
                                          </button>
                                        </div>
                                      </div>
                                    </Link>
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            {/* Pagination - can be added later if needed */}
                          </div>
                        </div>
                      </div>
                      <Footer />
                    </>
                  );
                };

                export default Search;