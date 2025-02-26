import React from 'react';

const StatsCard = ({ title, value, icon, color }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
        <div className="ml-4">
          <h3 className="text-gray-400 text-sm">{title}</h3>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default StatsCard; 