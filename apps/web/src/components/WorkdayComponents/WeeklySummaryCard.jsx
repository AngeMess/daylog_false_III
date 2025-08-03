import React from 'react';

/**
 * Componente de tarjeta de resumen semanal
 * 
 * Este componente renderiza una tarjeta que muestra el resumen de horas trabajadas
 * en la semana actual. Incluye el total de horas y un desglose por día con
 * un diseño centrado y visualmente atractivo.
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string|number} props.totalHoras - Total de horas trabajadas en la semana
 * @param {Array} props.dias - Array con el desglose de horas por día
 * @param {string} props.dias[].dia - Nombre del día (ej: "Lun", "Mar")
 * @param {string|number} props.dias[].horas - Horas trabajadas en ese día
 * @returns {JSX.Element} El componente WeeklySummaryCard renderizado
 * 
 * @example
 * // Resumen semanal básico
 * <WeeklySummaryCard 
 *   totalHoras="40" 
 *   dias={[
 *     { dia: "Lun", horas: "8" },
 *     { dia: "Mar", horas: "8" },
 *     { dia: "Mie", horas: "8" },
 *     { dia: "Jue", horas: "8" },
 *     { dia: "Vie", horas: "8" }
 *   ]} 
 * />
 * 
 * // Con datos dinámicos
 * <WeeklySummaryCard 
 *   totalHoras={horasTotales} 
 *   dias={datosSemana} 
 * />
 */
const WeeklySummaryCard = ({ totalHoras, dias }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center">
    <h2 className="text-xl text-gray-800 font-semibold mb-4">Resumen semanal</h2>
    <div className="text-5xl font-bold text-[#01426A] mb-2">{totalHoras}</div>
    <div className="text-gray-600 mb-2">Horas trabajadas esta semana</div>
    <div className="flex flex-wrap justify-center gap-4 w-full">
      {dias.map((d, i) => (
        <div key={i} className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-semibold text-sm">{d.dia}: {d.horas}h</div>
      ))}
    </div>
  </div>
);

export default WeeklySummaryCard; 