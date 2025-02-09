import React, { useEffect, useState } from 'react';
import { FiUser, FiMail, FiLock, FiPhone } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Account = () => {
  const [token, setToken] = useState(null);
  const [isLogin, setIsLogin] = useState(false);
  const [loginTab, setLoginTab] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    countryCode: '',
  });

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);

    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    if (userDetails) {
      setFormData({
        fullName: userDetails.fullName || '',
        email: userDetails.email || '',
        phone: userDetails.phone || '',
        countryCode: userDetails.countryCode || '',
        password: '',
        confirmPassword: '',
      });
    }
  }, []);

  const passwordRequirements = [
    { label: 'At least 8 characters', regex: /.{8,}/ },
    { label: 'Contains uppercase letter', regex: /[A-Z]/ },
    { label: 'Contains lowercase letter', regex: /[a-z]/ },
    { label: 'Contains number', regex: /[0-9]/ },
    { label: 'Contains special character', regex: /[!@#$%^&*]/ },
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName && !loginTab) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    if (!loginTab && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!loginTab && !formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!loginTab && !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number format';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    if (validateForm()) {
      const fullPhoneNumber = `${formData.countryCode}${formData.phone}`;
    //   console.log(`Form is ${loginTab ? 'login' : 'register'}`);
    //   console.log(`Updated form without country code and phone number:`, {
    //     fullName: formData.fullName,
    //     email: formData.email,
    //     password: formData.password,
    //     fullPhoneNumber: fullPhoneNumber
    //   });
      setIsLogin(true);
    }
  };

  return (
    <>
      {isLogin ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="h-screen flex items-center justify-center bg-gradient-to-r from-red-200 to-red-500"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-xl w-full mx-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="relative bg-red-600 p-6 text-white">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="absolute top-5 right-5 bg-yellow-400 rounded-full p-4"
                >
                  <FiUser className="w-6 h-6 text-red-600" />
                </motion.div>
                <h2 className="text-2xl font-bold">Account Details</h2>
                <p className="text-red-100 mt-2">Welcome back, {formData.fullName}!</p>
              </div>

              <div className="p-6">
                <motion.div 
                  className="space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="bg-gray-50 rounded-lg p-3 hover:shadow-md transition-shadow duration-300">
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="text-lg font-semibold text-gray-800">{formData.fullName}</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3 hover:shadow-md transition-shadow duration-300">
                    <p className="text-sm text-gray-500">Email Address</p>
                    <p className="text-lg font-semibold text-gray-800">{formData.email}</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3 hover:shadow-md transition-shadow duration-300">
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {formData.countryCode} {formData.phone}
                    </p>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-200 font-semibold"
                      onClick={() => {
                        // Add edit profile functionality
                        setIsLogin(false);
                      }}
                    >
                      Edit Profile
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 border-2 border-red-600 text-red-600 py-2 px-4 rounded-lg hover:bg-red-50 transition-colors duration-200 font-semibold"
                      onClick={() => {
                        // Add logout functionality
                        localStorage.removeItem('token');
                        localStorage.removeItem('userDetails');
                        setIsLogin(false);
                        setLoginTab(true);
                      }}
                    >
                      Logout
                    </motion.button>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-6 pt-4 border-t border-gray-200"
                >
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <p>Member since</p>
                    <p>{new Date().toLocaleDateString()}</p>
                  </div>
                </motion.div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-4 text-center text-gray-800 text-sm"
            >
              <p className="font-semibold">Need assistance? Reach out to our support team!</p>
              <Link to="mailto:support@example.com" className="text-red-600 underline">support@example.com</Link>
            </motion.div>
          </motion.div>
        </motion.div>
      ) : (
        <div className="min-h-screen bg-gradient-to-r from-red-200 to-red-500 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md w-full"
          >
            <div className="bg-white shadow-2xl rounded-lg overflow-hidden">
              <div className="flex border-b border-gray-200">
                <motion.button
                  whileHover={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                  className={`flex-1 py-4 text-center font-semibold ${loginTab ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500'}`}
                  onClick={() => setLoginTab(true)}
                >
                  Login
                </motion.button>
                <motion.button
                  whileHover={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                  className={`flex-1 py-4 text-center font-semibold ${!loginTab ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500'}`}
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
                    />
                    
                    {!loginTab && (
                      <div className="mt-2 space-y-2">
                        {passwordRequirements.map((req, index) => (
                          <div 
                            key={index}
                            className={`text-xs flex items-center ${
                              req.regex.test(formData.password) ? 'text-green-600' : 'text-gray-400'
                            }`}
                          >
                            <div className={`w-2 h-2 rounded-full mr-2 ${
                              req.regex.test(formData.password) ? 'bg-green-600' : 'bg-gray-400'
                            }`} />
                            {req.label}
                          </div>
                        ))}
                      </div>
                    )}
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
                    type="button"
                    className="w-full py-3 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-semibold"
                    onClick={handleSubmit}
                  >
                    {loginTab ? 'Sign In' : 'Create Account'}
                  </motion.button>

                  {loginTab && (
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="w-full text-sm text-red-600 hover:text-red-800 transition-colors duration-200"
                    >
                      Forgot Password?
                    </motion.button>
                  )}
                </motion.form>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

const InputField = ({ icon, label, error, ...props }) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="relative">
      <span className="absolute left-3 top-3 text-gray-400">
        {icon}
      </span>
      <input
        {...props}
        className={`w-full pl-10 pr-3 py-2 border ${
          error ? 'border-red-500' : 'border-gray-300'
        } rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200`}
      />
    </div>
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
);

export default Account;