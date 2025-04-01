import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { FiSave, FiX } from 'react-icons/fi';

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
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/collection/${id}`);
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
          `${import.meta.env.VITE_API_URL}/api/collection/${id}`,
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
    <div className="flex min-h-screen bg-cream paper-texture">
      <AdminSidebar />
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-serif text-burgundy mb-2">
              {id ? 'Edit Collection' : 'New Collection'}
            </h1>
            <p className="text-soft-black/70">
              {id ? 'Update collection information' : 'Create a new collection for your store'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md border border-gold/20 overflow-hidden">
            <div className="bg-gradient-to-r from-cream to-soft-white p-4 border-b border-gold/10 flex items-center justify-between">
              <h2 className="text-lg font-serif text-burgundy">Collection Details</h2>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => navigate('/admin/collections')}
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
                      <FiSave className="mr-1.5" /> Save Collection
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-soft-black mb-2">Collection Name</label>
                <input
                  type="text"
                  value={collection.name}
                  onChange={(e) => setCollection({ ...collection, name: e.target.value })}
                  className="w-full p-3 border border-gold/20 rounded-lg focus:outline-none focus:border-burgundy/50 focus:ring-1 focus:ring-burgundy/50"
                  placeholder="Enter collection name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-soft-black mb-2">Description</label>
                <textarea
                  value={collection.description}
                  onChange={(e) => setCollection({ ...collection, description: e.target.value })}
                  rows={4}
                  className="w-full p-3 border border-gold/20 rounded-lg focus:outline-none focus:border-burgundy/50 focus:ring-1 focus:ring-burgundy/50"
                  placeholder="Describe the collection..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-soft-black mb-2">Image URL</label>
                <input
                  type="url"
                  value={collection.image}
                  onChange={(e) => setCollection({ ...collection, image: e.target.value })}
                  className="w-full p-3 border border-gold/20 rounded-lg focus:outline-none focus:border-burgundy/50 focus:ring-1 focus:ring-burgundy/50"
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>

              {collection.image && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-soft-black mb-2">Image Preview</p>
                  <div className="h-40 w-full bg-white rounded-lg overflow-hidden border border-gold/20">
                    <img
                      src={collection.image}
                      alt="Collection preview"
                      className="h-full w-full object-contain"
                      onError={(e) => {
                        e.target.src = 'https://placehold.co/300x300/f8f5f0/1a1a1a?text=Image+Error';
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CollectionForm; 