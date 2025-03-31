import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { FiHeart, FiShoppingBag, FiChevronRight, FiStar, FiArrowLeft, FiPlus, FiMinus } from 'react-icons/fi';

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
    
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }
    
    if (error || !product) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
                <p className="text-gray-600 mb-8">{error || "We couldn't find the product you're looking for."}</p>
                <Link 
                    to="/collections" 
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
                >
                    <FiArrowLeft /> Back to Collections
                </Link>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Breadcrumb */}
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center text-sm text-gray-500">
                <Link to="/" className="hover:text-purple-600 transition">Home</Link>
                <FiChevronRight className="mx-2" />
                <Link to="/collections" className="hover:text-purple-600 transition">Collections</Link>
                <FiChevronRight className="mx-2" />
                <span className="text-gray-900 font-medium">{product.name}</span>
            </div>
            
            {/* Product Detail Section */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="md:flex">
                        {/* Product Image */}
                        <div className="md:w-1/2 p-6">
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="bg-gray-100 rounded-xl overflow-hidden aspect-square shadow-inner"
                            >
                                <img 
                                    src={product.image} 
                                    alt={product.name} 
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = 'https://placehold.co/600x600/lightgray/gray?text=No+Image';
                                    }}
                                />
                            </motion.div>
                        </div>
                        
                        {/* Product Info */}
                        <div className="md:w-1/2 p-6 md:p-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                            >
                                <div className="flex items-center mb-4">
                                    {product.category && product.category.map((cat, index) => (
                                        <Link 
                                            key={index}
                                            to={`/collections?category=${cat}`}
                                            className="text-xs font-medium uppercase tracking-wider mr-2 px-2.5 py-1 bg-purple-100 text-purple-700 rounded-full"
                                        >
                                            {cat}
                                        </Link>
                                    ))}
                                </div>
                                
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                                
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <FiStar 
                                                key={i} 
                                                className={`w-4 h-4 ${i < (product.rating || 5) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        {product.reviews || 0} reviews
                                    </span>
                                </div>
                                
                                <p className="text-gray-600 mb-6 leading-relaxed">
                                    {product.description}
                                </p>
                                
                                <div className="mb-6">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl font-bold text-gray-900">₹{product.price?.toLocaleString()}</span>
                                        {/* Discount logic can go here */}
                                    </div>
                                    <div className="mt-1 flex items-center gap-2">
                                        {Number(product.stock) > 0 ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                In Stock ({product.stock})
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                Out of Stock
                                            </span>
                                        )}
                                    </div>
                                </div>
                                
                                {/* Quantity Selector */}
                                <div className="flex items-center mb-6">
                                    <span className="text-gray-700 mr-3">Quantity:</span>
                                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                                        <button 
                                            onClick={decrementQuantity}
                                            disabled={quantity <= 1}
                                            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition"
                                        >
                                            <FiMinus className="w-4 h-4" />
                                        </button>
                                        <input
                                            type="number"
                                            min="1"
                                            max={product.stock}
                                            value={quantity}
                                            onChange={(e) => {
                                                const val = parseInt(e.target.value);
                                                if (val >= 1 && val <= product.stock) {
                                                    setQuantity(val);
                                                }
                                            }}
                                            className="w-12 text-center border-0 focus:ring-0"
                                        />
                                        <button 
                                            onClick={incrementQuantity}
                                            disabled={quantity >= product.stock}
                                            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition"
                                        >
                                            <FiPlus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                
                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={isAddingToCart || Number(product.stock) <= 0}
                                        className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium ${
                                            Number(product.stock) <= 0
                                            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                            : 'bg-purple-600 text-white hover:bg-purple-700'
                                        } transition shadow-sm`}
                                    >
                                        <FiShoppingBag className={`w-5 h-5 ${isAddingToCart ? 'animate-pulse' : ''}`} />
                                        {isInCart ? 'Update Cart' : 'Add to Cart'}
                                    </button>
                                    
                                    <button
                                        onClick={toggleWishlist}
                                        className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium border ${
                                            isInWishlist
                                            ? 'bg-red-50 text-red-600 border-red-200'
                                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                        } transition shadow-sm`}
                                    >
                                        <FiHeart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
                                        {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                    
                    {/* Product Details Tabs - Future enhancement */}
                    <div className="border-t border-gray-200 p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Product Details</h2>
                        <div className="prose prose-purple max-w-none">
                            <p>{product.description}</p>
                            
                            {/* Additional details could be added here */}
                            <ul className="mt-4">
                                <li><strong>Category:</strong> {product.category?.join(', ') || 'N/A'}</li>
                                <li><strong>Stock:</strong> {product.stock}</li>
                                <li><strong>Product ID:</strong> {product._id}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <div className="max-w-7xl mx-auto px-4 py-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">You May Also Like</h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {relatedProducts.map((relatedProduct) => (
                            <motion.div 
                                key={relatedProduct._id}
                                whileHover={{ y: -5 }}
                                transition={{ duration: 0.2 }}
                                className="bg-white rounded-xl shadow-sm overflow-hidden"
                            >
                                <Link to={`/product/${relatedProduct._id}`}>
                                    <div className="aspect-square overflow-hidden">
                                        <img 
                                            src={relatedProduct.image} 
                                            alt={relatedProduct.name} 
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                            onError={(e) => {
                                                e.target.src = 'https://placehold.co/300x300/lightgray/gray?text=No+Image';
                                            }}
                                        />
                                    </div>
                                </Link>
                                
                                <div className="p-4">
                                    <Link to={`/product/${relatedProduct._id}`}>
                                        <h3 className="font-medium text-gray-900 hover:text-purple-600 transition mb-1 line-clamp-1">
                                            {relatedProduct.name}
                                        </h3>
                                    </Link>
                                    
                                    <p className="text-sm text-gray-500 mb-2 line-clamp-1">
                                        {relatedProduct.category?.join(', ')}
                                    </p>
                                    
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-gray-900">₹{relatedProduct.price?.toLocaleString()}</span>
                                        
                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <FiStar 
                                                    key={i} 
                                                    className={`w-3 h-3 ${i < (relatedProduct.rating || 5) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetail; 