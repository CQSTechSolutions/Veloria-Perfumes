import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const PromotionalBanner = () => {
  return (
    <section className="py-16 px-4 relative overflow-hidden">
      
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-cream/90 p-8 md:p-12 text-center"
        >
          <div className="flex justify-center mb-4">
            <span className="inline-block text-gold text-2xl">✦</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-serif text-burgundy mb-4">Exquisite Fragrances</h2>
          <p className="text-soft-black/80 mb-8 max-w-2xl mx-auto leading-relaxed">
            Indulge in our collection of handcrafted perfumes, designed to evoke emotions 
            and create lasting impressions. Each fragrance tells a unique story, crafted with 
            the finest ingredients from around the world.
          </p>
          <Link 
            to="/collections" 
            className="btn-primary inline-block"
          >
            Explore Our Collection
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default PromotionalBanner;