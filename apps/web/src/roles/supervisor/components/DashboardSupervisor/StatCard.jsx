import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, change, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className={`bg-white p-6 rounded-2xl shadow-sm border border-gray-100 ${className}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
        {change && (
          <div className={`flex items-center mt-2 text-sm ${change > 0 ? 'text-green-600' : 'text-red-600'}`}> 
            <span>{change > 0 ? '+' : ''}{change}%</span>
          </div>
        )}
      </div>
      <div className="p-3 rounded-xl bg-gray-50">
        <Icon className="w-6 h-6 text-[#FFC600]" />
      </div>
    </div>
  </motion.div>
);

export default StatCard; 