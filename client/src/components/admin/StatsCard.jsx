import React from 'react';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { motion } from 'framer-motion';

const StatsCard = ({ title, value, icon, change, color }) => {
  const isPositive = change >= 0;
  
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300`}
    >
      <div className={`h-2 bg-gradient-to-r ${color}`}></div>
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-white">{value}</h3>
          </div>
          <div className={`p-3 rounded-lg bg-gradient-to-br ${color} bg-opacity-20`}>
            {icon}
          </div>
        </div>
        
        <div className="mt-4 flex items-center">
          <div className={`flex items-center ${isPositive ? 'text-green-400' : 'text-red-400'} text-sm`}>
            {isPositive ? <FiArrowUp className="mr-1" /> : <FiArrowDown className="mr-1" />}
            <span>{Math.abs(change)}%</span>
          </div>
          <span className="text-gray-400 text-sm ml-2">vs previous period</span>
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;