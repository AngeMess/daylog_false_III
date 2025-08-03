import React from 'react';

export default function PerformanceCard() {
  return (

    <div className="bg-white rounded-xl p-6 shadow-sm md:col-span-2 text-[#194167]">
      <h2 className="text-lg font-semibold mb-4">Rendimiento</h2>
      <p className="text-sm mb-4">Esta semana</p>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1 text-[#194167]">
            <span className="text-sm font-medium">Horas laborales</span>
            <span className="text-sm font-bold">52h</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1 text-[#194167]">
            <span className="text-sm font-medium">Horas extra</span>
            <span className="text-sm font-bold">12h</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1 text-[#194167]">
            <span className="text-sm font-medium">Horas compensatorias</span>
            <span className="text-sm font-bold">6h</span>
          </div>
        </div>
      </div>
    </div>
  );
}