import React from 'react';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { motion } from 'framer-motion';

const StatsCard = ({ title, value, icon, change, color }) => {
  const isPositive = change >= 0;
  
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-soft-white border border-gold/10 shadow-sm overflow-hidden"
    >
      <div className={`h-2 bg-gradient-to-r ${color}`}></div>
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-soft-black/70 text-sm font-medium mb-1">{title}</p>
            <h3 className="text-2xl font-serif text-burgundy">{value}</h3>
          </div>
          <div className={`p-3 bg-gradient-to-br ${color} bg-opacity-20`}>
            {icon}
          </div>
        </div>
        
        <div className="mt-4 flex items-center">
          <div className={`flex items-center ${isPositive ? 'text-green-600' : 'text-burgundy'} text-sm`}>
            {isPositive ? <FiArrowUp className="mr-1" /> : <FiArrowDown className="mr-1" />}
            <span>{Math.abs(change)}%</span>
          </div>
          <span className="text-soft-black/50 text-sm ml-2">vs previous period</span>
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;