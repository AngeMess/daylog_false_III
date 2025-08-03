import React from 'react';

export default function WorkStatCard({ label, value, icon }) {
  return (
    <div className="bg-white rounded-xl shadow-sm transition hover:shadow-md w-full h-full p-5 flex flex-col items-start">
      <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-gray-100 rounded-full mb-2 md:mb-3">
        {icon}
      </div>
      <h3 className="text-sm md:text-base font-medium text-gray-600 mb-1">{label}</h3>
      <p className="text-xl md:text-2xl font-semibold text-gray-800">{value}</p>
    </div>
  );
} 