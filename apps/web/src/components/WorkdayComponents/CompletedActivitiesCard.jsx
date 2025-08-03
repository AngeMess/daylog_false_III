import React from 'react';
import { Check, CheckCircle, Clock, Calendar } from 'lucide-react';

/**
 * Componente de tarjeta para mostrar actividades completadas
 * 
 * Este componente renderiza una lista de actividades completadas en formato de tarjeta.
 * Cada actividad muestra su nombre, fecha de completado y tiempo dedicado.
 * Incluye iconos visuales y un diseño limpio con scroll automático para listas largas.
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.actividades - Array de actividades completadas
 * @param {string} props.actividades[].nombre - Nombre de la actividad
 * @param {string} props.actividades[].fecha - Fecha de completado
 * @param {string} props.actividades[].tiempo - Tiempo dedicado a la actividad
 * @returns {JSX.Element} El componente CompletedActivitiesCard renderizado
 * 
 * @example
 * // Lista básica de actividades
 * <CompletedActivitiesCard 
 *   actividades={[
 *     { nombre: "Revisar documentación", fecha: "2024-01-15", tiempo: "2h" },
 *     { nombre: "Desarrollo de feature", fecha: "2024-01-14", tiempo: "4h" }
 *   ]} 
 * />
 * 
 * // Con múltiples actividades (scroll automático)
 * <CompletedActivitiesCard actividades={actividadesCompletadas} />
 */
const CompletedActivitiesCard = ({ actividades }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl text-gray-800 font-semibold">Actividades completadas</h2>
      <div className="bg-gray-50 p-2 rounded-full">
        <CheckCircle className="h-5 w-5 text-emerald-500" />
      </div>
    </div>
    <div className="space-y-3 overflow-y-auto max-h-[350px] pr-2">
      {actividades.map((actividad, index) => (
        <div key={index} className="border-b border-gray-100 pb-3 last:border-b-0">
          <div className="flex items-start">
            <div className="mr-3 mt-1">
              <Check className="h-5 w-5 text-emerald-500" />
            </div>
            <div className="flex-grow">
              <h3 className="font-medium text-gray-800">{actividad.nombre}</h3>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-gray-500">
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>{actividad.fecha}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{actividad.tiempo}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default CompletedActivitiesCard; 