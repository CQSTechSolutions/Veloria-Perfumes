import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiStar } from 'react-icons/fi';

const CollectionsCard = ({ product }) => {
    if (!product) return null;

    const {
        _id,
        name,
        price = 0,
        description = '',
        image = '/default-collection-image.jpg',
        rating = 5,
        reviews = 0,
        category = 'Collection'
    } = product;

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden group relative"
        >
            {/* Image Container */}
            <div className="relative h-80 overflow-hidden">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                        e.target.src = '/default-collection-image.jpg';
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-sm">
                        {category}
                    </span>
                </div>

                {/* Rating Badge */}
                <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 bg-yellow-400/90 backdrop-blur-md rounded-full">
                    <FiStar className="text-white" />
                    <span className="text-white text-sm font-medium">{rating?.toFixed(1) || '5.0'}</span>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <div className="mb-4">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                        {name}
                    </h3>
                    <p className="text-purple-200/80 text-sm line-clamp-2">
                        {description}
                    </p>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-2xl font-bold text-white">
                            ₹{typeof price === 'number' ? price.toLocaleString() : '0'}
                        </p>
                        <p className="text-purple-300 text-sm">
                            {typeof reviews === 'number' ? reviews.toLocaleString() : '0'} reviews
                        </p>
                    </div>

                    <Link 
                        to={`/collection/${_id}`}
                        className="p-3 bg-purple-500/20 rounded-full text-purple-300 hover:bg-purple-500/40 hover:text-white transition-all duration-300 group-hover:rotate-12"
                    >
                        <FiArrowRight className="w-6 h-6" />
                    </Link>
                </div>
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </motion.div>
    );
};

export default CollectionsCard;
