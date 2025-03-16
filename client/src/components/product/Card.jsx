import React from 'react';
import { Link } from 'react-router-dom';

const Card = ({ product, category }) => {
  if (product) {
    const {
      id,
      title,
      price,
      originalPrice,
      image,
      tags,
      category: productCategory
    } = product;

    return (
      <div className="group relative flex flex-col items-center">
        {/* Tags */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className={`text-xs px-2 py-1 font-medium
                ${tag === 'BUY 1 GET 1 FREE' ? 'bg-red-500 text-white' : 
                  tag === 'BESTSELLER' ? 'bg-[#CD9B6A] text-white' : 
                  'bg-gray-200 text-gray-800'}`}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Product Image */}
        <Link to={`/collections`}>
          <div className="aspect-square overflow-hidden bg-gray-100">
            <img
              src={image}
              alt={title}
              className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>

        {/* Product Info */}
        <div className="mt-4 space-y-2 text-center">
          <div className="text-xs text-gray-500 uppercase">{productCategory}</div>
          
          <Link to={`/product/${id}`}>
            <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
              {title}
            </h3>
          </Link>

          {/* Price */}
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg font-medium">₹{price.toFixed(2)}</span>
            {originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ₹{originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <Link to="/collections" className="mt-4 w-full bg-black text-white py-2 px-4 text-sm font-medium hover:bg-gray-800 transition-colors text-center">
          View Details
        </Link>
      </div>
    );
  }

  if (category) {
    return (
      <div className="group relative flex flex-col items-center">
        {/* Category-specific rendering */}
        <Link to={category.link}>
          <img src={category.image} alt={category.title} className="w-full h-auto" />
        </Link>
        <h3 className="text-center">{category.title}</h3>
      </div>
    );
  }

  return null; // Fallback if neither product nor category is provided
};

export default Card;