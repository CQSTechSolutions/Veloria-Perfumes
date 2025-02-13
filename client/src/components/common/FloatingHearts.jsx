import React from 'react';

const FloatingHearts = ({ count = 12 }) => {
  return (
    <div className="fixed inset-0 pointer-events-none">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="absolute animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${15 + Math.random() * 10}s`
          }}
        >
          <span 
            className="text-red-400 transform rotate-45" 
            style={{ fontSize: `${Math.random() * 20 + 20}px` }}
          >
            ❤️
          </span>
        </div>
      ))}
    </div>
  );
};

export default FloatingHearts; 