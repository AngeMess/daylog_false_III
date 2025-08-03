import React from 'react';
import { Clock } from 'lucide-react';

export default function CompensatoryHoursCard({ hours }) {
  return (
    <div className="bg-green-50 border border-green-200 rounded-xl p-6">
      <div className="flex items-center mb-3">
        <Clock className="text-green-600 mr-2" size={20} />
        <h3 className="font-semibold text-green-800">Horas compensatorias</h3>
      </div>
      <div className="text-3xl font-bold text-green-600 mb-2">{hours}</div>
      <p className="text-sm text-green-700">Disponibles para usar</p>
    </div>
  );
}