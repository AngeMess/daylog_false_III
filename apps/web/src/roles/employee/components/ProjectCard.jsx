import React from 'react';

export default function ProjectCard({ name, description, date }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 flex flex-col justify-between h-36 border border-gray-100 transition hover:shadow-md w-full">
      <div>
        <div className="text-base font-bold text-[#01426A] mb-1">{name}</div>
        <div className="text-sm text-gray-500 mb-2">{description}</div>
      </div>
      <div className="flex items-center justify-between mt-auto pt-2">
        <span className="text-xs text-gray-400">Inicia: {date}</span>
        <span className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-semibold">Próximo</span>
      </div>
    </div>
  );
} 