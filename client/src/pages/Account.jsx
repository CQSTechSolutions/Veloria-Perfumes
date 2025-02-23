import React, { useEffect, useState } from 'react';
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff, FiShoppingBag, FiClock, FiCalendar } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';

const InputField = ({ icon, label, type, value, onChange, error, placeholder, className = "w-full" }) => (
  <div className={className}>
    <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        {icon}
      </div>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full pl-10 pr-4 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200`}
      />
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-xs mt-1"
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
  const [loginTab, setLoginTab] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    countryCode: '',
    createdAt: '',
  });

  const navigate = useNavigate();

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
    navigate('/');
  };

  const validateForm = () => {
    const newErrors = {};
    if (!loginTab && !formData.fullName) newErrors.fullName = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!loginTab && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const login = async (formData) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        email: formData.email,
        password: formData.password
      });

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
        });

        localStorage.setItem('token', response.data.token);
        localStorage.setItem('expirationTime', new Date().getTime() + 60 * 60 * 1000);
        setToken(response.data.token);
        setIsLogin(true);
        toast.success('Successfully logged in!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to login. Please try again.');
    }
  };

  const register = async (formData) => {
    try {
      const registrationData = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        countryCode: formData.countryCode || '+91',
        createdAt: new Date().toISOString()
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        registrationData
      );

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
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      try {
        if (loginTab) {
          await login(formData);
        } else {
          await register(formData);
        }
      } catch (error) {
        toast.error('An error occurred', {
          icon: '❌',
          style: { background: '#333', color: '#fff' }
        });
      }
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
          className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 py-12 px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-4xl mx-auto">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20"
            >
              <div className="p-8">
                <div className="flex items-center gap-6 mb-8">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center"
                  >
                    <FiUser className="w-12 h-12 text-white" />
                  </motion.div>
                  <div>
                    <motion.h1 
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-3xl font-bold text-white"
                    >
                      {formData.fullName}
                    </motion.h1>
                    <motion.p 
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="text-purple-200"
                    >
                      {formData.email}
                    </motion.p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white/5 p-6 rounded-xl border border-white/10"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <FiPhone className="w-5 h-5 text-purple-300" />
                      <h2 className="text-lg font-semibold text-white">Contact Details</h2>
                    </div>
                    <div className="space-y-2">
                      <p className="text-purple-200">
                        <span className="text-purple-400">Email:</span> {formData.email}
                      </p>
                      <p className="text-purple-200">
                        <span className="text-purple-400">Phone:</span> {formData.countryCode} {formData.phone}
                      </p>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="bg-white/5 p-6 rounded-xl border border-white/10"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <FiCalendar className="w-5 h-5 text-purple-300" />
                      <h2 className="text-lg font-semibold text-white">Account Info</h2>
                    </div>
                    <div className="space-y-2">
                      <p className="text-purple-200">
                        <span className="text-purple-400">Member since:</span>{' '}
                        {new Date(formData.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      <p className="text-purple-200">
                        <span className="text-purple-400">Account status:</span>{' '}
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                          Active
                        </span>
                      </p>
                    </div>
                  </motion.div>
                </div>

                <div className="mt-8 flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-all duration-200"
                    onClick={() => navigate('/cart')}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <FiShoppingBag className="w-5 h-5" />
                      <span>View Cart</span>
                    </div>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 border border-white/20 text-white py-3 px-6 rounded-lg hover:bg-white/5 transition-all duration-200"
                    onClick={handleLogout}
                  >
                    Logout
                  </motion.button>
                </div>
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
          className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 py-12 px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-md mx-auto">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20"
            >
              <div className="flex border-b border-white/10">
                <motion.button
                  whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                  className={`flex-1 py-4 text-center font-semibold ${loginTab ? 'text-white border-b-2 border-purple-500' : 'text-purple-200'}`}
                  onClick={() => setLoginTab(true)}
                >
                  Login
                </motion.button>
                <motion.button
                  whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                  className={`flex-1 py-4 text-center font-semibold ${!loginTab ? 'text-white border-b-2 border-purple-500' : 'text-purple-200'}`}
                  onClick={() => setLoginTab(false)}
                >
                  Register
                </motion.button>
              </div>

              <div className="p-8">
                <motion.form 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  {loginTab ? null : (
                    <InputField
                      icon={<FiUser />}
                      label="Full Name"
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      error={errors.fullName}
                      placeholder="Enter your full name"
                    />
                  )}

                  <InputField
                    icon={<FiMail />}
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    error={errors.email}
                    placeholder="Enter your email address"
                  />

                  <div className="relative">
                    <InputField
                      icon={<FiLock />}
                      label="Password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      error={errors.password}
                      placeholder="Enter your password"
                      rightIcon={
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                      }
                    />
                  </div>

                  {!loginTab && (
                    <>
                      <InputField
                        icon={<FiLock />}
                        label="Confirm Password"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                        error={errors.confirmPassword}
                        placeholder="Confirm your password"
                      />

                      <div className="flex space-x-2">
                        <InputField
                          icon={<FiPhone />}
                          label="Country Code"
                          type="text"
                          value={formData.countryCode}
                          onChange={(e) => setFormData({...formData, countryCode: e.target.value})}
                          error={errors.phone}
                          placeholder="+1"
                          className="w-1/3"
                        />
                        <InputField
                          icon={<FiPhone />}
                          label="Phone Number"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          error={errors.phone}
                          placeholder="10-digit number"
                          className="w-2/3"
                        />
                      </div>
                    </>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-all duration-200"
                  >
                    <span>{loginTab ? 'Sign In' : 'Create Account'}</span>
                  </motion.button>
                </motion.form>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Account;