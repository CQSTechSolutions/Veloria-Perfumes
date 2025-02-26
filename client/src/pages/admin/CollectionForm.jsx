import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import AdminSidebar from '../../components/admin/AdminSidebar';

const CollectionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [collection, setCollection] = useState({
    name: '',
    description: '',
    image: ''
  });

  useEffect(() => {
    if (id) {
      fetchCollection();
    }
  }, [id]);

  const fetchCollection = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/collection/`);
      setCollection(response.data);
    } catch (error) {
      toast.error('Failed to fetch collection');
      navigate('/admin/collections');
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
          `${import.meta.env.VITE_API_URL}/api/collections/${id}`,
          collection,
          { headers }
        );
        toast.success('Collection updated successfully');
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/collection/`,
          collection,
          { headers }
        );
        toast.success('Collection created successfully');
      }
      navigate('/admin/collections');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save collection');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 overflow-auto p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">{id ? 'Edit Collection' : 'New Collection'}</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Collection Name</label>
            <input
              type="text"
              value={collection.name}
              onChange={(e) => setCollection({ ...collection, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={collection.description}
              onChange={(e) => setCollection({ ...collection, description: e.target.value })}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Image URL</label>
            <input
              type="url"
              value={collection.image}
              onChange={(e) => setCollection({ ...collection, image: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              required
            />
          </div>

          <div className="mt-6 flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/admin/collections')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Collection'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CollectionForm; 