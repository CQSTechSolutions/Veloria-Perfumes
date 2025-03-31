import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiStar, FiShoppingBag, FiHeart, FiEye, FiCheck } from 'react-icons/fi';

const ProductCard = ({ product, onAddToCart, onToggleWishlist, isInWishlist }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [isHovering, setIsHovering] = useState(false);

    const handleAddToCart = (e) => {
        e.preventDefault();
        setIsAdding(true);
        
        // Simulate loading and success
        setTimeout(() => {
            onAddToCart(product);
            setIsAdding(false);
        }, 600);
    };

    const handleToggleWishlist = (e) => {
        e.preventDefault();
        onToggleWishlist(product);
    };

    const calculateDiscount = () => {
        if (product.originalPrice && product.price < product.originalPrice) {
            return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
        }
        return null;
    };

    const discount = calculateDiscount();

    return (
        <motion.div 
            className="veloria-card group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <div className="relative overflow-hidden h-full flex flex-col">
                {/* Badges */}
                <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                    {discount && (
                        <span className="bg-burgundy text-soft-white text-xs font-medium px-2 py-1 tracking-wider">
                            {discount}% OFF
                        </span>
                    )}
                    
                    {Number(product.stock) <= 0 && (
                        <span className="bg-soft-black/80 text-soft-white text-xs font-medium px-2 py-1 tracking-wider">
                            SOLD OUT
                        </span>
                    )}
                    
                    {product.isNew && (
                        <span className="bg-gold text-soft-black text-xs font-medium px-2 py-1 tracking-wider">
                            NEW
                        </span>
                    )}
                </div>

                {/* Image section */}
                <Link to={`/product/${product._id}`} className="block relative">
                    <div className="aspect-square overflow-hidden border-b border-gold/10 bg-cream">
                        <motion.div
                            initial={false}
                            animate={isHovering ? { scale: 1.08 } : { scale: 1 }}
                            transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1.0] }}
                            className="w-full h-full"
                        >
                            <img 
                                src={product.image} 
                                alt={product.name} 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.src = 'https://placehold.co/300x300/f8f5f0/1a1a1a?text=Veloria';
                                }}
                            />
                        </motion.div>
                        
                        {/* Quick view button overlay */}
                        <motion.div 
                            className="absolute inset-0 bg-soft-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            initial={false}
                            animate={isHovering ? { opacity: 1 } : { opacity: 0 }}
                        >
                            <Link 
                                to={`/product/${product._id}`}
                                className="bg-soft-white text-burgundy hover:bg-burgundy hover:text-soft-white transition-colors px-4 py-2 text-sm uppercase tracking-wider flex items-center gap-2"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <FiEye /> Quick View
                            </Link>
                        </motion.div>
                    </div>
                </Link>
                
                {/* Product info section */}
                <div className="p-4 flex-grow flex flex-col">
                    {product.category && (
                        <div className="mb-1">
                            <span className="text-xs uppercase tracking-widest text-burgundy/80">
                                {product.category[0]}
                            </span>
                        </div>
                    )}
                    
                    <Link to={`/product/${product._id}`}>
                        <h3 className="font-serif text-soft-black group-hover:text-burgundy transition-colors line-clamp-2 min-h-[2.5rem]">
                            {product.name}
                        </h3>
                    </Link>
                    
                    <div className="flex items-center mt-1 mb-2">
                        <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <FiStar 
                                    key={i} 
                                    className={`w-3 h-3 ${i < (product.rating || 5) ? 'text-gold fill-current' : 'text-soft-black/20'}`} 
                                />
                            ))}
                        </div>
                        <span className="text-xs text-soft-black/50 ml-2">
                            ({product.reviews || 0})
                        </span>
                    </div>
                    
                    <div className="mt-auto pt-2">
                        <div className="flex items-baseline gap-2">
                            <span className="font-serif text-burgundy">₹{product.price?.toLocaleString()}</span>
                            
                            {discount && (
                                <span className="text-soft-black/50 text-xs line-through">
                                    ₹{product.originalPrice?.toLocaleString()}
                                </span>
                            )}
                        </div>
                        
                        {Number(product.stock) > 0 && (
                            <div className="mt-2">
                                <div className="h-1 bg-soft-black/10 w-full">
                                    <div 
                                        className="h-1 bg-gold" 
                                        style={{ 
                                            width: `${Math.min(100, (product.stock / 20) * 100)}%`,
                                        }}
                                    ></div>
                                </div>
                                {product.stock < 5 && (
                                    <p className="text-xs text-burgundy/80 mt-1">
                                        Only {product.stock} left in stock
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Action buttons */}
                <div className="absolute z-20 transition-all duration-300 flex">
                    {/* Wishlist button - top right */}
                    <motion.button
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ 
                            scale: isHovering || isInWishlist ? 1 : 0.8, 
                            opacity: isHovering || isInWishlist ? 1 : 0,
                            top: isHovering ? '0.75rem' : '1.5rem',
                            right: isHovering ? '0.75rem' : '0.5rem'
                        }}
                        transition={{ duration: 0.2 }}
                        className={`absolute top-3 right-3 p-2 rounded-full shadow-md ${
                            isInWishlist
                            ? 'bg-burgundy text-soft-white'
                            : 'bg-soft-white text-burgundy hover:bg-burgundy hover:text-soft-white'
                        } transition-colors`}
                        onClick={handleToggleWishlist}
                        aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                    >
                        <FiHeart className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`} />
                    </motion.button>
                    
                    {/* Add to cart button - bottom */}
                    <motion.button
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ 
                            y: isHovering ? 0 : 20, 
                            opacity: isHovering ? 1 : 0
                        }}
                        transition={{ duration: 0.3 }}
                        onClick={handleAddToCart}
                        disabled={isAdding || Number(product.stock) <= 0}
                        className={`absolute bottom-0 left-0 right-0 py-3 flex items-center justify-center gap-2 ${
                            Number(product.stock) <= 0
                            ? 'bg-soft-black/10 text-soft-black/30 cursor-not-allowed'
                            : isAdding
                              ? 'bg-burgundy/90 text-soft-white'
                              : 'bg-burgundy text-soft-white hover:bg-burgundy-dark'
                        } transition-colors`}
                        aria-label="Add to cart"
                    >
                        {isAdding ? (
                            <>
                                <span className="animate-pulse">Adding</span>
                                <span className="w-5 h-5 animate-spin border-2 border-soft-white/20 border-t-soft-white rounded-full"></span>
                            </>
                        ) : (
                            <>
                                {Number(product.stock) > 0 ? (
                                    <>
                                        <FiShoppingBag className="w-4 h-4" /> Add to Cart
                                    </>
                                ) : (
                                    <>Sold Out</>
                                )}
                            </>
                        )}
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard; 