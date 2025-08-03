import React from 'react';
import { CheckCircle, Calendar } from 'lucide-react';

/**
 * Componente de tarjeta para mostrar proyectos completados
 * 
 * Este componente renderiza una lista de proyectos completados en formato de tarjeta.
 * Cada proyecto muestra su nombre y fecha de completado con un diseño limpio y organizado.
 * Incluye scroll automático para manejar listas largas de proyectos.
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.proyectos - Array de proyectos completados
 * @param {string} props.proyectos[].nombre - Nombre del proyecto
 * @param {string} props.proyectos[].fecha - Fecha de completado del proyecto
 * @returns {JSX.Element} El componente CompletedProjectsCard renderizado
 * 
 * @example
 * // Lista básica de proyectos
 * <CompletedProjectsCard 
 *   proyectos={[
 *     { nombre: "Sistema de Gestión", fecha: "2024-01-15" },
 *     { nombre: "Aplicación Web", fecha: "2024-01-10" }
 *   ]} 
 * />
 * 
 * // Con múltiples proyectos (scroll automático)
 * <CompletedProjectsCard proyectos={proyectosCompletados} />
 */
const CompletedProjectsCard = ({ proyectos }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl text-gray-800 font-semibold">Proyectos completados</h2>
      <div className="bg-gray-50 p-2 rounded-full">
        <CheckCircle className="h-5 w-5 text-blue-500" />
      </div>
    </div>
    <div className="space-y-4 overflow-y-auto max-h-[350px] pr-2">
      {proyectos.map((proyecto, index) => (
        <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0">
          <h3 className="font-medium text-gray-800 mb-1">{proyecto.nombre}</h3>
          <div className="flex flex-wrap mt-2">
            <div className="flex items-center text-xs text-gray-500">
              <Calendar className="h-3 w-3 mr-1" />
              <span>Completado: {proyecto.fecha}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default CompletedProjectsCard; 