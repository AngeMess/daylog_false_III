/**
 * Componente TeamMembersTable - Tabla de miembros del equipo
 * 
 * Este componente muestra una tabla con los miembros de un equipo de trabajo.
 * Incluye información detallada de cada empleado como nombre, ID, email, posición y país.
 * 
 * Información mostrada por empleado:
 * - Nombre completo con avatar
 * - ID Cusca (identificador único)
 * - Email de contacto
 * - Posición o cargo
 * - País de origen
 * 
 * Características:
 * - Estado vacío cuando no hay miembros asignados
 * - Diseño responsivo con scroll horizontal en móviles
 * - Avatares con iconos para cada empleado
 * - Manejo de datos faltantes o nulos
 * - Estilos consistentes con el sistema de diseño
 * - Headers claros y organizados
 */

import React from 'react';

export default function TeamMembersTable({ employees }) {
  if (!employees || employees.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-base sm:text-lg font-semibold text-[#194167]">
            Miembros del equipo (0)
          </h3>
        </div>
        <div className="p-8 text-center text-gray-500">
          <div className="text-4xl mb-4">👥</div>
          <h3 className="text-lg font-medium mb-2 text-gray-700">
            No hay miembros asignados
          </h3>
          <p className="text-sm">
            Este equipo aún no tiene empleados asignados.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-base sm:text-lg font-semibold text-[#194167]">
          Miembros del equipo ({employees.length})
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID Cusca
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Posición
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                País
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees.map((empleado) => (
              <tr key={empleado.id?._id || empleado._id}>
                <td className="py-3 px-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                      <svg
                        viewBox="0 0 24 24"
                        width="16"
                        height="16"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                    <span className="font-medium text-gray-900">
                      {empleado.id?.fullName || "Nombre no disponible"}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-600">
                  {empleado.id?.cuscaId || "N/A"}
                </td>
                <td className="py-3 px-4 text-gray-600">
                  {empleado.id?.email || "Email no disponible"}
                </td>
                <td className="py-3 px-4 text-gray-600">
                  {empleado.id?.position || "Posición no especificada"}
                </td>
                <td className="py-3 px-4 text-gray-600">
                  {empleado.id?.country?.name || "País no especificado"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}