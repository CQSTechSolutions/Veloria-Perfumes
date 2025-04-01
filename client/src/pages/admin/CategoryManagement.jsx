import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { FiTag, FiPlus, FiEdit2, FiTrash, FiSave, FiX } from 'react-icons/fi';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { motion, AnimatePresence } from 'framer-motion';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState('');
  const [editMode, setEditMode] = useState(null); // Holds ID of category being edited
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/categories`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setCategories(response.data.categories);
      } else {
        toast.error('Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) {
      toast.error('Category name cannot be empty');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/categories/add`,
        { name: newCategory.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success('Category added successfully');
        setNewCategory('');
        fetchCategories();
      } else {
        toast.error(response.data.message || 'Failed to add category');
      }
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error(error.response?.data?.message || 'Failed to add category');
    }
  };

  const handleEditStart = (category) => {
    setEditMode(category._id);
    setEditValue(category.name);
  };

  const handleEditCancel = () => {
    setEditMode(null);
    setEditValue('');
  };

  const handleEditSave = async (categoryId) => {
    if (!editValue.trim()) {
      toast.error('Category name cannot be empty');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/categories/update/${categoryId}`,
        { name: editValue.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success('Category updated successfully');
        setEditMode(null);
        fetchCategories();
      } else {
        toast.error(response.data.message || 'Failed to update category');
      }
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error(error.response?.data?.message || 'Failed to update category');
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/categories/delete/${categoryId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success('Category deleted successfully');
        fetchCategories();
      } else {
        toast.error(response.data.message || 'Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error(error.response?.data?.message || 'Failed to delete category. It might be in use by products.');
    }
  };

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
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-serif text-burgundy mb-2">Category Management</h1>
            <p className="text-soft-black/70">Create and manage product categories</p>
          </div>

          {/* Add Category Form */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gold/20">
            <h2 className="text-xl font-serif text-burgundy mb-4 flex items-center">
              <FiPlus className="mr-2" /> Add New Category
            </h2>
            <form onSubmit={handleAddCategory} className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter category name"
                className="flex-1 p-3 border border-gold/20 rounded-lg focus:outline-none focus:border-burgundy/50 focus:ring-1 focus:ring-burgundy/50"
                required
              />
              <button
                type="submit"
                className="bg-burgundy text-white py-3 px-6 rounded-lg hover:bg-burgundy/90 transition-colors flex items-center justify-center"
              >
                <FiPlus className="mr-2" /> Add Category
              </button>
            </form>
          </div>

          {/* Categories List */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gold/20">
            <h2 className="text-xl font-serif text-burgundy mb-4 flex items-center">
              <FiTag className="mr-2" /> Categories
            </h2>

            {categories.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-gold/30 rounded-lg">
                <FiTag className="text-4xl text-soft-black/30 mx-auto mb-2" />
                <p className="text-soft-black/50">No categories found. Add your first category above.</p>
              </div>
            ) : (
              <ul className="divide-y divide-gold/10">
                {categories.map((category) => (
                  <motion.li 
                    key={category._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="py-4"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      {editMode === category._id ? (
                        <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2">
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="flex-1 p-2 border border-gold/30 rounded-md focus:outline-none focus:border-burgundy/50 focus:ring-1 focus:ring-burgundy/50"
                            autoFocus
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditSave(category._id)}
                              className="p-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
                            >
                              <FiSave className="mr-1" /> Save
                            </button>
                            <button
                              onClick={handleEditCancel}
                              className="p-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition-colors flex items-center"
                            >
                              <FiX className="mr-1" /> Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center">
                            <FiTag className="text-burgundy mr-3" />
                            <span className="text-soft-black font-medium">{category.name}</span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditStart(category)}
                              className="p-2 bg-gold/80 text-soft-black rounded-md hover:bg-gold transition-colors flex items-center"
                            >
                              <FiEdit2 className="mr-1" /> Edit
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(category._id)}
                              className="p-2 bg-burgundy text-white rounded-md hover:bg-burgundy/80 transition-colors flex items-center"
                            >
                              <FiTrash className="mr-1" /> Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </motion.li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryManagement; 