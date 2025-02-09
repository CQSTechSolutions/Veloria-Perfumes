import React from 'react';
import HomeCarousel from '../components/header/HomeCarousel';
import Card from '../components/product/Card';
import productData from '../data/products.json';
import categoryData from '../data/categories.json';
import { FiStar } from 'react-icons/fi';
import PromotionalBanner from '../components/PromotionalBanner';
import Reviews from '../components/Reviews';

const Home = () => {
  return (
    <div className="min-h-screen">
      <HomeCarousel />
      
      {/* Featured Categories */}
      <section className="py-12 px-4">
        <h2 className="text-3xl font-bold text-center mb-8">LUXURY CATEGORIES</h2>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {categoryData.categories.map((category) => (
            <div key={category.id} className="flex flex-col items-center">
              <img src={category.image} alt={category.name} className="w-24 h-24 object-cover mb-2" />
              <span className="text-lg font-semibold">{category.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Bestsellers */}
      <section className="py-12 px-4 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-8">BEST SELLERS</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {productData.bestsellers.map((product) => (
            <Card key={product.id} product={product} />
          ))}
        </div>
      </section>
        <div className="text-center my-8">
          <a href="/collections" className="inline-block border border-black text-black py-3 px-6 rounded-lg transition duration-300 hover:bg-gray-200">
            VIEW ALL
          </a>
        </div>

      <PromotionalBanner />
        
      {/* New Arrivals */}
      <section className="py-12 px-4">
        <h2 className="text-3xl font-bold text-center mb-8">NEW ARRIVALS</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {productData.newArrivals.map((product) => (
            <Card key={product.id} product={product} />
          ))}
        </div>
      </section>

      <Reviews />

    </div>
  );
};

export default Home;

