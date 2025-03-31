import React from 'react';

const FloatingHearts = ({ count = 10 }) => {
  // Unicode decorative symbols that fit with our theme
  const symbols = ['✦', '✧', '✵', '❋', '❊'];
  
  return (
    <div className="fixed inset-0 pointer-events-none z-0 opacity-40">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="absolute animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${25 + Math.random() * 15}s`
          }}
        >
          <span 
            className="text-gold" 
            style={{ 
              fontSize: `${Math.random() * 15 + 10}px`,
              opacity: Math.random() * 0.5 + 0.2
            }}
          >
            {symbols[Math.floor(Math.random() * symbols.length)]}
          </span>
        </div>
      ))}
    </div>
  );
};

export default FloatingHearts; 