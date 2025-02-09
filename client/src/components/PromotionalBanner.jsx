import { FiStar } from 'react-icons/fi';

const PromotionalBanner = () => {
    return (
      // Promotional Banner
      <section className="relative bg-gradient-to-r from-red-300 via-white to-red-300 py-8 overflow-hidden shadow-lg rounded-lg border border-red-500">
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 
            className="text-7xl font-extrabold text-red-700 mb-8 transform hover:scale-110 transition-transform duration-300"
            style={{ textShadow: '3px 3px 6px rgba(0,0,0,0.3)' }}
          >
            <span className="flex items-center justify-center">
              BUY 3 GET 1 FREE
            </span>
          </h2>
          
          {/* Rotating Stars */}
          <div className="flex items-center justify-center gap-6 mb-10">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i}
                className="transform hover:scale-125 transition-transform duration-300"
              >
                <FiStar 
                  className={`w-10 h-10 text-yellow-500 animate-spin-slow fill-current hover:text-yellow-400`}
                  style={{ 
                    animationDuration: `${6 + i * 1.5}s`,
                    animationDirection: i % 2 === 0 ? 'normal' : 'reverse'
                  }}
                />
              </div>
            ))}
          </div>

          <p className="text-3xl text-gray-900 mb-10 font-semibold uppercase text-shadow-lg text-red-700">on all products</p>
          <a 
            href="/collections" 
            className="inline-block bg-gradient-to-r from-red-700 to-red-900 text-white py-5 px-12 rounded-full text-lg font-semibold hover:from-red-800 hover:to-red-950 transition-all duration-300 transform hover:scale-110 hover:shadow-xl flex items-center justify-center mx-auto max-w-xs"
          >
            <span className="mr-2 text-2xl">🛒</span> Shop Now
          </a>
          <p className="text-xl text-gray-700 mt-8 animate-pulse">Limited Time Offer!</p>
        </div>
      </section>
    );
}

export default PromotionalBanner;