import React, { useEffect, useState } from 'react';
import { FiUser, FiMail, FiLock, FiPhone } from 'react-icons/fi'; // Removed FiEye and FiEyeOff
import { motion } from 'framer-motion';

const Account = () => {
  const [token, setToken] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    countryCode: '', // New state for country code
  });

  const passwordRequirements = [
    { label: 'At least 8 characters', regex: /.{8,}/ },
    { label: 'Contains uppercase letter', regex: /[A-Z]/ },
    { label: 'Contains lowercase letter', regex: /[a-z]/ },
    { label: 'Contains number', regex: /[0-9]/ },
    { label: 'Contains special character', regex: /[!@#$%^&*]/ },
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName && !isLogin) {
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
    
    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!isLogin && !formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!isLogin && !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number format';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(formData);
    if (validateForm()) {
      const fullPhoneNumber = `${formData.countryCode}${formData.phone}`; // Combine country code and phone number
      // Your existing submit logic, send fullPhoneNumber to backend
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-red-200 to-red-500 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center"> {/* Centering the form */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <div className="bg-white shadow-2xl rounded-lg overflow-hidden">
          {/* Auth Tabs */}
          <div className="flex border-b border-gray-200">
            <motion.button
              whileHover={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
              className={`flex-1 py-4 text-center font-semibold ${isLogin ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500'}`}
              onClick={() => setIsLogin(true)}
            >
              Login
            </motion.button>
            <motion.button
              whileHover={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
              className={`flex-1 py-4 text-center font-semibold ${!isLogin ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500'}`}
              onClick={() => setIsLogin(false)}
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
              {!isLogin && (
                <div>
                  <InputField
                    icon={<FiUser />}
                    label="Full Name"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    error={errors.fullName}
                    placeholder="Enter your full name"
                  />
                </div>
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
                
                {!isLogin && (
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

              {!isLogin && (
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
                      className="w-1/3" // Adjust width for country code input
                    />
                    <InputField
                      icon={<FiPhone />}
                      label="Phone Number"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      error={errors.phone}
                      placeholder="10-digit number"
                      className="w-2/3" // Adjust width for phone number input
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
                {isLogin ? 'Sign In' : 'Create Account'}
              </motion.button>

              {isLogin && (
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