import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { FiHeart, FiShoppingBag, FiChevronRight, FiStar, FiArrowLeft, FiPlus, FiMinus, FiPackage, FiRefreshCw, FiShield, FiTruck, FiAward } from 'react-icons/fi';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [isInCart, setIsInCart] = useState(false);
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [cartItemId, setCartItemId] = useState(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);
    const imageRef = useRef(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    
    // Product images - we'll use the main image and placeholder variations for demo
    const getProductImages = () => {
        if (!product) return [];
        
        // For now we'll generate multiple angles/variations for demo purposes
        // In a real app, these would come from the product data
        return [
            product.image,
            product.secondaryImage || product.image,
            product.tertiaryImage || product.image,
        ];
    };
    
    const productImages = getProductImages();

    // Benefits data
    const benefits = [
        { icon: <FiTruck className="w-5 h-5" />, title: "Free Shipping", description: "On orders over ₹999" },
        { icon: <FiRefreshCw className="w-5 h-5" />, title: "Easy Returns", description: "30-day return policy" },
        { icon: <FiShield className="w-5 h-5" />, title: "Secure Checkout", description: "Safe & protected payment" },
        { icon: <FiAward className="w-5 h-5" />, title: "Authentic Products", description: "100% genuine guarantee" }
    ];
    
    useEffect(() => {
        // Check if id is undefined or invalid
        if (!id || id === 'undefined') {
            setLoading(false);
            setError('Invalid product ID. Please select a valid product.');
            return;
        }
        
        fetchProductDetails();
        checkUserStatus();
    }, [id]);
    
    const fetchProductDetails = async () => {
        // Don't fetch if id is invalid
        if (!id || id === 'undefined') {
            return;
        }
        
        try {
            setLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/collection/${id}`);
            setProduct(response.data);
            
            // Fetch related products based on category
            if (response.data.category && response.data.category.length > 0) {
                const relatedResponse = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/collection?category=${response.data.category[0]}`
                );
                // Filter out current product and limit to 4 items
                const filteredRelated = relatedResponse.data
                    .filter(item => item._id !== id)
                    .slice(0, 4);
                setRelatedProducts(filteredRelated);
            }
        } catch (err) {
            console.error('Error fetching product details:', err);
            setError(err.message || 'Failed to load product details');
            toast.error('Failed to load product details');
        } finally {
            setLoading(false);
        }
    };
    
    const checkUserStatus = async () => {
        // Don't check if id is invalid
        if (!id || id === 'undefined') {
            return;
        }
        
        const token = localStorage.getItem('token');
        if (!token) return;
        
        try {
            // Check if product is in cart
            const cartResponse = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/cart`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            if (cartResponse.data.success && cartResponse.data.cart && cartResponse.data.cart.items) {
                const cartItem = cartResponse.data.cart.items.find(
                    item => item.productId === id
                );
                
                if (cartItem) {
                    setIsInCart(true);
                    setCartItemId(cartItem.id);
                } else {
                    setIsInCart(false);
                    setCartItemId(null);
                }
            }
            
            // Check if product is in wishlist
            const wishlistResponse = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/wishlist`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            if (wishlistResponse.data.success && wishlistResponse.data.wishlist && wishlistResponse.data.wishlist.items) {
                const wishlistProductIds = wishlistResponse.data.wishlist.items
                    .filter(item => item.product) // Filter out items with no product
                    .map(item => item.product._id);
                setIsInWishlist(wishlistProductIds.includes(id));
            }
        } catch (error) {
            console.error('Error checking user status:', error);
        }
    };
    
    const handleAddToCart = async () => {
        if (isAddingToCart) return;
        
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Please login to add items to cart');
            return;
        }
        
        if (product.stock <= 0) {
            toast.error('Product is out of stock');
            return;
        }
        
        const loadingToast = toast.loading('Adding to cart...');
        setIsAddingToCart(true);
        
        try {
            let response;
            if (isInCart && cartItemId) {
                // Update quantity in cart
                response = await axios.put(
                    `${import.meta.env.VITE_API_URL}/api/cart/update/${cartItemId}`,
                    { quantity },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } else {
                // Add new item to cart
                response = await axios.post(
                    `${import.meta.env.VITE_API_URL}/api/cart/add`,
                    { productId: id, quantity },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }
            
            if (response.data.success) {
                toast.dismiss(loadingToast);
                toast.success('Added to cart successfully');
                setIsInCart(true);
                // If this was a new item, update the cart item ID
                if (response.data.cart && response.data.cart.items && !cartItemId) {
                    const newCartItem = response.data.cart.items.find(
                        item => item.productId === id
                    );
                    if (newCartItem) {
                        setCartItemId(newCartItem.id);
                    }
                }
            }
        } catch (error) {
            toast.dismiss(loadingToast);
            toast.error(error.response?.data?.message || 'Failed to add to cart');
            console.error('Add to cart error:', error);
        } finally {
            setIsAddingToCart(false);
        }
    };
    
    const toggleWishlist = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Please login to add to wishlist');
            return;
        }
        
        try {
            const method = isInWishlist ? 'delete' : 'post';
            const endpoint = isInWishlist ? 'remove' : 'add';
            
            const response = await axios({
                method,
                url: `${import.meta.env.VITE_API_URL}/api/wishlist/${endpoint}/${id}`,
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (response.data.success) {
                setIsInWishlist(!isInWishlist);
                toast.success(isInWishlist ? 'Removed from wishlist' : 'Added to wishlist');
            }
        } catch (error) {
            toast.error('Failed to update wishlist');
            console.error('Wishlist error:', error);
        }
    };
    
    const incrementQuantity = () => {
        if (quantity < product.stock) {
            setQuantity(quantity + 1);
        } else {
            toast.error(`Only ${product.stock} items available`);
        }
    };
    
    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    // Handle image zoom
    const handleMouseMove = (e) => {
        if (!imageRef.current || !isZoomed) return;
        
        const { left, top, width, height } = imageRef.current.getBoundingClientRect();
        const x = (e.clientX - left) / width;
        const y = (e.clientY - top) / height;
        
        setMousePosition({ x, y });
    };

    // Calculate discount percentage if original price exists
    const calculateDiscount = () => {
        if (product.originalPrice && product.price < product.originalPrice) {
            return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
        }
        return null;
    };
    
    if (loading) {
        return (
            <div className="min-h-screen bg-cream flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-burgundy border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-burgundy">Loading product details...</p>
                </div>
            </div>
        );
    }
    
    if (error || !product) {
        return (
            <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-4">
                <h2 className="text-2xl font-serif text-burgundy mb-4">Product Not Found</h2>
                <p className="text-soft-black/70 mb-8">{error || "We couldn't find the product you're looking for."}</p>
                <Link 
                    to="/collections" 
                    className="btn-primary flex items-center gap-2"
                >
                    <FiArrowLeft /> Browse Collections
                </Link>
            </div>
        );
    }

    const discount = calculateDiscount();
    
    return (
        <div className="min-h-screen bg-cream">
            {/* Breadcrumb */}
            <div className="max-w-7xl mx-auto px-4 py-3 md:py-4 flex flex-wrap items-center text-xs sm:text-sm text-soft-black/60">
                <Link to="/" className="hover:text-burgundy transition-colors">Home</Link>
                <FiChevronRight className="mx-1 sm:mx-2" />
                <Link to="/collections" className="hover:text-burgundy transition-colors">Collections</Link>
                {product.category && product.category[0] && (
                    <>
                        <FiChevronRight className="mx-1 sm:mx-2" />
                        <Link 
                            to={`/collections?category=${product.category[0]}`} 
                            className="hover:text-burgundy transition-colors"
                        >
                            {product.category[0]}
                        </Link>
                    </>
                )}
                <FiChevronRight className="mx-1 sm:mx-2" />
                <span className="text-burgundy font-medium truncate max-w-[150px] sm:max-w-none">{product.name}</span>
            </div>
            
            {/* Product Detail Section */}
            <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
                <div className="bg-soft-white border border-gold/10 shadow-sm overflow-hidden">
                    <div className="md:flex">
                        {/* Product Image Section */}
                        <div className="md:w-1/2 p-4 sm:p-6">
                            <div className="relative">
                                {/* Main Image with Zoom */}
                                <div 
                                    ref={imageRef}
                                    className="bg-gray-50 rounded-sm overflow-hidden aspect-square shadow-inner cursor-zoom-in relative"
                                    onClick={() => setIsZoomed(!isZoomed)}
                                    onMouseMove={handleMouseMove}
                                    onMouseLeave={() => setIsZoomed(false)}
                                >
                                    <img 
                                        src={productImages[activeImageIndex]} 
                                        alt={product.name} 
                                        className={`w-full h-full object-cover transition-transform duration-200 ${
                                            isZoomed ? 'scale-150' : ''
                                        }`}
                                        style={
                                            isZoomed 
                                            ? { 
                                                transformOrigin: `${mousePosition.x * 100}% ${mousePosition.y * 100}%`,
                                            }
                                            : {}
                                        }
                                        onError={(e) => {
                                            e.target.src = 'https://placehold.co/600x600/f8f5f0/1a1a1a?text=No+Image';
                                        }}
                                    />
                                </div>

                                {/* Discount badge */}
                                {discount && (
                                    <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-burgundy text-soft-white px-2 py-1 text-xs sm:text-sm font-medium">
                                        {discount}% OFF
                                    </div>
                                )}
                                
                                {/* Thumbnail Images */}
                                <div className="flex gap-2 mt-3 sm:mt-4 justify-center sm:justify-start flex-wrap">
                                    {productImages.map((img, index) => (
                                        <button
                                            key={index}
                                            className={`w-16 h-16 sm:w-20 sm:h-20 border-2 overflow-hidden ${
                                                activeImageIndex === index 
                                                ? 'border-burgundy' 
                                                : 'border-gold/10 hover:border-gold/30'
                                            } transition-colors`}
                                            onClick={() => setActiveImageIndex(index)}
                                        >
                                            <img 
                                                src={img} 
                                                alt={`${product.name} - view ${index + 1}`}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.src = 'https://placehold.co/100x100/f8f5f0/1a1a1a?text=Veloria';
                                                }}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        
                        {/* Product Info */}
                        <div className="md:w-1/2 p-4 sm:p-6 md:p-8 border-t md:border-t-0 md:border-l border-gold/10">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                            >
                                <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
                                    {product.category && product.category.map((cat, index) => (
                                        <Link 
                                            key={index}
                                            to={`/collections?category=${cat}`}
                                            className="text-xs uppercase tracking-widest text-burgundy hover:text-gold transition-colors"
                                        >
                                            {cat}
                                        </Link>
                                    ))}
                                </div>
                                
                                <h1 className="text-2xl sm:text-3xl font-serif text-soft-black mb-2">{product.name}</h1>
                                
                                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <FiStar 
                                                key={i} 
                                                className={`w-3 h-3 sm:w-4 sm:h-4 ${i < (product.rating || 5) ? 'text-gold fill-current' : 'text-soft-black/20'}`} 
                                            />
                                        ))}
                                    </div>
                                    <span className="text-xs text-soft-black/50">
                                        {product.reviews || 0} reviews
                                    </span>
                                </div>
                                
                                <p className="text-sm sm:text-base text-soft-black/70 mb-4 sm:mb-6 leading-relaxed font-sans">
                                    {product.description}
                                </p>
                                
                                <div className="mb-4 sm:mb-6">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-2xl sm:text-3xl font-serif text-burgundy">₹{product.price?.toLocaleString()}</span>
                                        
                                        {discount && (
                                            <span className="text-soft-black/50 text-base sm:text-lg line-through">
                                                ₹{product.originalPrice?.toLocaleString()}
                                            </span>
                                        )}
                                    </div>
                                    <div className="mt-2 flex items-center flex-wrap gap-2">
                                        {Number(product.stock) > 0 ? (
                                            <span className="inline-flex items-center px-2 py-1 text-xs bg-burgundy/10 text-burgundy uppercase tracking-wider">
                                                In Stock ({product.stock})
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-1 text-xs bg-soft-black/10 text-soft-black/70 uppercase tracking-wider">
                                                Out of Stock
                                            </span>
                                        )}
                                        
                                        {product.isNew && (
                                            <span className="inline-flex items-center px-2 py-1 text-xs bg-gold/20 text-gold uppercase tracking-wider">
                                                New Arrival
                                            </span>
                                        )}
                                    </div>
                                </div>
                                
                                {/* Quantity Selector */}
                                <div className="flex items-center mb-4 sm:mb-6">
                                    <span className="text-soft-black/70 mr-3 text-xs sm:text-sm uppercase tracking-wider">Quantity:</span>
                                    <div className="quantity-selector">
                                        <button 
                                            onClick={decrementQuantity}
                                            disabled={quantity <= 1}
                                            aria-label="Decrease quantity"
                                        >
                                            <FiMinus className="w-3 h-3 sm:w-4 sm:h-4" />
                                        </button>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            min="1"
                                            max={product.stock}
                                            value={quantity}
                                            onChange={(e) => {
                                                const val = parseInt(e.target.value);
                                                if (!isNaN(val) && val >= 1 && val <= product.stock) {
                                                    setQuantity(val);
                                                } else if (e.target.value === '') {
                                                    setQuantity('');
                                                }
                                            }}
                                            onBlur={() => {
                                                if (quantity === '' || isNaN(quantity)) {
                                                    setQuantity(1);
                                                }
                                            }}
                                            className="veloria-input text-sm"
                                            aria-label="Quantity"
                                        />
                                        <button 
                                            onClick={incrementQuantity}
                                            disabled={quantity >= product.stock}
                                            aria-label="Increase quantity"
                                        >
                                            <FiPlus className="w-3 h-3 sm:w-4 sm:h-4" />
                                        </button>
                                    </div>
                                </div>
                                
                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-3 mb-6 sm:mb-8">
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={isAddingToCart || Number(product.stock) <= 0}
                                        className={`flex-1 flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 transition text-sm sm:text-base ${
                                            Number(product.stock) <= 0
                                            ? 'bg-soft-black/10 text-soft-black/50 cursor-not-allowed'
                                            : 'btn-primary'
                                        }`}
                                        aria-label={isInCart ? "Update Cart" : "Add to Cart"}
                                    >
                                        {isAddingToCart ? (
                                            <div className="flex items-center gap-2">
                                                <span className="animate-pulse">Adding</span>
                                                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-t-soft-white border-soft-white/30 rounded-full animate-spin"></div>
                                            </div>
                                        ) : (
                                            <>
                                                <FiShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                                                {isInCart ? 'Update Cart' : 'Add to Cart'}
                                            </>
                                        )}
                                    </button>
                                    
                                    <button
                                        onClick={toggleWishlist}
                                        className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 transition text-sm sm:text-base ${
                                            isInWishlist
                                            ? 'bg-burgundy/10 text-burgundy border border-burgundy'
                                            : 'btn-outline'
                                        }`}
                                        aria-label={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                                    >
                                        <FiHeart className={`w-4 h-4 sm:w-5 sm:h-5 ${isInWishlist ? 'fill-current text-burgundy' : ''}`} />
                                        <span className="hidden xs:inline">
                                          {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                                        </span>
                                        <span className="xs:hidden">
                                          {isInWishlist ? 'Remove' : 'Wishlist'}
                                        </span>
                                    </button>
                                </div>

                                {/* Benefits */}
                                <div className="border-t border-gold/10 pt-4 sm:pt-6">
                                    <h3 className="text-xs sm:text-sm uppercase tracking-wider text-gold mb-3 sm:mb-4">Benefits</h3>
                                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
                                        {benefits.map((benefit, index) => (
                                            <div key={index} className="flex items-start gap-2 sm:gap-3">
                                                <div className="text-burgundy mt-0.5 sm:mt-1">{benefit.icon}</div>
                                                <div>
                                                    <h4 className="text-xs sm:text-sm font-medium text-soft-black">{benefit.title}</h4>
                                                    <p className="text-xs text-soft-black/70">{benefit.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Product Details Tabs */}
                    <div className="border-t border-gold/10 p-4 sm:p-6">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-lg sm:text-xl font-serif text-burgundy mb-4 sm:mb-6">Product Details</h2>
                            
                            {product.features && product.features.length > 0 && (
                                <div className="mb-6 sm:mb-8">
                                    <h3 className="text-base sm:text-lg font-medium text-soft-black mb-3 sm:mb-4">Features</h3>
                                    <ul className="space-y-1.5 sm:space-y-2 text-sm sm:text-base">
                                        {product.features.map((feature, index) => (
                                            <li key={index} className="flex items-start">
                                                <span className="text-gold mr-2">•</span>
                                                <span className="text-soft-black/80">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            
                            <div className="mb-6 sm:mb-8">
                                <h3 className="text-base sm:text-lg font-medium text-soft-black mb-3 sm:mb-4">Additional Information</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm sm:text-base">
                                    <div className="border-b border-gold/10 pb-2 sm:pb-3">
                                        <span className="text-soft-black/50 text-xs sm:text-sm">Category</span>
                                        <p className="text-soft-black">{product.category?.join(', ') || 'N/A'}</p>
                                    </div>
                                    {product.brand && (
                                        <div className="border-b border-gold/10 pb-2 sm:pb-3">
                                            <span className="text-soft-black/50 text-xs sm:text-sm">Brand</span>
                                            <p className="text-soft-black">{product.brand}</p>
                                        </div>
                                    )}
                                    <div className="border-b border-gold/10 pb-2 sm:pb-3">
                                        <span className="text-soft-black/50 text-xs sm:text-sm">Stock</span>
                                        <p className="text-soft-black">{product.stock}</p>
                                    </div>
                                    <div className="border-b border-gold/10 pb-2 sm:pb-3">
                                        <span className="text-soft-black/50 text-xs sm:text-sm">SKU</span>
                                        <p className="text-soft-black">{product.sku || product._id.slice(-8).toUpperCase()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Related Products Section */}
            {relatedProducts.length > 0 && (
                <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
                    <div className="text-center mb-6 sm:mb-8">
                        <h2 className="text-xl sm:text-2xl font-serif text-burgundy mb-2">You Might Also Like</h2>
                        <div className="w-16 sm:w-24 h-px bg-gold mx-auto"></div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
                        {relatedProducts.map((relatedProduct) => (
                            <motion.div
                                key={relatedProduct._id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                viewport={{ once: true }}
                                className="veloria-card"
                            >
                                <Link to={`/product/${relatedProduct._id}`}>
                                    <div className="aspect-square overflow-hidden">
                                        <img 
                                            src={relatedProduct.image} 
                                            alt={relatedProduct.name} 
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                                            onError={(e) => {
                                                e.target.src = 'https://placehold.co/300x300/f8f5f0/1a1a1a?text=No+Image';
                                            }}
                                        />
                                    </div>
                                    <div className="p-3 sm:p-4">
                                        <h3 className="font-serif text-soft-black hover:text-burgundy transition-colors text-sm sm:text-base truncate">{relatedProduct.name}</h3>
                                        <div className="flex items-baseline gap-2 mt-1">
                                            <p className="text-burgundy text-sm sm:text-base">₹{relatedProduct.price?.toLocaleString()}</p>
                                            {relatedProduct.originalPrice && relatedProduct.price < relatedProduct.originalPrice && (
                                                <p className="text-soft-black/50 text-xs line-through">
                                                    ₹{relatedProduct.originalPrice?.toLocaleString()}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetail; 