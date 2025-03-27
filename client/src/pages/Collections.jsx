import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Card from '../components/product/CollectionsCard';
import { FiPackage, FiFilter, FiGrid, FiList, FiSearch } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const Collections = () => {
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchParams] = useSearchParams();
    const [cartItems, setCartItems] = useState([]);
    const [wishlistItems, setWishlistItems] = useState([]);
    const [availableCategories, setAvailableCategories] = useState([]);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [sortBy, setSortBy] = useState('newest'); // 'newest', 'price-low', 'price-high'
    
    // Get category from URL params
    const categoryParam = searchParams.get('category');

    useEffect(() => {
        // Set selected category from URL parameter if available
        if (categoryParam) {
            setSelectedCategory(categoryParam);
        }
    }, [categoryParam]);

    useEffect(() => {
        setLoading(true);
        // Use the category parameter in the API request if it exists
        const apiUrl = categoryParam 
            ? `${import.meta.env.VITE_API_URL}/api/collection?category=${categoryParam}`
            : `${import.meta.env.VITE_API_URL}/api/collection`;
            
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
    }, [categoryParam]); // Re-fetch when category param changes

    const searchQuery = searchParams.get('search') || '';

    const filteredCollections = collections.filter(collection => {
        console.log("Collection Category:", collection.category);
        console.log("Selected Category:", selectedCategory);
    
        if (selectedCategory === 'all') {
            console.log("Showing all collections");
            return true;
        }
    
        if (Array.isArray(collection.category)) {
            const matches = collection.category.some(cat => 
                cat.toLowerCase() === selectedCategory.toLowerCase()
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
            <div className="min-h-screen bg-gradient-to-br from-purple-800 via-purple-600 to-blue-700 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
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
        <div className="min-h-screen bg-gradient-to-br from-purple-800 via-purple-600 to-blue-700">
            {/* Decorative overlay pattern */}
            <div className="absolute inset-0 opacity-10 bg-[url('/pattern.png')] pointer-events-none" />
            
            <div className="relative container mx-auto px-4 py-16">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-3xl md:text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
                        {searchQuery 
                            ? `Search Results for "${searchQuery}"`
                            : "Our Collections"
                        }
                    </h1>
                        <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-blue-400 mx-auto mb-6 rounded-full" />
                    <p className="text-xl text-purple-100 my-4">
                        {searchQuery 
                            ? `Found ${filteredCollections.length} items`
                            : "Discover our exquisite range of fragrances"
                        }
                    </p>
                </motion.div>

                {/* Filters and Controls */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white/10 backdrop-blur-md rounded-xl p-4 mb-8"
                >
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        {/* Category Filters */}
                        {!searchQuery && (
                            <div className="flex items-center justify-center gap-4 flex-wrap">
                                <FiFilter className="text-white" />
                                <button
                                    onClick={() => setSelectedCategory('all')}
                                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300
                                        ${selectedCategory === 'all' 
                                            ? 'bg-white text-purple-800' 
                                            : 'bg-white/10 text-white hover:bg-white/20'}`}
                                >
                                    All
                                </button>
                                {availableCategories.map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => setSelectedCategory(category.toLowerCase())}
                                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300
                                            ${selectedCategory === category.toLowerCase() 
                                                ? 'bg-white text-purple-800' 
                                                : 'bg-white/10 text-white hover:bg-white/20'}`}
                                    >
                                        {category.charAt(0).toUpperCase() + category.slice(1)}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* View and Sort Controls */}
                        <div className="flex items-center gap-4">
                            {/* View Mode Toggle */}
                            <div className="bg-white/10 rounded-lg p-1 flex">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white/20' : ''}`}
                                    title="Grid View"
                                >
                                    <FiGrid className="text-white" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-white/20' : ''}`}
                                    title="List View"
                                >
                                    <FiList className="text-white" />
                                </button>
                            </div>

                            {/* Sort Dropdown */}
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-white/10 text-white border-none rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white/30"
                            >
                                <option value="newest" className="bg-purple-800">Newest First</option>
                                <option value="price-low" className="bg-purple-800">Price: Low to High</option>
                                <option value="price-high" className="bg-purple-800">Price: High to Low</option>
                                <option value="name-asc" className="bg-purple-800">Name: A to Z</option>
                                <option value="name-desc" className="bg-purple-800">Name: Z to A</option>
                            </select>
                        </div>
                    </div>
                </motion.div>

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
                                className="text-center text-white py-20 bg-white/10 backdrop-blur-sm rounded-xl p-8"
                            >
                                <FiPackage className="w-16 h-16 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold mb-2">No Collections Found</h3>
                                <p className="text-purple-200 mb-6">
                                    Try adjusting your search or filter criteria
                                </p>
                                <button 
                                    onClick={() => setSelectedCategory('all')}
                                    className="px-6 py-3 bg-white text-purple-800 rounded-full font-medium hover:bg-purple-100 transition-colors"
                                >
                                    View All Collections
                                </button>
                            </motion.div>
                        )}

                        {/* Pagination - if needed */}
                        {filteredCollections.length > 0 && (
                            <div className="mt-12 flex justify-center">
                                <div className="inline-flex rounded-md shadow-sm">
                                    <button className="px-4 py-2 text-sm font-medium text-white bg-white/10 rounded-l-lg hover:bg-white/20">
                                        Previous
                                    </button>
                                    <button className="px-4 py-2 text-sm font-medium text-purple-800 bg-white">
                                        1
                                    </button>
                                    <button className="px-4 py-2 text-sm font-medium text-white bg-white/10 hover:bg-white/20">
                                        2
                                    </button>
                                    <button className="px-4 py-2 text-sm font-medium text-white bg-white/10 hover:bg-white/20">
                                        3
                                    </button>
                                    <button className="px-4 py-2 text-sm font-medium text-white bg-white/10 rounded-r-lg hover:bg-white/20">
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Newsletter Subscription */}
                    <div className="bg-white/5 backdrop-blur-md py-16 mt-16">
                        <div className="container mx-auto px-4">
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                viewport={{ once: true }}
                                className="max-w-2xl mx-auto text-center"
                            >
                                <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
                                <p className="text-purple-200 mb-8">
                                    Subscribe to our newsletter for exclusive offers and updates on new collections
                                </p>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <input 
                                        type="email" 
                                        placeholder="Your email address" 
                                        className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                                    />
                                    <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium rounded-lg hover:opacity-90 transition-opacity">
                                        Subscribe
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            );
        };
        
        export default Collections;
