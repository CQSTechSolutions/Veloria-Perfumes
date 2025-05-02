import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Card from '../components/product/Card';
import { FiPackage, FiFilter, FiGrid, FiList, FiSearch } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const Collections = () => {
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchParams, setSearchParams] = useSearchParams();
    const [cartItems, setCartItems] = useState([]);
    const [wishlistItems, setWishlistItems] = useState([]);
    const [availableCategories, setAvailableCategories] = useState([]);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [sortBy, setSortBy] = useState('newest'); // 'newest', 'price-low', 'price-high'
    const [searchValue, setSearchValue] = useState(''); // New state for search input
    
    // Get parameters from URL params
    const categoryParam = searchParams.get('category');
    const searchQuery = searchParams.get('search') || '';

    useEffect(() => {
        // Set search input value from URL parameter
        if (searchQuery) {
            setSearchValue(searchQuery);
        }
    }, [searchQuery]);

    useEffect(() => {
        // Set selected category from URL parameter if available
        if (categoryParam) {
            setSelectedCategory(categoryParam);
        } else {
            setSelectedCategory('all');
        }
    }, [categoryParam]);

    // Update URL when category changes
    const handleCategoryChange = (category) => {
        if (category === 'all') {
            // Remove category param if "all" is selected
            searchParams.delete('category');
            setSearchParams(searchParams);
        } else {
            // Set category param for specific category - preserve original case
            setSearchParams({ ...Object.fromEntries(searchParams), category });
        }
        setSelectedCategory(category);
    };

    useEffect(() => {
        setLoading(true);
        // Build the API URL with all necessary parameters
        let apiUrl = `${import.meta.env.VITE_API_URL}/api/collection`;
        
        // Start with empty params object and build it
        const params = new URLSearchParams();
        
        // Add category if it exists
        if (categoryParam) {
            params.append('category', categoryParam);
        }
        
        // Add search query if it exists
        if (searchQuery) {
            params.append('search', searchQuery);
        }
        
        // Add the params to the URL if any exist
        if (params.toString()) {
            apiUrl = `${apiUrl}?${params.toString()}`;
        }
        
        console.log("Fetching from:", apiUrl);
            
        axios.get(apiUrl)
            .then(res => {
                console.log("API Response:", res.data);
                setCollections(res.data);
                setLoading(false);

                // Generate unique categories
                const allCategories = res.data.reduce((acc, collection) => {
                    if (Array.isArray(collection.category)) {
                        collection.category.forEach((cat) => {
                            if (typeof cat === 'string' && !acc.includes(cat)) {
                                acc.push(cat);
                            }
                        });
                    } else if (typeof collection.category === 'string' && !acc.includes(collection.category)) {
                        acc.push(collection.category);
                    }
                    return acc;
                }, []);
                
                setAvailableCategories(allCategories);
            })
            .catch(err => {
                console.error("Error fetching collections:", err);
                setError(err.message || 'Failed to fetch collections');
                setLoading(false);
                toast.error('Failed to load collections');
            });
    }, [categoryParam, searchQuery]); // Re-fetch when category or search params change

    // Handle search submission
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchValue.trim()) {
            // Set search param and preserve other params
            setSearchParams({ ...Object.fromEntries(searchParams), search: searchValue.trim() });
        } else {
            // Remove search param if empty
            searchParams.delete('search');
            setSearchParams(searchParams);
        }
    };

    // Clear search
    const clearSearch = () => {
        setSearchValue('');
        searchParams.delete('search');
        setSearchParams(searchParams);
    };

    // Modified filtering logic - case insensitive
    const filteredCollections = collections.filter(collection => {
        console.log("Collection Category:", collection.category);
        console.log("Selected Category:", selectedCategory);
    
        if (selectedCategory === 'all') {
            console.log("Showing all collections");
            return true;
        }
    
        if (Array.isArray(collection.category)) {
            const matches = collection.category.some(cat => 
                typeof cat === 'string' && cat.toLowerCase() === selectedCategory.toLowerCase()
            );
            console.log("Array category match:", matches);
            return matches;
        } else if (typeof collection.category === 'string') {
            const matches = collection.category.toLowerCase() === selectedCategory.toLowerCase();
            console.log("String category match:", matches);
            return matches;
        }
    
        console.log("Category not matched");
        return false;
    });

    // Sort the filtered collections
    const sortedCollections = [...filteredCollections].sort((a, b) => {
        if (sortBy === 'price-low') {
            return a.price - b.price;
        } else if (sortBy === 'price-high') {
            return b.price - a.price;
        } else if (sortBy === 'name-asc') {
            return a.name.localeCompare(b.name);
        } else if (sortBy === 'name-desc') {
            return b.name.localeCompare(a.name);
        } else {
            // Default: newest first (assuming there's a createdAt field)
            return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        }
    });

    console.log("Filtered Collections:", filteredCollections);

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setCartItems([]);
                setWishlistItems([]);
                return;
            }

            // Fetch cart items
            const cartResponse = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/cart`,
                {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            // Fetch wishlist items
            const wishlistResponse = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/wishlist`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (cartResponse.data.success) {
                setCartItems(cartResponse.data.cart.items || []);
            }

            if (wishlistResponse.data.success) {
                // Extract product IDs from wishlist items
                const wishlistProductIds = wishlistResponse.data.wishlist.items.map(
                    item => item.product._id
                );
                setWishlistItems(wishlistProductIds);
            }

        } catch (error) {
            console.error('Error fetching user data:', error);
            setCartItems([]);
            setWishlistItems([]);
        }
    };

    const toggleWishlist = async (productId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Please login to add to wishlist');
                return;
            }

            const isInWishlist = wishlistItems.includes(productId);
            const method = isInWishlist ? 'delete' : 'post';
            const endpoint = isInWishlist ? 'remove' : 'add';

            const response = await axios({
                method,
                url: `${import.meta.env.VITE_API_URL}/api/wishlist/${endpoint}/${productId}`,
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setWishlistItems(prev => 
                    isInWishlist 
                        ? prev.filter(id => id !== productId)
                        : [...prev, productId]
                );
                toast.success(
                    isInWishlist ? 'Removed from wishlist' : 'Added to wishlist',
                    { icon: isInWishlist ? '💔' : '❤️' }
                );
            }
        } catch (error) {
            console.error('Wishlist error:', error);
            toast.error('Failed to update wishlist');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-800 via-purple-600 to-blue-700 flex items-center justify-center">
                <div className="text-white text-center">
                    <FiPackage className="w-16 h-16 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Oops!</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                        {searchQuery 
                            ? `Search Results for "${searchQuery}"`
                            : selectedCategory !== 'all' 
                              ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Collection`
                              : "Our Collection"
                        }
                    </h1>
                    <div className="w-24 h-1 bg-purple-600 mx-auto mb-6 rounded-full" />
                    <p className="text-lg text-gray-600 my-4">
                        {searchQuery 
                            ? `Found ${filteredCollections.length} items`
                            : "Discover our exquisite range of fragrances"
                        }
                    </p>
                </motion.div>

                {/* Search Bar */}
                <div className="mb-8">
                    <form onSubmit={handleSearch} className="flex w-full max-w-lg mx-auto">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                            />
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            {searchQuery && (
                                <button 
                                    type="button" 
                                    onClick={clearSearch}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    &times;
                                </button>
                            )}
                        </div>
                        <button 
                            type="submit" 
                            className="bg-purple-600 text-white px-4 py-3 rounded-r-lg hover:bg-purple-700 transition-colors"
                        >
                            Search
                        </button>
                    </form>
                </div>

                {/* Filters and Controls Section */}
                <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Category Filters */}
                    <div className="overflow-x-auto pb-2 md:pb-0">
                        <div className="flex space-x-2">
                            <button
                                onClick={() => handleCategoryChange('all')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-300
                                    ${selectedCategory === 'all' 
                                        ? 'bg-purple-600 text-white' 
                                        : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'}`}
                            >
                                All Products
                            </button>
                            
                            {availableCategories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => handleCategoryChange(category)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-300
                                        ${selectedCategory.toLowerCase() === category.toLowerCase() 
                                            ? 'bg-purple-600 text-white' 
                                            : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'}`}
                                >
                                    {category.charAt(0).toUpperCase() + category.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* View and Sort Controls */}
                    <div className="flex items-center gap-4">
                        {/* Sort Dropdown */}
                        <select 
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-white border border-gray-200 text-gray-700 py-2 px-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                        >
                            <option value="newest">Newest</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="name-asc">Name: A to Z</option>
                            <option value="name-desc">Name: Z to A</option>
                        </select>
                        
                        {/* View Mode Toggle */}
                        <div className="bg-white border border-gray-200 rounded-lg p-1 flex">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-purple-100 text-purple-600' : 'text-gray-500'}`}
                                title="Grid View"
                            >
                                <FiGrid />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded ${viewMode === 'list' ? 'bg-purple-100 text-purple-600' : 'text-gray-500'}`}
                                title="List View"
                            >
                                <FiList />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Collections Grid/List */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className={viewMode === 'grid' 
                        ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                        : "flex flex-col space-y-4"
                    }
                >
                    {sortedCollections.map((collection) => (
                        <motion.div
                            key={collection._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className={viewMode === 'list' ? "w-full" : ""}
                        >
                            <Card 
                                product={collection}
                                onCartUpdate={fetchUserData}
                                isInCart={cartItems.some(item => item.productId === collection._id)}
                                onWishlistUpdate={toggleWishlist}
                                isInWishlist={wishlistItems.includes(collection._id)}
                            />
                        </motion.div>
                    ))}
                </motion.div>
        
                {/* Empty State */}
                {filteredCollections.length === 0 && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="text-center py-20 bg-white shadow-sm rounded-xl p-8"
                    >
                        <FiPackage className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <h3 className="text-2xl font-bold mb-2 text-gray-900">No Products Found</h3>
                        <p className="text-gray-600 mb-6">
                            Try adjusting your search or filter criteria
                        </p>
                        <button 
                            onClick={() => {
                                // Clear search and category filters
                                setSearchValue('');
                                setSelectedCategory('all');
                                setSearchParams({});
                            }}
                            className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
                        >
                            View All Products
                        </button>
                    </motion.div>
                )}

                {/* Pagination - if needed */}
                {filteredCollections.length > 12 && (
                    <div className="mt-12 flex justify-center">
                        <div className="inline-flex rounded-md shadow-sm">
                            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-50">
                                Previous
                            </button>
                            <button className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-purple-600">
                                1
                            </button>
                            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50">
                                2
                            </button>
                            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50">
                                3
                            </button>
                            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-50">
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Collections;
