import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiPlus, FiBox } from 'react-icons/fi';

const ProductsTable = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

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
    if (!confirm('Are you sure you want to delete this product?')) return;

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

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Recent Products</h2>
        <Link 
          to="/admin/products/new"
          className="flex items-center px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <FiPlus className="mr-2" />
          Add Product
        </Link>
      </div>

      <div className="space-y-4">
        {products.slice(0, 5).map((product) => (
          <div key={product._id} className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-12 h-12 rounded-lg object-cover mr-4"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/100?text=No+Image';
                  }}
                />
                <div>
                  <p className="text-white font-medium">{product.name}</p>
                  <p className="text-gray-400 text-sm">{product.category}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <p className="text-white font-medium">₹{product.price}</p>
                <Link
                  to={`/admin/products/edit/${product._id}`}
                  className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <FiEdit2 />
                </Link>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="p-2 text-red-400 hover:text-red-300 transition-colors"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsTable; 