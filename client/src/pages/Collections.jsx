import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Card from '../components/product/CollectionsCard';
import { FiPackage, FiFilter } from 'react-icons/fi';

const Collections = () => {
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchParams] = useSearchParams();

    useEffect(() => {
        setLoading(true);
        axios.get(`${import.meta.env.VITE_API_URL}/api/collection`)
            .then(res => {
                setCollections(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                setError('Failed to load collections');
                setLoading(false);
            });
    }, []);

    const categories = ['all', 'perfumes', 'gift sets', 'limited edition'];
    const searchQuery = searchParams.get('search') || '';

    const filteredCollections = collections
        .filter(collection => selectedCategory === 'all' || 
            collection.category?.toLowerCase() === selectedCategory)
        .filter(collection => 
            !searchQuery || 
            collection.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            collection.description?.toLowerCase().includes(searchQuery.toLowerCase())
        );

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
                    <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
                        {searchQuery 
                            ? `Search Results for "${searchQuery}"`
                            : "Our Collections"
                        }
                    </h1>
                    <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-blue-400 mx-auto mb-6 rounded-full" />
                    <p className="text-xl text-purple-100">
                        {searchQuery 
                            ? `Found ${filteredCollections.length} items`
                            : "Discover our exquisite range of fragrances"
                        }
                    </p>
                </motion.div>

                {/* Category Filters */}
                {!searchQuery && (
                    <div className="mb-12">
                        <div className="flex items-center justify-center gap-4 flex-wrap">
                            <FiFilter className="text-white" />
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300
                                        ${selectedCategory === category 
                                            ? 'bg-white text-purple-800' 
                                            : 'bg-white/10 text-white hover:bg-white/20'}`}
                                >
                                    {category.charAt(0).toUpperCase() + category.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Collections Grid */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {filteredCollections.map((collection) => (
                        <motion.div
                            key={collection._id || index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <Card 
                                product={{
                                    ...collection,
                                    rating: collection.rating || 5,
                                    reviews: collection.reviews || 0,
                                    price: collection.price || 0,
                                    category: collection.category || 'Collection'
                                }} 
                            />
                        </motion.div>
                    ))}
                </motion.div>

                {/* Empty State */}
                {filteredCollections.length === 0 && (
                    <div className="text-center text-white py-20">
                        <FiPackage className="w-16 h-16 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold mb-2">No Collections Found</h3>
                        <p className="text-purple-200">
                            Try adjusting your search or filter criteria
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Collections;
