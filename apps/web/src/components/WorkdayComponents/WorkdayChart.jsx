import React from 'react';
import { EmployeeWeeklyHoursChart } from '../charts/ActivityWeeklyChart';

/**
 * Componente de gráfico de horas semanales
 * 
 * Este componente renderiza un gráfico que muestra las horas trabajadas por semana.
 * Utiliza el componente EmployeeWeeklyHoursChart para mostrar los datos en formato
 * visual con un diseño de tarjeta consistente.
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.data - Datos para el gráfico de horas semanales
 * @returns {JSX.Element} El componente WorkdayChart renderizado
 * 
 * @example
 * // Gráfico con datos básicos
 * <WorkdayChart data={datosHorasSemanales} />
 * 
 * // Con datos específicos
 * <WorkdayChart data={[
 *   { dia: "Lunes", horas: 8 },
 *   { dia: "Martes", horas: 7.5 },
 *   { dia: "Miércoles", horas: 8.5 }
 * ]} />
 */
const WorkdayChart = ({ data }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
    <h2 className="text-xl text-gray-800 font-semibold mb-6">Gráfico semanal de horas</h2>
    <EmployeeWeeklyHoursChart data={data} />
  </div>
);

export default WorkdayChart; 