/**
 * Componente TeamInfoCard - Tarjeta de información detallada del equipo
 * 
 * Este componente muestra información detallada de un equipo de trabajo en un formato
 * expandido, ideal para vistas de detalle o modales. Presenta la información de manera
 * organizada y legible.
 * 
 * Información mostrada:
 * - Nombre del equipo y tipo
 * - Código del equipo y estado
 * - Área principal del equipo
 * - Supervisor asignado con email
 * 
 * Características:
 * - Layout responsivo que se adapta a diferentes tamaños de pantalla
 * - Separación visual clara entre secciones
 * - Manejo de casos donde no hay supervisor asignado
 * - Diseño limpio con espaciado consistente
 * - Breakpoints para optimizar la visualización en móviles
 */

import React from 'react';
import CustomHeading from '../Titles/TitleH1'; 


export default function TeamInfoCard({ equipo, getAreaName }) {
  if (!equipo) {
    return null; 
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
        <div className="flex-1">
          <h2 className="text-lg sm:text-xl font-semibold text-[#194167] mb-1">
            {equipo.name}
          </h2>
          <p className="text-xs sm:text-sm font-light text-[#667085] mb-3">
            "{equipo.teamType}"
          </p>
          <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <div className="text-xs sm:text-sm">
              <span className="font-medium text-[#194167]">Código:</span>
              <span className="ml-2 text-[#667085]">{equipo.code}</span>
            </div>
            <div className="text-xs sm:text-sm">
              <span className="font-medium text-[#194167]">Estado:</span>
              <span
                className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  equipo.isActive
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {equipo.isActive ? "Habilitado" : "Deshabilitado"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l lg:pl-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            <div className="mb-4">
              <h3 className="text-sm sm:text-base font-semibold text-[#194167] mb-1">
                Área
              </h3>
              <p className="text-xs sm:text-sm font-light text-[#667085] break-words">
                {getAreaName(equipo.mainAreaArea)}
              </p>
            </div>

            <div>
              <h3 className="text-sm sm:text-base font-semibold text-[#194167] mb-1">
                Supervisor
              </h3>
              <p className="text-xs sm:text-sm font-light text-[#667085] break-words">
                {equipo.supervisor?.fullName || "Sin supervisor asignado"}
              </p>
              {equipo.supervisor?.email && (
                <p className="text-xs text-[#667085] mt-1 break-words">
                  {equipo.supervisor.email}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}