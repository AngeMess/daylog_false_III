import React from 'react';

export default function ProjectStatsCard() {
  return (

<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* Tarjeta de proyectos activos */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-[#194167]">Número de proyectos activos</h2>
        <p className="text-3xl font-bold text-[#194167]">2</p>
      </div>

      {/* Tarjeta de proyectos externos */}
      <div className="bg-white rounded-xl p-6 shadow-sm text-[#194167]">
        <h2 className="text-lg font-semibold mb-4">Proyectos externos</h2>
        <p className="text-lg font-medium">Guatemala</p>
      </div>

      {/* Tarjeta de apoyo */}
      <div className="bg-white rounded-xl p-6 shadow-sm text-[#194167]">
        <h2 className="text-lg font-semibold mb-4">Apoya a:</h2>
        <p className="text-lg font-medium">LEGENDS</p>
      </div>
    </div>
  );
}