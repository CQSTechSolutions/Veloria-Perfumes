import React, { useState, useEffect } from 'react';
import HomeCarousel from '../components/header/HomeCarousel';
import Card from '../components/product/Card';
import categoryData from "./categories.json"
import PromotionalBanner from '../components/PromotionalBanner';
import Reviews from '../components/Reviews';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

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

    return (
        <div className="min-h-screen">
            <HomeCarousel />

            {/* Featured Categories */}
            <section className="py-12 px-4">
                <h2 className="text-3xl font-bold text-center mb-8">LUXURY CATEGORIES</h2>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                    {categoryData.categories.map((category) => (
                        <Link key={category.id} to={`/collections?category=${category.slug}`} className="flex flex-col items-center">
                            <img src={category.image} alt={category.name} className="w-24 h-24 object-cover mb-2" />
                            <span className="text-lg font-semibold">{category.name}</span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Bestsellers */}
            <section className="py-12 px-4 bg-gray-50">
                <h2 className="text-3xl font-bold text-center mb-8">BEST SELLERS</h2>
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {bestSellers.map((product) => (
                            <Card key={product._id} product={product} />
                        ))}
                    </div>
                )}
            </section>
            <div className="text-center my-8">
                <Link to="/collections?category=Best Sellers" className="inline-block border border-black text-black py-3 px-6 rounded-lg transition duration-300 hover:bg-gray-200">
                    VIEW ALL
                </Link>
            </div>

            {/* <PromotionalBanner /> */}

            {/* New Arrivals */}
            <section className="py-12 px-4">
                <h2 className="text-3xl font-bold text-center mb-8">NEW ARRIVALS</h2>
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {newArrivals.map((product) => (
                            <Card key={product._id} product={product} />
                        ))}
                    </div>
                )}
            </section>
            <div className="text-center my-8">
                <Link to="/collections?category=New Arrivals" className="inline-block border border-black text-black py-3 px-6 rounded-lg transition duration-300 hover:bg-gray-200">
                    VIEW ALL
                </Link>
            </div>

            <Reviews />
        </div>
    );
};

export default Home;
