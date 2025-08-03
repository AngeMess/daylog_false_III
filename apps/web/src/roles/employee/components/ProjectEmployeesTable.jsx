// src/components/tables/ProjectEmployeesTable.jsx
import React from 'react';

/**
 * Componente de tabla para mostrar empleados y sus actividades en un proyecto.
 * @param {object} props - Las props del componente.
 * @param {Array<object>} props.employeeActivities - Un array de objetos de empleado con su conteo de actividades.
 * @example
 * [{ fullName: 'Juan Perez', cuscaId: 'EMP001', actividades: 5, employeeId: 'abc12345' }]
 */
export default function ProjectEmployeesTable({ employeeActivities }) {
  if (!employeeActivities || employeeActivities.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        No hay empleados asignados a este equipo de trabajo.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Nombre Completo
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              ID Cusca
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Email
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actividades
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {employeeActivities.map((employee) => (
            <tr key={employee.employeeId}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {employee.fullName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {employee.cuscaId}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 truncate">
                {employee.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {employee.actividades}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}