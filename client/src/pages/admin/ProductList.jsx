import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiBox, FiSearch, FiFilter } from 'react-icons/fi';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { motion, AnimatePresence } from 'framer-motion';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

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

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/collection/`
      );
      setProducts(response.data);
    } catch (error) {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/collection/${productId}`,
        { headers: { Authorization: `Bearer ${token}` }}
      );
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  // Filter products based on search term and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = !searchTerm || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex min-h-screen bg-cream paper-texture">
        <AdminSidebar />
        <div className="flex-1 p-8 flex justify-center items-center">
          <div className="w-12 h-12 border-4 border-burgundy border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-cream paper-texture">
      <AdminSidebar />
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-serif text-burgundy mb-2">Product Management</h1>
            <p className="text-soft-black/70">Manage your product inventory</p>
          </div>
          
          {/* Search and Filter Controls */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6 border border-gold/20">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gold/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy/30"
                />
              </div>
              
              <div className="flex items-center">
                <FiFilter className="mr-2 text-burgundy" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="border border-gold/20 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-burgundy/30"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category._id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <Link
                to="/admin/products/new"
                className="flex items-center justify-center px-4 py-2 bg-burgundy text-white rounded-lg hover:bg-burgundy/90 transition-colors"
              >
                <FiPlus className="mr-2" />
                Add Product
              </Link>
            </div>
          </div>

          {/* Products List */}
          <div className="bg-white rounded-lg shadow-md border border-gold/20 overflow-hidden">
            {filteredProducts.length === 0 ? (
              <div className="p-8 text-center">
                <FiBox className="mx-auto text-4xl text-burgundy/50 mb-4" />
                <h3 className="text-xl font-medium text-soft-black mb-2">No Products Found</h3>
                <p className="text-soft-black/70">
                  {searchTerm || filterCategory !== 'all'
                    ? 'No products match your search criteria.'
                    : 'There are no products in the system yet.'}
                </p>
                <Link
                  to="/admin/products/new"
                  className="inline-flex items-center mt-4 px-4 py-2 bg-burgundy text-white rounded-lg hover:bg-burgundy/90 transition-colors"
                >
                  <FiPlus className="mr-2" />
                  Add Your First Product
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-cream to-soft-white">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-soft-black uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-soft-black uppercase tracking-wider hidden md:table-cell">
                        Category
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-soft-black uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-soft-black uppercase tracking-wider hidden sm:table-cell">
                        Stock
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-soft-black uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold/10">
                    {filteredProducts.map((product) => (
                      <motion.tr 
                        key={product._id} 
                        className="hover:bg-cream/30 transition-colors"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-lg border border-gold/20 overflow-hidden">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  e.target.src = 'https://placehold.co/100x100/f8f5f0/1a1a1a?text=Veloria';
                                }}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-soft-black">{product.name}</div>
                              <div className="text-sm text-soft-black/60 md:hidden">
                                {product.category}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-burgundy/10 text-burgundy">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-soft-black">
                          ₹{product.price}
                          <div className="text-sm text-soft-black/60 sm:hidden">
                            Stock: {product.stock}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-soft-black hidden sm:table-cell">
                          {product.stock}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-3">
                            <Link
                              to={`/admin/products/edit/${product._id}`}
                              className="p-2 bg-gold/80 text-soft-black rounded-md hover:bg-gold transition-colors shadow-sm flex items-center"
                            >
                              <FiEdit2 className="sm:mr-1" />
                              <span className="hidden sm:inline">Edit</span>
                            </Link>
                            <button
                              onClick={() => handleDelete(product._id)}
                              className="p-2 bg-burgundy text-white rounded-md hover:bg-burgundy/90 transition-colors shadow-sm flex items-center"
                            >
                              <FiTrash2 className="sm:mr-1" />
                              <span className="hidden sm:inline">Delete</span>
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList; 