import React from 'react';

export default function PermissionStatsCards({ statistics }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-white p-6 rounded-xl shadow-lg text-center">
        <div className="text-2xl font-bold text-green-600 mb-2">{statistics.approved}</div>
        <div className="text-sm text-gray-600">Aprobadas</div>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-lg text-center">
        <div className="text-2xl font-bold text-yellow-600 mb-2">{statistics.pending}</div>
        <div className="text-sm text-gray-600">Pendientes</div>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-lg text-center">
        <div className="text-2xl font-bold text-red-600 mb-2">{statistics.rejected}</div>
        <div className="text-sm text-gray-600">Rechazadas</div>
      </div>
    </div>
  );
}