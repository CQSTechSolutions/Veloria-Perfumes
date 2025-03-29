import React, { useState } from 'react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      // In a real implementation, you would send this to your backend
      console.log('Email submitted:', email);
      setIsSubscribed(true);
      setEmail('');
    }
  };

  return (
    <div className="relative py-16 bg-white overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute left-0 bottom-0 w-40 h-40 bg-gradient-to-tr from-indigo-100 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute right-0 top-0 w-40 h-40 bg-gradient-to-bl from-purple-100 to-transparent rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">Stay Inspired</h2>
          <div className="w-24 h-1 bg-indigo-400 mx-auto mb-6"></div>
          <p className="text-gray-600 mb-8 text-lg">
            Join our fragrance community and be the first to discover new scents, exclusive offers, and expert perfume tips.
          </p>
          
          {isSubscribed ? (
            <div className="bg-indigo-50 border border-indigo-100 text-gray-800 px-6 py-5 rounded-lg mb-6 animate-fade-in">
              <p className="font-medium text-lg text-gray-900">Thank you for subscribing!</p>
              <p className="text-gray-600 mt-1">Look for our fragrance updates in your inbox soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-grow px-5 py-4 rounded-lg border border-gray-200 bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="px-8 py-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 shadow-lg"
                >
                  Subscribe
                </button>
              </div>
              <p className="text-gray-500 text-sm mt-4 text-left">
                We respect your privacy. You can unsubscribe at any time.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Newsletter; 