import React from 'react';
import { FileText } from 'lucide-react';

export default function ActivitiesCard({ value }) {
  return (
    <div className="bg-white rounded-xl shadow-sm transition hover:shadow-md w-full h-full p-10 flex flex-col items-center justify-center">
      <div className="flex items-center justify-center w-16 h-16 rounded-full mb-4">
        <FileText size={48} color="#FFC600" />
      </div>
      <h3 className="text-lg md:text-2xl font-bold text-gray-700 mb-2 text-center">Actividades en curso</h3>
      <p className="text-4xl md:text-5xl font-extrabold text-gray-700 text-center">{value}</p>
    </div>
  );
} 