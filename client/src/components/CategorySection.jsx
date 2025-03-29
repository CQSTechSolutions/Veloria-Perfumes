import React from 'react';
import { Link } from 'react-router-dom';

const CategorySection = () => {
  const categories = [
    {
      id: 'floral',
      name: 'Attar',
      image: 'https://images.unsplash.com/photo-1599893242516-cda489aea122?q=80&w=500&auto=format&fit=crop',
      description: 'Romantic bouquets of rose, jasmine, and lily'
    },
    {
      id: 'oriental',
      name: 'Body Perfume',
      image: 'https://images.unsplash.com/photo-1626766912518-a2703240b283?q=80&w=500&auto=format&fit=crop',
      description: 'Exotic spices, amber, and warm vanilla notes'
    },
    {
      id: 'woody',
      name: 'Air Freshner',
      image: 'https://images.unsplash.com/photo-1566425596700-1776be0edfbd?q=80&w=500&auto=format&fit=crop',
      description: 'Sophisticated cedarwood, sandalwood and vetiver'
    },
    {
      id: 'fresh',
      name: 'Aroma Oils',
      image: 'https://images.unsplash.com/photo-1500395235658-f87dff62cbf2?q=80&w=500&auto=format&fit=crop',
      description: 'Clean aquatic and green notes for everyday wear'
    },
    {
      id: 'citrus',
      name: 'Citrus',
      image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?q=80&w=500&auto=format&fit=crop',
      description: 'Invigorating bergamot, lemon and grapefruit'
    },
    {
      id: 'gourmand',
      name: 'Gourmand',
      image: 'https://images.unsplash.com/photo-1559592278-a866d082cb3f?q=80&w=500&auto=format&fit=crop',
      description: 'Sweet and delectable honey, caramel and chocolate'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 bg-gray-50">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-2">Explore Our Collections</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">Discover the perfect fragrance that speaks to your personality from our carefully curated categories.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link 
            key={category.id} 
            to={`/category/${category.id}`}
            className="group relative overflow-hidden rounded-lg shadow-lg transition-transform hover:-translate-y-2 hover:shadow-xl"
          >
            <div className="aspect-[4/3] overflow-hidden">
              <img 
                src={category.image} 
                alt={category.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                <p className="text-sm text-gray-200 mb-3">{category.description}</p>
                <span className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium border border-white/30 transition-colors group-hover:bg-indigo-600 group-hover:border-indigo-600">
                  Shop Now
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategorySection; 