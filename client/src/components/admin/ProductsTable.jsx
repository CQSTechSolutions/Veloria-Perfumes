import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiEdit2, FiTrash2, FiEye, FiSearch, FiFilter, FiRefreshCw } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { FiPlus, FiBox } from 'react-icons/fi';
import { motion } from 'framer-motion';

const ProductsTable = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [sortField, sortDirection, selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Build the query string with sorting and filtering parameters
      let queryParams = new URLSearchParams();
      if (sortField) queryParams.append('sort', sortField);
      if (sortDirection) queryParams.append('direction', sortDirection);
      if (selectedCategory && selectedCategory !== 'all') queryParams.append('category', selectedCategory);
      
      const queryString = queryParams.toString();
      const url = `${import.meta.env.VITE_API_URL}/api/collection/${queryString ? `?${queryString}` : ''}`;
      
      const response = await axios.get(url, { 
        headers: { Authorization: `Bearer ${token}` } 
      });

      if (response.data && Array.isArray(response.data)) {
        setProducts(response.data);
      } else if (response.data && response.data.success && Array.isArray(response.data.products)) {
        setProducts(response.data.products);
      } else {
        console.warn('Unexpected response format:', response.data);
        setProducts([]);
        toast.error('Failed to fetch products: Unexpected response format');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Error loading products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/categories`);
      if (response.data.success) {
        setCategories(response.data.categories);
      } else {
        console.warn('Categories fetch returned unsuccessful status');
        setCategories([]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Set empty array to prevent errors in the UI
      setCategories([]);
      // Don't show error toast to avoid user confusion
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/collection/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success) {
          toast.success('Product deleted successfully');
          fetchProducts();
        } else {
          toast.error('Failed to delete product');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Error deleting product');
      }
    }
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-8 h-8 border-2 border-burgundy border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Table Controls with Paper Theme */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow-md border border-gold/20 paper-texture">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-soft-black" />
            </div>
            <input
              type="text"
              className="bg-white text-soft-black pl-10 pr-4 py-2 rounded-lg w-full border border-gold/30 focus:outline-none focus:ring-2 focus:ring-burgundy focus:border-transparent"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button 
              onClick={fetchProducts}
              className="bg-white text-soft-black p-2 rounded-lg hover:bg-cream transition-colors border border-gold/30"
              title="Refresh"
            >
              <FiRefreshCw />
            </button>
            
            <Link
              to="/admin/products/add"
              className="bg-burgundy text-white px-4 py-2 rounded-lg flex items-center hover:bg-burgundy/90 transition-colors shadow-md"
            >
              <FiPlus className="mr-2" /> Add Product
            </Link>
          </div>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-lg p-8 text-center shadow-md border border-gold/20 paper-texture"
        >
          <FiBox className="mx-auto text-4xl text-gold mb-4" />
          <h3 className="text-xl font-medium text-soft-black mb-2">No Products Found</h3>
          <p className="text-soft-black/70 mb-6">Try adjusting your search criteria</p>
          <Link
            to="/admin/products/add"
            className="inline-flex items-center px-4 py-2 bg-burgundy text-white rounded-lg hover:bg-burgundy/90 transition-colors shadow-md"
          >
            <FiPlus className="mr-2" /> Add New Product
          </Link>
        </motion.div>
      ) : (
        <div className="bg-white rounded-xl overflow-hidden shadow-md border border-gold/20 paper-texture">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gold/10">
              <thead className="bg-cream">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-soft-black uppercase tracking-wider cursor-pointer hover:text-burgundy"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      Product
                      {sortField === 'name' && (
                        <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-soft-black uppercase tracking-wider cursor-pointer hover:text-burgundy"
                    onClick={() => handleSort('price')}
                  >
                    <div className="flex items-center">
                      Price
                      {sortField === 'price' && (
                        <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-soft-black uppercase tracking-wider cursor-pointer hover:text-burgundy"
                    onClick={() => handleSort('stock')}
                  >
                    <div className="flex items-center">
                      Stock
                      {sortField === 'stock' && (
                        <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-soft-black uppercase tracking-wider cursor-pointer hover:text-burgundy"
                    onClick={() => handleSort('sales')}
                  >
                    <div className="flex items-center">
                      Sales
                      {sortField === 'sales' && (
                        <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-soft-black uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gold/10">
                {filteredProducts.map((product) => (
                  <motion.tr 
                    key={product._id} 
                    className="hover:bg-cream/50 transition-colors"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border border-gold/20">
                          <img 
                            className="h-12 w-12 object-cover" 
                            src={product.images && product.images.length > 0 ? product.images[0] : 'https://placehold.co/100x100/lightgray/gray?text=No+Image'} 
                            alt={product.name} 
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-soft-black">{product.name}</div>
                          <div className="text-sm text-soft-black/70">{product.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-soft-black">
                      ₹{product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.stock > 10 
                          ? 'bg-green-100 text-green-800' 
                          : product.stock > 0 
                            ? 'bg-gold/20 text-gold' 
                            : 'bg-burgundy/20 text-burgundy'
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-soft-black">
                      {product.sales || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <Link
                          to={`/product/${product._id}`}
                          className="text-soft-black hover:text-gold transition-colors p-1 rounded-full hover:bg-cream/50"
                          title="View"
                        >
                          <FiEye />
                        </Link>
                        <Link
                          to={`/admin/products/edit/${product._id}`}
                          className="text-burgundy hover:text-burgundy/80 transition-colors p-1 rounded-full hover:bg-cream/50"
                          title="Edit"
                        >
                          <FiEdit2 />
                        </Link>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="text-burgundy hover:text-burgundy/80 transition-colors p-1 rounded-full hover:bg-cream/50"
                          title="Delete"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsTable;