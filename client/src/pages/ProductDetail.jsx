import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaHeart, FaShare, FaShoppingCart, FaTruck, FaUndo, FaShieldAlt } from 'react-icons/fa';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [randomProducts, setRandomProducts] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/products/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch product details');
        }
        
        const data = await response.json();
        setProduct(data.data);
        setLoading(false);
        
        // Fetch related products
        fetchRelatedProducts(data.data.category);
        // Fetch random products
        fetchRandomProducts(data.data._id);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error('Error fetching product details:', err);
      }
    };

    const fetchRelatedProducts = async (category) => {
      try {
        const response = await fetch('http://localhost:3000/api/products');
        
        if (response.ok) {
          const result = await response.json();
          const filtered = result.data.filter(p => 
            p.category === category && p._id !== id
          ).slice(0, 4);
          
          setRelatedProducts(filtered);
        }
      } catch (err) {
        console.error('Error fetching related products:', err);
      }
    };

    // Add this function to fetch random products
    const fetchRandomProducts = async (currentProductId) => {
      try {
        const response = await fetch('http://localhost:3000/api/products');
        
        if (response.ok) {
          const result = await response.json();
          // Filter out the current product
          const otherProducts = result.data.filter(p => p._id !== currentProductId);
          // Shuffle array and take first 3
          const shuffled = otherProducts.sort(() => 0.5 - Math.random());
          setRandomProducts(shuffled.slice(0, 3));
        }
      } catch (err) {
        console.error('Error fetching random products:', err);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const handleQuantityChange = (e) => {
    setQuantity(Math.max(1, parseInt(e.target.value) || 1));
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(1, prev - 1));
  };

  const handleAddToCart = () => {
    // Implement cart functionality here
    console.log(`Added ${quantity} of ${product.name} to cart`);
    // You can dispatch to a cart context/redux store here
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="text-center py-20 text-red-600">Error: {error}</div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="text-center py-20">Product not found</div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      
      {/* Breadcrumb */}
      <div className="bg-gray-100 py-3">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center text-sm text-gray-600">
            <Link to="/" className="hover:text-indigo-600">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/shop" className="hover:text-indigo-600">Shop</Link>
            <span className="mx-2">/</span>
            <Link to={`/category/${product.category.toLowerCase()}`} className="hover:text-indigo-600">
              {product.category}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="bg-gray-100 rounded-lg overflow-hidden h-96 relative">
              <img 
                src={product.images[activeImage]} 
                alt={product.name} 
                className="w-full h-full object-contain"
              />
              {product.isBestSeller && (
                <div className="absolute top-4 left-4 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  Best Seller
                </div>
              )}
              <div className="absolute top-4 right-4 flex space-x-2">
                <button className="bg-white p-2 rounded-full shadow hover:bg-gray-100 transition-colors">
                  <FaHeart className="h-5 w-5 text-gray-600 hover:text-red-500" />
                </button>
                <button className="bg-white p-2 rounded-full shadow hover:bg-gray-100 transition-colors">
                  <FaShare className="h-5 w-5 text-gray-600 hover:text-indigo-500" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {product.images.map((image, index) => (
                <div 
                  key={index} 
                  className={`bg-gray-100 rounded-lg overflow-hidden h-20 cursor-pointer border-2 ${activeImage === index ? 'border-indigo-500' : 'border-transparent'}`}
                  onClick={() => setActiveImage(index)}
                >
                  <img 
                    src={image} 
                    alt={`${product.name} view ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <span className="text-indigo-600 font-medium">{product.category}</span>
              <h1 className="text-3xl font-bold mt-1">{product.name}</h1>
              <p className="text-gray-500 mt-1">Brand: {product.brand}</p>
            </div>

            <div className="flex items-center">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg 
                    key={i}
                    className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-gray-500 text-sm ml-1">({product.rating})</span>
              <span className="mx-2">•</span>
              <span className="text-gray-500 text-sm">{product.reviews.length} reviews</span>
            </div>

            <div className="border-t border-b py-4">
              <p className="text-3xl font-bold text-indigo-700">${product.price.toFixed(2)}</p>
              <p className="text-green-600 mt-1">
                {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-32">
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <div className="flex border border-gray-300 rounded-md">
                    <button 
                      onClick={decrementQuantity}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 border-r border-gray-300"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      id="quantity"
                      name="quantity"
                      min="1"
                      value={quantity}
                      onChange={handleQuantityChange}
                      className="w-full text-center border-none focus:ring-0"
                    />
                    <button 
                      onClick={incrementQuantity}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 border-l border-gray-300"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex-1">
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-indigo-600 text-white py-3 px-6 rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2"
                    disabled={product.stock === 0}
                  >
                    <FaShoppingCart />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
              
              <button className="w-full border border-indigo-600 text-indigo-600 py-3 px-6 rounded-md hover:bg-indigo-50 transition-colors">
                Buy Now
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="flex items-center space-x-2">
                <FaTruck className="text-indigo-600" />
                <span className="text-sm">Free shipping over $100</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaUndo className="text-indigo-600" />
                <span className="text-sm">30-day returns</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaShieldAlt className="text-indigo-600" />
                <span className="text-sm">Secure checkout</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Product Details Tabs */}
        <div className="mt-16">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('description')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'description'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab('details')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'details'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Details
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'reviews'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Reviews ({product.reviews.length})
              </button>
            </nav>
          </div>
          
          <div className="py-6">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>
            )}
            
            {activeTab === 'details' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium mb-4">Product Details</h3>
                  <ul className="space-y-3">
                    <li className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Brand</span>
                      <span className="font-medium">{product.brand}</span>
                    </li>
                    <li className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Category</span>
                      <span className="font-medium">{product.category}</span>
                    </li>
                    <li className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Fragrance Family</span>
                      <span className="font-medium">{product.category}</span>
                    </li>
                    <li className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Size</span>
                      <span className="font-medium">50ml</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-4">Shipping Information</h3>
                  <ul className="space-y-3">
                    <li className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Delivery</span>
                      <span className="font-medium">2-4 business days</span>
                    </li>
                    <li className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Free Shipping</span>
                      <span className="font-medium">On orders over $100</span>
                    </li>
                    <li className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Returns</span>
                      <span className="font-medium">30-day return policy</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
            
            {activeTab === 'reviews' && (
              <div>
                {product.reviews.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
                    <button className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors">
                      Write a Review
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {product.reviews.map((review, index) => (
                      <div key={index} className="border-b pb-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="bg-indigo-100 rounded-full w-10 h-10 flex items-center justify-center text-indigo-700 font-bold">
                              {review.user.name ? review.user.name.charAt(0) : 'U'}
                            </div>
                            <div className="ml-3">
                              <p className="font-medium">{review.user.name || 'Anonymous'}</p>
                              <div className="flex text-yellow-400 mt-1">
                                {[...Array(5)].map((_, i) => (
                                  <svg 
                                    key={i}
                                    className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                    fill="currentColor" 
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <p className="mt-4 text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <div key={product._id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                  <Link to={`/product/${product._id}`}>
                    <div className="h-64 overflow-hidden relative">
                      <img 
                        src={product.images[0]} 
                        alt={product.name} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                      {product.isBestSeller && (
                        <div className="absolute top-3 right-3 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          Best Seller
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <span className="text-sm text-indigo-600 font-medium">{product.category}</span>
                      <h3 className="font-semibold text-lg mt-1">{product.name}</h3>
                      
                      <div className="flex items-center mt-1">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <svg 
                              key={i}
                              className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor" 
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-gray-500 text-sm ml-1">({product.rating})</span>
                      </div>
                      
                      <div className="mt-3 flex items-center justify-between">
                        <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
                        <button className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm hover:bg-indigo-700 transition-colors">
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Random Products - Discover More */}
        {randomProducts.length > 0 && (
          <div className="mt-16 pt-10 border-t border-gray-200">
            <h2 className="text-2xl font-bold mb-6">Discover More</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {randomProducts.map((product) => (
                <div key={product._id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                  <Link to={`/product/${product._id}`}>
                    <div className="h-64 overflow-hidden relative">
                      <img 
                        src={product.images[0]} 
                        alt={product.name} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                      {product.isBestSeller && (
                        <div className="absolute top-3 right-3 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          Best Seller
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <span className="text-sm text-indigo-600 font-medium">{product.category}</span>
                      <h3 className="font-semibold text-lg mt-1">{product.name}</h3>
                      
                      <div className="flex items-center mt-1">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <svg 
                              key={i}
                              className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor" 
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-gray-500 text-sm ml-1">({product.rating})</span>
                      </div>
                      
                      <div className="mt-3 flex items-center justify-between">
                        <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
                        <button className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm hover:bg-indigo-700 transition-colors">
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ProductDetail;