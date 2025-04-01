import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FiSave, FiX, FiBox, FiDollarSign, FiTag, FiFileText, FiPackage, FiImage } from 'react-icons/fi';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { motion } from 'framer-motion';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    image: ''
  });

  useEffect(() => {
    fetchCategories();
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/categories`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/collection/${id}`);
      setProduct(response.data);
    } catch (error) {
      toast.error('Failed to fetch product');
      navigate('/admin/products');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      if (id) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/collection/${id}`,
          product,
          { headers }
        );
        toast.success('Product updated successfully');
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/collection/`,
          product,
          { headers }
        );
        toast.success('Product created successfully');
      }
      navigate('/admin/products');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleProductImagePreview = () => {
    if (!product.image) return 'https://placehold.co/300x300/f8f5f0/1a1a1a?text=No+Image';
    return product.image;
  };

  return (
    <div className="flex min-h-screen bg-cream paper-texture">
      <AdminSidebar />
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-serif text-burgundy mb-2">
              {id ? 'Edit Product' : 'Add New Product'}
            </h1>
            <p className="text-soft-black/70">
              {id ? 'Update product information' : 'Create a new product for your store'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md border border-gold/20 overflow-hidden">
            {/* Form Header */}
            <div className="bg-gradient-to-r from-cream to-soft-white p-4 border-b border-gold/10 flex items-center justify-between">
              <div className="flex items-center">
                <FiBox className="text-burgundy mr-2 text-xl" />
                <h2 className="text-lg font-serif text-burgundy">Product Details</h2>
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => navigate('/admin/products')}
                  className="flex items-center px-3 py-1.5 border border-burgundy/50 text-burgundy rounded-md hover:bg-burgundy/10 transition-colors text-sm"
                >
                  <FiX className="mr-1" /> Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center px-4 py-1.5 bg-burgundy text-white rounded-md hover:bg-burgundy/90 transition-colors shadow-sm text-sm"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiSave className="mr-1.5" /> Save Product
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Product Details */}
                <div className="lg:col-span-2 space-y-5">
                  <motion.div 
                    className="space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div>
                      <label className="block text-sm font-medium text-soft-black mb-2 flex items-center">
                        <FiBox className="mr-1.5 text-burgundy" /> Product Name
                      </label>
                      <input
                        type="text"
                        value={product.name}
                        onChange={(e) => setProduct({ ...product, name: e.target.value })}
                        className="w-full p-3 border border-gold/20 rounded-lg focus:outline-none focus:border-burgundy/50 focus:ring-1 focus:ring-burgundy/50"
                        placeholder="Enter product name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-soft-black mb-2 flex items-center">
                        <FiFileText className="mr-1.5 text-burgundy" /> Description
                      </label>
                      <textarea
                        value={product.description}
                        onChange={(e) => setProduct({ ...product, description: e.target.value })}
                        rows={4}
                        className="w-full p-3 border border-gold/20 rounded-lg focus:outline-none focus:border-burgundy/50 focus:ring-1 focus:ring-burgundy/50"
                        placeholder="Describe your product..."
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-soft-black mb-2 flex items-center">
                          <FiDollarSign className="mr-1.5 text-burgundy" /> Price
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-soft-black">₹</span>
                          </div>
                          <input
                            type="number"
                            value={product.price}
                            onChange={(e) => setProduct({ ...product, price: e.target.value })}
                            className="w-full pl-8 pr-4 py-3 border border-gold/20 rounded-lg focus:outline-none focus:border-burgundy/50 focus:ring-1 focus:ring-burgundy/50"
                            placeholder="0.00"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-soft-black mb-2 flex items-center">
                          <FiPackage className="mr-1.5 text-burgundy" /> Stock
                        </label>
                        <input
                          type="number"
                          value={product.stock}
                          onChange={(e) => setProduct({ ...product, stock: e.target.value })}
                          className="w-full px-4 py-3 border border-gold/20 rounded-lg focus:outline-none focus:border-burgundy/50 focus:ring-1 focus:ring-burgundy/50"
                          placeholder="Available quantity"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-soft-black mb-2 flex items-center">
                        <FiTag className="mr-1.5 text-burgundy" /> Category
                      </label>
                      <select
                        value={product.category}
                        onChange={(e) => setProduct({ ...product, category: e.target.value })}
                        className="w-full px-4 py-3 border border-gold/20 rounded-lg focus:outline-none focus:border-burgundy/50 focus:ring-1 focus:ring-burgundy/50"
                        required
                      >
                        <option value="">Select a category</option>
                        {categories.map(category => (
                          <option key={category._id} value={category.name}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-soft-black mb-2 flex items-center">
                        <FiImage className="mr-1.5 text-burgundy" /> Image URL
                      </label>
                      <input
                        type="url"
                        value={product.image}
                        onChange={(e) => setProduct({ ...product, image: e.target.value })}
                        className="w-full px-4 py-3 border border-gold/20 rounded-lg focus:outline-none focus:border-burgundy/50 focus:ring-1 focus:ring-burgundy/50"
                        placeholder="https://example.com/image.jpg"
                        required
                      />
                    </div>
                  </motion.div>
                </div>

                {/* Product Image Preview */}
                <motion.div 
                  className="mt-6 lg:mt-0"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <div className="bg-cream/30 rounded-lg p-4 border border-gold/20">
                    <h3 className="text-sm font-medium text-soft-black mb-4 flex items-center">
                      <FiImage className="mr-1.5 text-burgundy" /> Image Preview
                    </h3>
                    <div className="aspect-square w-full bg-white rounded-lg overflow-hidden border border-gold/20 shadow-sm">
                      <img
                        src={handleProductImagePreview()}
                        alt="Product preview"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.src = 'https://placehold.co/300x300/f8f5f0/1a1a1a?text=Image+Error';
                        }}
                      />
                    </div>
                    <p className="text-sm text-soft-black/60 mt-3 text-center">
                      {product.image ? 'Image preview' : 'No image provided'}
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductForm; 