import React, { useState, useEffect } from 'react';
import HomeCarousel from '../components/header/HomeCarousel';
import Card from '../components/product/Card';
import categoryData from "./categories.json"
import PromotionalBanner from '../components/PromotionalBanner';
import Reviews from '../components/Reviews';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

const Home = () => {
    const [bestSellers, setBestSellers] = useState([]);
    const [newArrivals, setNewArrivals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                // Fetch best sellers
                const bestSellersResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/collection?category=Best Sellers`);
                setBestSellers(bestSellersResponse.data.slice(0, 4)); // Limit to 4 products
                
                // Fetch new arrivals
                const newArrivalsResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/collection?category=New Arrivals`);
                setNewArrivals(newArrivalsResponse.data.slice(0, 4)); // Limit to 4 products
            } catch (error) {
                console.error('Error fetching products:', error);
                toast.error('Failed to load products');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Animation variants
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (
        <div className="min-h-screen paper-texture pb-8">
            <HomeCarousel />

            {/* Featured Categories */}
            <section className="py-12 md:py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <motion.div 
                        initial="hidden" 
                        whileInView="visible" 
                        viewport={{ once: true }}
                        variants={fadeIn}
                        className="text-center mb-10 md:mb-12"
                    >
                        <h2 className="text-2xl md:text-3xl font-serif text-burgundy mb-2">Our Collections</h2>
                        <div className="w-24 h-px bg-gold mx-auto"></div>
                    </motion.div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 md:gap-6">
                        {categoryData.categories.map((category, index) => (
                            <motion.div
                                key={category.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <Link to={`/collections?category=${category.slug}`} className="flex flex-col items-center group">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full overflow-hidden mb-2 md:mb-3 border border-gold/20 transition-all duration-300 group-hover:border-gold">
                                        <img src={category.image} alt={category.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    </div>
                                    <span className="text-xs sm:text-sm uppercase tracking-wider font-medium text-soft-black group-hover:text-burgundy transition-colors text-center">{category.name}</span>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Bestsellers */}
            <section className="py-12 md:py-16 px-4 bg-cream/50">
                <div className="max-w-7xl mx-auto">
                    <motion.div 
                        initial="hidden" 
                        whileInView="visible" 
                        viewport={{ once: true }}
                        variants={fadeIn}
                        className="text-center mb-10 md:mb-12"
                    >
                        <h2 className="text-2xl md:text-3xl font-serif text-burgundy mb-2">Best Sellers</h2>
                        <div className="w-24 h-px bg-gold mx-auto"></div>
                    </motion.div>
                    
                    {loading ? (
                        <div className="flex justify-center items-center h-48 md:h-64">
                            <div className="w-10 h-10 md:w-12 md:h-12 border-2 border-burgundy border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                            {bestSellers.map((product, index) => (
                                <motion.div
                                    key={product._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <Card product={product} />
                                </motion.div>
                            ))}
                        </div>
                    )}
                    
                    <motion.div 
                        initial="hidden" 
                        whileInView="visible" 
                        viewport={{ once: true }}
                        variants={fadeIn}
                        className="text-center mt-8 md:mt-10"
                    >
                        <Link to="/collections?category=Best Sellers" className="btn-outline">
                            View All
                        </Link>
                    </motion.div>
                </div>
            </section>

            <PromotionalBanner />

            {/* New Arrivals */}
            <section className="py-12 md:py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <motion.div 
                        initial="hidden" 
                        whileInView="visible" 
                        viewport={{ once: true }}
                        variants={fadeIn}
                        className="text-center mb-10 md:mb-12"
                    >
                        <h2 className="text-2xl md:text-3xl font-serif text-burgundy mb-2">New Arrivals</h2>
                        <div className="w-24 h-px bg-gold mx-auto"></div>
                    </motion.div>
                    
                    {loading ? (
                        <div className="flex justify-center items-center h-48 md:h-64">
                            <div className="w-10 h-10 md:w-12 md:h-12 border-2 border-burgundy border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                            {newArrivals.map((product, index) => (
                                <motion.div
                                    key={product._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <Card product={product} />
                                </motion.div>
                            ))}
                        </div>
                    )}
                    
                    <motion.div 
                        initial="hidden" 
                        whileInView="visible" 
                        viewport={{ once: true }}
                        variants={fadeIn}
                        className="text-center mt-8 md:mt-10"
                    >
                        <Link to="/collections?category=New Arrivals" className="btn-outline">
                            View All
                        </Link>
                    </motion.div>
                </div>
            </section>

            <Reviews />
        </div>
    );
};

export default Home;
