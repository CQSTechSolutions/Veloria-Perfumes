import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaEye, FaEyeSlash, FaGoogle, FaFacebook } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, error: authError } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Check if there's a success message from registration
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the message from location state
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    // Set error from auth context if it exists
    if (authError) {
      setErrors({ submit: authError });
    }
  }, [authError]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        // Use the login function from AuthContext
        await login(formData.email, formData.password);
        
        // Redirect to home page after successful login
        navigate('/', { 
          state: { 
            message: 'You have successfully signed in!' 
          } 
        });
      } catch (error) {
        console.error('Login error:', error);
        // Error is handled by the AuthContext and set in the useEffect above
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Sign In</h1>
            <p className="text-gray-600 mt-2">Welcome back to Veloria Perfumes</p>
          </div>
          
          {successMessage && (
            <div className="mb-6 p-3 bg-green-100 text-green-700 rounded-md">
              {successMessage}
            </div>
          )}
          
          <div className="bg-white rounded-lg shadow-md p-8">
            {/* Social Sign In Buttons */}
            <div className="space-y-3 mb-6">
              <button className="w-full flex items-center justify-center gap-2 bg-red-500 text-white py-3 px-4 rounded-md hover:bg-red-600 transition-colors">
                <FaGoogle /> Sign in with Google
              </button>
              <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors">
                <FaFacebook /> Sign in with Facebook
              </button>
            </div>
            
            <div className="relative flex items-center justify-center mb-6">
              <div className="border-t border-gray-300 w-full"></div>
              <div className="bg-white px-4 text-sm text-gray-500 absolute">or sign in with email</div>
            </div>
            
            {/* Login Form */}
            <form onSubmit={handleSubmit}>
              {errors.submit && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                  {errors.submit}
                </div>
              )}
              
              {/* Email */}
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
              
              {/* Password */}
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>
              
              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <div>
                  <Link to="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-800">
                    Forgot password?
                  </Link>
                </div>
              </div>
              
              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing In...
                  </span>
                ) : 'Sign In'}
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link to="/signup" className="text-indigo-600 hover:text-indigo-800 font-medium">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SignIn;