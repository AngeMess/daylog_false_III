import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, User } from 'lucide-react';

export default function ProjectEmployeesTable({ employeeActivities, onEmployeeClick }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: 'fullName',
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

  // Filtrar empleados según el término de búsqueda
  const filteredEmployees = employeeActivities.filter(employee => 
    employee.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.cuscaId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Ordenar empleados según la configuración actual
  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
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
      {/* Barra de búsqueda */}
      <div className="mb-4 relative">
        <input
          type="text"
          placeholder="Buscar empleado..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 pl-10 border border-gray-300 rounded-md"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
      </div>
      
      {/* Tabla de empleados */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('fullName')}
              >
                <div className="flex items-center">
                  Empleado
                  {getSortIcon('fullName')}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('cuscaId')}
              >
                <div className="flex items-center">
                  ID
                  {getSortIcon('cuscaId')}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('actividades')}
              >
                <div className="flex items-center">
                  Actividades
                  {getSortIcon('actividades')}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedEmployees.length > 0 ? (
              sortedEmployees.map((employee) => (
                <tr key={employee.employeeId} onClick={() => onEmployeeClick(employee)} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <User size={16} className="text-gray-500" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{employee.fullName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{employee.cuscaId || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-medium">{employee.actividades}</div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
                  {searchTerm ? 'No se encontraron empleados que coincidan con la búsqueda.' : 'No hay empleados asignados a este proyecto.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Información del total */}
      <div className="mt-4 text-right text-sm text-gray-500">
        Total: {filteredEmployees.length} empleados | {filteredEmployees.reduce((sum, emp) => sum + emp.actividades, 0)} actividades
      </div>
    </div>
  );
}