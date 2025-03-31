import React, { useEffect, useState } from 'react';
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff, FiShoppingBag, FiClock, FiCalendar, FiMapPin, FiEdit, FiCheckCircle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';

const InputField = ({ icon, label, type, value, onChange, error, placeholder, className = "w-full" }) => (
  <div className={className}>
    <label className="block text-sm font-medium text-soft-black/70 mb-1">{label}</label>
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-soft-black/50">
        {icon}
      </div>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full pl-10 pr-4 py-2 border ${error ? 'border-burgundy' : 'border-gold/30'} rounded-lg focus:ring-2 focus:ring-burgundy focus:border-transparent transition-all duration-200 bg-transparent`}
      />
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-burgundy text-xs mt-1"
        >
          {error}
        </motion.p>
      )}
    </div>
  </div>
);

const Account = () => {
  const [token, setToken] = useState(null);
  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    countryCode: '+91',
    createdAt: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const navigate = useNavigate();

  console.log('Account component - API URL:', import.meta.env.VITE_API_URL);
  
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
    
    const fetchUserDetails = async () => {
      try {
        const userId = jwtDecode(storedToken).id;
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/user/getUserById?userId=${userId}`,
          { headers: { Authorization: `Bearer ${storedToken}` }}
        );

        if (response.data) {
          setFormData(prev => ({
            ...prev,
            fullName: response.data.fullName || '',
            email: response.data.email || '',
            phone: response.data.phone || '',
            countryCode: response.data.countryCode || '+91',
            createdAt: response.data.createdAt || '',
            address: response.data.address || '',
            city: response.data.city || '',
            state: response.data.state || '',
            zipCode: response.data.zipCode || '',
          }));
          setIsLogin(true);
        }
      } catch (error) {
        toast.error('Failed to fetch user details. Please log in again.');
        console.error('Error fetching user details:', error);
        handleLogout();
      }
    };

    if (storedToken) {
      fetchUserDetails();
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('Logged out successfully', {
      icon: '👋',
      style: { background: '#333', color: '#fff' }
    });
    setIsLogin(false);
    setFormData({
      fullName: '',
      email: '',
      countryCode: '+91',
      phone: '',
      password: '',
      confirmPassword: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      createdAt: '',
    });
    navigate('/');
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // For registration
    if (!isLogin && isSignUp && !formData.fullName) newErrors.fullName = 'Name is required';
    
    // Email validation with proper format checking
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Phone validation for registration
    if (!isLogin && isSignUp && !formData.phone) {
      newErrors.phone = 'Phone number is required';
    }
    
    // Only validate password for login or registration, not for profile updates
    if (!isLogin && !formData.password) {
      newErrors.password = 'Password is required';
    } else if (!isLogin && isSignUp && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    // Confirm password validation only for registration or when changing password in profile
    if ((!isLogin && isSignUp && formData.password !== formData.confirmPassword) || 
        (isLogin && editMode && formData.password && formData.password !== formData.confirmPassword)) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const login = async (formData) => {
    try {
      console.log('Attempting login with:', { email: formData.email });
      
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        email: formData.email,
        password: formData.password
      });

      console.log('Login response:', response.data);

      if (response.data.token) {
        const userResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/user/getUserById?userId=${jwtDecode(response.data.token).id}`,
          { headers: { Authorization: `Bearer ${response.data.token}` }}
        );

        setFormData({
          fullName: userResponse.data.fullName || '',
          email: userResponse.data.email || '',
          phone: userResponse.data.phone || '',
          countryCode: userResponse.data.countryCode || '+91',
          password: '',
          confirmPassword: '',
          createdAt: userResponse.data.createdAt || '',
          address: userResponse.data.address || '',
          city: userResponse.data.city || '',
          state: userResponse.data.state || '',
          zipCode: userResponse.data.zipCode || '',
        });

        localStorage.setItem('token', response.data.token);
        localStorage.setItem('expirationTime', new Date().getTime() + 60 * 60 * 1000);
        setToken(response.data.token);
        setIsLogin(true);
        toast.success('Successfully logged in!');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Failed to login. Please try again.');
    }
  };

  const register = async (formData) => {
    try {
      // Additional validation before submission
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast.error('Please enter a valid email address');
        return;
      }
      
      if (formData.password.length < 6) {
        toast.error('Password must be at least 6 characters');
        return;
      }
      
      const registrationData = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        countryCode: formData.countryCode || '+91',
        createdAt: new Date().toISOString(),
        address: formData.address || '',
        city: formData.city || '',
        state: formData.state || '',
        zipCode: formData.zipCode || '',
      };

      console.log('Attempting registration with:', registrationData);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        registrationData
      );

      console.log('Registration response:', response.data);
      
      if (response.data && response.data.token) {
        const userResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/user/getUserById?userId=${jwtDecode(response.data.token).id}`,
          { headers: { Authorization: `Bearer ${response.data.token}` }}
        );

        setFormData({
          fullName: userResponse.data.fullName || '',
          email: userResponse.data.email || '',
          phone: userResponse.data.phone || '',
          countryCode: userResponse.data.countryCode || '+91',
          password: '',
          confirmPassword: '',
          createdAt: userResponse.data.createdAt || '',
          address: userResponse.data.address || '',
          city: userResponse.data.city || '',
          state: userResponse.data.state || '',
          zipCode: userResponse.data.zipCode || '',
        });

        localStorage.setItem('token', response.data.token);
        localStorage.setItem('expirationTime', new Date().getTime() + 60 * 60 * 1000);
        setToken(response.data.token);
        setIsLogin(true);
        
        toast.success('🎉 Registration successful!', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  const updateProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const updateData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        countryCode: formData.countryCode,
        address: formData.address || '',
        city: formData.city || '',
        state: formData.state || '',
        zipCode: formData.zipCode || '',
      };
      
      // Only include password in update if it's provided
      if (formData.password && formData.password.trim() !== '') {
        updateData.password = formData.password;
      }
      
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/user/updateProfile`,
        updateData,
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      if (response.data.success) {
        toast.success('Profile updated successfully');
        // Reset password fields
        setFormData(prev => ({
          ...prev,
          password: '',
          confirmPassword: ''
        }));
        setEditMode(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    
    if (validateForm()) {
      try {
        if (isLogin) {
          // If we're in the profile view, update profile
          if (editMode) {
            await updateProfile();
          }
        } else {
          // Login or Register
          if (!isSignUp) {
            await login(formData);
          } else {
            await register(formData);
          }
        }
      } catch (error) {
        console.error('Form submission error:', error);
        toast.error(error.response?.data?.message || 'An error occurred. Please try again.', {
          icon: '❌',
          style: { background: '#333', color: '#fff' }
        });
      } finally {
        setLoading(false);
      }
    } else {
      // Display a toast for validation errors
      if (Object.keys(errors).length > 0) {
        toast.error('Please fix the highlighted errors', {
          icon: '❌',
          style: { background: '#333', color: '#fff' }
        });
      }
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear error when field is being edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isLogin ? (
        <motion.div 
          key="profile"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="min-h-screen bg-cream paper-texture py-12 px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-4xl mx-auto">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-soft-white border border-gold/10 shadow-sm"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-6">
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3 }}
                      className="w-24 h-24 bg-burgundy rounded-full flex items-center justify-center"
                    >
                      <FiUser className="w-12 h-12 text-soft-white" />
                    </motion.div>
                    <div>
                      <motion.h1 
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-3xl font-serif text-burgundy"
                      >
                        {formData.fullName}
                      </motion.h1>
                      <motion.p 
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-soft-black/70"
                      >
                        {formData.email}
                      </motion.p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setEditMode(!editMode)}
                    className="btn-outline flex items-center gap-2 px-4 py-2"
                  >
                    <FiEdit className="w-4 h-4" />
                    {editMode ? 'Cancel Edit' : 'Edit Profile'}
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div 
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="bg-cream/50 p-6 border border-gold/10"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <FiUser className="w-5 h-5 text-burgundy" />
                        <h2 className="text-lg font-serif text-soft-black">Personal Details</h2>
                      </div>
                      <div className="space-y-4">
                        <AnimatePresence mode="wait">
                          {isSignUp && (
                            <motion.div
                              key="fullName"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                            >
                              <label className="block text-sm font-medium text-soft-black/70 mb-1">Full Name *</label>
                              <input 
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                className={`veloria-input w-full bg-transparent ${errors.fullName ? 'border-burgundy' : 'border-gold/30'}`}
                              />
                              {errors.fullName && <p className="mt-1 text-burgundy text-sm">{errors.fullName}</p>}
                            </motion.div>
                          )}
                        </AnimatePresence>
                        <div>
                          <label className="block text-sm font-medium text-soft-black/70 mb-1">Email *</label>
                          <input 
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={`veloria-input w-full bg-transparent ${errors.email ? 'border-burgundy' : 'border-gold/30'}`}
                          />
                          {errors.email && <p className="mt-1 text-burgundy text-sm">{errors.email}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-soft-black/70 mb-1">Phone</label>
                          <div className="flex">
                            <select 
                              name="countryCode"
                              value={formData.countryCode}
                              onChange={handleInputChange}
                              className={`veloria-input w-20 bg-transparent border-gold/30`}
                            >
                              <option value="+91">+91</option>
                              <option value="+1">+1</option>
                              <option value="+44">+44</option>
                            </select>
                            <input 
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className={`veloria-input w-full bg-transparent ${errors.phone ? 'border-burgundy' : 'border-gold/30'}`}
                            />
                          </div>
                          {errors.phone && <p className="mt-1 text-burgundy text-sm">{errors.phone}</p>}
                        </div>
                      </div>
                    </motion.div>

                    <motion.div 
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.7 }}
                      className="bg-cream/50 p-6 border border-gold/10"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <FiMapPin className="w-5 h-5 text-burgundy" />
                        <h2 className="text-lg font-serif text-soft-black">Address Information</h2>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-soft-black/70 mb-1">Address</label>
                          <input 
                            type="text"
                            name="address"
                            value={formData.address || ''}
                            onChange={handleInputChange}
                            className={`veloria-input w-full bg-transparent border-gold/30`}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-soft-black/70 mb-1">City</label>
                            <input 
                              type="text"
                              name="city"
                              value={formData.city || ''}
                              onChange={handleInputChange}
                              className={`veloria-input w-full bg-transparent border-gold/30`}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-soft-black/70 mb-1">State</label>
                            <input 
                              type="text"
                              name="state"
                              value={formData.state || ''}
                              onChange={handleInputChange}
                              className={`veloria-input w-full bg-transparent border-gold/30`}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-soft-black/70 mb-1">ZIP Code</label>
                          <input 
                            type="text"
                            name="zipCode"
                            value={formData.zipCode || ''}
                            onChange={handleInputChange}
                            className={`veloria-input w-full bg-transparent border-gold/30`}
                          />
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {editMode && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-cream/50 p-6 border border-gold/10"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <FiLock className="w-5 h-5 text-burgundy" />
                        <h2 className="text-lg font-serif text-soft-black">Change Password (optional)</h2>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-soft-black/70 mb-1">New Password</label>
                          <div className="relative">
                            <input 
                              type={showPassword ? "text" : "password"}
                              name="password"
                              value={formData.password}
                              onChange={handleInputChange}
                              className={`veloria-input w-full bg-soft-white ${errors.password ? 'border-burgundy' : 'border-gold/30'}`}
                            />
                            <button 
                              type="button"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-soft-black/50 hover:text-burgundy"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <FiEyeOff /> : <FiEye />}
                            </button>
                          </div>
                          {errors.password && <p className="mt-1 text-burgundy text-sm">{errors.password}</p>}
                          {isSignUp && !errors.password && (
                            <p className="mt-1 text-soft-black/50 text-xs">Password must be at least 6 characters</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-soft-black/70 mb-1">Confirm New Password</label>
                          <div className="relative">
                            <input 
                              type={showPassword ? "text" : "password"}
                              name="confirmPassword"
                              value={formData.confirmPassword}
                              onChange={handleInputChange}
                              className={`veloria-input w-full bg-soft-white ${errors.confirmPassword ? 'border-burgundy' : 'border-gold/30'}`}
                            />
                            <button 
                              type="button"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-soft-black/50 hover:text-burgundy"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <FiEyeOff /> : <FiEye />}
                            </button>
                          </div>
                          {errors.confirmPassword && <p className="mt-1 text-burgundy text-sm">{errors.confirmPassword}</p>}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-gold/10">
                    <div className="text-soft-black/70 flex items-center gap-2">
                      <FiCalendar className="w-4 h-4 text-burgundy" />
                      <span>Member since: {new Date(formData.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </div>
                    
                    <div className="flex gap-4">
                      {editMode && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="submit"
                          className="btn-primary px-6 py-2 flex items-center gap-2"
                          disabled={loading}
                        >
                          {loading ? 'Saving...' : 'Save Changes'}
                          <FiCheckCircle className="w-4 h-4" />
                        </motion.button>
                      )}
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={handleLogout}
                        className="btn-outline px-6 py-2"
                      >
                        Logout
                      </motion.button>
                    </div>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </motion.div>
      ) : (
        <motion.div 
          key="auth"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="min-h-screen bg-cream paper-texture py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center"
        >
          <div className="max-w-md w-full">
            <div className="text-center mb-8">
              <motion.h1
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-3xl font-serif text-burgundy mb-2"
              >
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </motion.h1>
              <motion.p
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-soft-black/70"
              >
                {isSignUp ? 'Join the luxury fragrance experience' : 'Sign in to your account'}
              </motion.p>
            </div>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-soft-white border border-gold/10 shadow-sm p-8"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <AnimatePresence mode="wait">
                  {isSignUp && (
                    <motion.div
                      key="fullName"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <label className="block text-sm font-medium text-soft-black/70 mb-1">Full Name *</label>
                      <input 
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className={`veloria-input w-full bg-transparent ${errors.fullName ? 'border-burgundy' : 'border-gold/30'}`}
                      />
                      {errors.fullName && <p className="mt-1 text-burgundy text-sm">{errors.fullName}</p>}
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <div>
                  <label className="block text-sm font-medium text-soft-black/70 mb-1">Email *</label>
                  <input 
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`veloria-input w-full bg-transparent ${errors.email ? 'border-burgundy' : 'border-gold/30'}`}
                  />
                  {errors.email && <p className="mt-1 text-burgundy text-sm">{errors.email}</p>}
                </div>
                
                <AnimatePresence mode="wait">
                  {isSignUp && (
                    <motion.div
                      key="phone"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <label className="block text-sm font-medium text-soft-black/70 mb-1">Phone *</label>
                      <div className="flex">
                        <select 
                          name="countryCode"
                          value={formData.countryCode}
                          onChange={handleInputChange}
                          className="veloria-input w-20 bg-transparent border-gold/30"
                        >
                          <option value="+91">+91</option>
                          <option value="+1">+1</option>
                          <option value="+44">+44</option>
                        </select>
                        <input 
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`veloria-input w-full bg-transparent ${errors.phone ? 'border-burgundy' : 'border-gold/30'}`}
                        />
                      </div>
                      {errors.phone && <p className="mt-1 text-burgundy text-sm">{errors.phone}</p>}
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <div>
                  <label className="block text-sm font-medium text-soft-black/70 mb-1">Password *</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`veloria-input w-full bg-transparent ${errors.password ? 'border-burgundy' : 'border-gold/30'}`}
                    />
                    <button 
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-soft-black/50 hover:text-burgundy"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-burgundy text-sm">{errors.password}</p>}
                  {isSignUp && !errors.password && (
                    <p className="mt-1 text-soft-black/50 text-xs">Password must be at least 6 characters</p>
                  )}
                </div>
                
                <AnimatePresence mode="wait">
                  {isSignUp && (
                    <motion.div
                      key="confirmPassword"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <label className="block text-sm font-medium text-soft-black/70 mb-1">Confirm Password *</label>
                      <div className="relative">
                        <input 
                          type={showPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className={`veloria-input w-full bg-transparent ${errors.confirmPassword ? 'border-burgundy' : 'border-gold/30'}`}
                        />
                        <button 
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-soft-black/50 hover:text-burgundy"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                      </div>
                      {errors.confirmPassword && <p className="mt-1 text-burgundy text-sm">{errors.confirmPassword}</p>}
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="btn-primary w-full py-3"
                  disabled={loading}
                >
                  {loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
                </motion.button>
              </form>
              
              <div className="mt-6 text-center">
                <button
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setFormData(prev => ({
                      ...prev,
                      fullName: '',
                      password: '',
                      confirmPassword: '',
                      phone: ''
                    }));
                    setErrors({});
                  }}
                  className="text-burgundy hover:text-gold transition-colors"
                >
                  {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Account;