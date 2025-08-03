import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, Clock, Calendar, Plus } from 'lucide-react';
import { Button } from '../../components/Buttons';
import { useNavigate } from 'react-router-dom';

export default function ProjectActivitiesTable({ activities }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: 'recordatorio',
    direction: 'asc'
  });

  // Función para ordenar la tabla
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filtrar actividades según el término de búsqueda
  const filteredActivities = activities.filter(activity => 
    activity.actividad?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Ordenar actividades según la configuración actual
  const sortedActivities = [...filteredActivities].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Renderizar el icono de ordenamiento
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === 'asc' ? 
      <ChevronUp size={16} className="ml-1" /> : 
      <ChevronDown size={16} className="ml-1" />;
  };

  return (
    <div className="mt-4">
      {/* Título y botón */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Recordatorios</h2>
        <Button 
                variant="btn_primary"
                
              >
                <Plus size={18} className="mr-2" />
                Agregar recordatorio
              </Button>
      </div>
      
      {/* Tabla de actividades */}
      <div className="overflow-x-auto sm:overflow-x-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('actividad')}
              >
                <div className="flex items-center">
                  Recordatorio
                  {getSortIcon('actividad')}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('fecha')}
              >
                <div className="flex items-center">
                  Fecha
                  {getSortIcon('fecha')}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('horas')}
              >
                <div className="flex items-center">
                  Horas
                  {getSortIcon('horas')}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('proyecto')}
              >
                <div className="flex items-center">
                  Proyecto
                  {getSortIcon('proyecto')}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 overflow-x-auto">
            {sortedActivities.length > 0 ? (
              sortedActivities.map((activity) => (
                <tr key={activity.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{activity.actividad}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar size={16} className="text-gray-400 mr-2" />
                      <div className="text-sm text-gray-500">{activity.fecha}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-medium">{activity.horas}h</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{activity.proyecto}</div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                  {searchTerm ? 'No se encontraron actividades que coincidan con la búsqueda.' : 'No hay actividades registradas.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Información del total */}
      <div className="mt-4 text-right text-sm text-gray-500">
        Total: {filteredActivities.length} recordatios | {filteredActivities.reduce((sum, act) => sum + act.horas, 0)} horas
      </div>
    </div>
  );
}
