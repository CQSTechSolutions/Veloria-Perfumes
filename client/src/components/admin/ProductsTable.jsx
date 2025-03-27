import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { FiPlus, FiBox } from 'react-icons/fi';

const ProductsTable = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/collection/popular`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success) {
          setProducts(response.data.products);
        } else {
          toast.error('Failed to fetch popular products');
        }
      } catch (error) {
        console.error('Error fetching popular products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p>No products found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-700">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Product
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Stock
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Sales
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {products.map((product) => (
            <tr key={product._id} className="hover:bg-gray-700/50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-10 w-10 flex-shrink-0">
                    <img 
                      className="h-10 w-10 rounded-md object-cover" 
                      src={product.images[0]} 
                      alt={product.name} 
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-white">{product.name}</div>
                    <div className="text-sm text-gray-400">{product.category}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                ₹{product.price.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  product.stock > 10 
                    ? 'bg-green-100 text-green-800' 
                    : product.stock > 0 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-red-100 text-red-800'
                }`}>
                  {product.stock}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {product.sales || 0}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-2">
                  <Link
                    to={`/product/${product._id}`}
                    className="text-gray-400 hover:text-white"
                    title="View"
                  >
                    <FiEye />
                  </Link>
                  <Link
                    to={`/admin/products/edit/${product._id}`}
                    className="text-blue-400 hover:text-blue-300"
                    title="Edit"
                  >
                    <FiEdit2 />
                  </Link>
                  <button
                    className="text-red-400 hover:text-red-300"
                    title="Delete"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsTable;