import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FiUser, FiMail, FiPhone, FiEdit2, FiTrash2, FiMapPin, FiSearch, FiUserPlus } from 'react-icons/fi';
import AdminSidebar from '../../components/admin/AdminSidebar';
import EditUserModal from '../../components/admin/EditUserModal';
import { motion, AnimatePresence } from 'framer-motion';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleting, setIsDeleting] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/getAllUsers`,
        { headers: { Authorization: `Bearer ${token}` }}
      );

      if (response.data) {
        setUsers(response.data);
      } else {
        toast.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser({ ...user, fullName: user.fullName });
    setIsModalOpen(true);
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

    try {
      setIsDeleting(userId);
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/user/deleteUserById?id=${userId}`,
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      if (response.data.success) {
        toast.success('User deleted successfully');
        // Update local state to remove the deleted user
        setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
      } else {
        toast.error(response.data.message || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(error.response?.data?.message || 'Failed to delete user');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleSaveEdit = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/user/editUserById?id=${selectedUser._id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` }}
      );

      if (response.data.success) {
        toast.success('User updated successfully');
        setIsModalOpen(false);
        
        // Update user in the local state without fetching again
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user._id === selectedUser._id 
              ? { ...user, ...formData } 
              : user
          )
        );
      } else {
        toast.error(response.data.message || 'Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error(error.response?.data?.message || 'Failed to update user');
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      (user.fullName && user.fullName.toLowerCase().includes(searchLower)) ||
      (user.email && user.email.toLowerCase().includes(searchLower)) ||
      (user.phone && user.phone.includes(searchTerm))
    );
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
      <div className="flex-1 p-4 md:p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-serif text-burgundy mb-1">User Management</h1>
              <p className="text-soft-black/70">Manage your platform users</p>
            </div>
            
            <div className="relative w-full md:w-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64 pl-10 pr-4 py-2 border border-gold/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy/30 bg-white"
              />
            </div>
          </div>
          
          {filteredUsers.length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center border border-gold/20 shadow-md">
              <FiUser className="mx-auto text-4xl text-burgundy/50 mb-4" />
              <h3 className="text-xl font-medium text-soft-black mb-2">No Users Found</h3>
              <p className="text-soft-black/70">
                {searchTerm ? 'No users match your search criteria.' : 'There are no users in the system yet.'}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md border border-gold/20 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-cream to-soft-white">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-soft-black uppercase tracking-wider">User</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-soft-black uppercase tracking-wider">Contact</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-soft-black uppercase tracking-wider">Address</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-soft-black uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold/10">
                    {filteredUsers.map((user) => (
                      <motion.tr 
                        key={user._id} 
                        className="hover:bg-cream/30 transition-colors"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-burgundy to-burgundy/80 flex items-center justify-center shadow-sm">
                              <FiUser className="text-white" />
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-soft-black">{user.fullName}</div>
                              <div className="text-xs text-soft-black/60">
                                ID: {user._id.substring(0, 8)}...
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-soft-black/80">
                            <div className="flex items-center mb-1.5">
                              <FiMail className="mr-2 text-burgundy/70" />
                              {user.email}
                            </div>
                            <div className="flex items-center">
                              <FiPhone className="mr-2 text-burgundy/70" />
                              {user.phone || 'Not provided'}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-soft-black/80">
                            <div className="flex items-start">
                              <FiMapPin className="mr-2 text-burgundy/70 mt-0.5" />
                              <div>
                                {user.address ? (
                                  <>
                                    <div>{user.address}</div>
                                    <div>{user.city}, {user.state} {user.zipCode}</div>
                                  </>
                                ) : (
                                  <span className="text-soft-black/50">No address provided</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-3">
                            <button 
                              onClick={() => handleEdit(user)}
                              className="p-2 bg-gold/80 text-soft-black rounded-md hover:bg-gold transition-colors shadow-sm flex items-center"
                            >
                              <FiEdit2 className="mr-1" /> Edit
                            </button>
                            <button 
                              onClick={() => handleDelete(user._id)}
                              disabled={isDeleting === user._id}
                              className={`p-2 bg-burgundy text-white rounded-md hover:bg-burgundy/90 transition-colors shadow-sm flex items-center ${
                                isDeleting === user._id ? 'opacity-70 cursor-not-allowed' : ''
                              }`}
                            >
                              {isDeleting === user._id ? (
                                <>
                                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></span>
                                  Deleting...
                                </>
                              ) : (
                                <>
                                  <FiTrash2 className="mr-1" /> Delete
                                </>
                              )}
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
      </div>
      
      <AnimatePresence>
        {isModalOpen && (
          <EditUserModal
            user={selectedUser}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveEdit}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserList; 