/**
 * Componente TeamCard - Tarjeta de equipo de trabajo
 * 
 * Este componente muestra la información de un equipo de trabajo en formato de tarjeta.
 * Incluye detalles como nombre del equipo, supervisor, tipo de equipo, área y número de miembros.
 * 
 * Información mostrada:
 * - Nombre del equipo y estado (habilitado/deshabilitado)
 * - Supervisor asignado con icono
 * - Tipo de equipo (Desarrollo Web, Móvil, etc.)
 * - Área a la que pertenece (solo en desktop)
 * - Número de miembros del equipo
 * - Código del equipo
 * 
 * Características:
 * - Diseño responsivo con información adaptativa
 * - Estados visuales para equipos activos/inactivos
 * - Hover effects y transiciones suaves
 * - Información condicional según tamaño de pantalla
 * - Iconos descriptivos para cada sección
 */

// components/ui/TeamCard.jsx
import React from 'react';

export default function TeamCard({ equipo, areaName, onClick }) {
  const numeroMiembros = equipo.employees ? equipo.employees.length : 0;

  return (
    <div
      className="equipo-card bg-white rounded-xl shadow-sm p-4 sm:p-5 border hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
      onClick={onClick}
    >
      {/* Header con nombre del equipo y estado */}
      <div className="flex justify-between items-start mb-4">
        <h2 className="equipo-titulo text-blue-900 font-semibold text-base sm:text-lg leading-tight flex-1">
          {equipo.name}
        </h2>
        <div className="flex gap-2 ml-2">
          {/* Indicador de estado activo/inactivo */}
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${equipo.isActive
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
            }`}>
            {equipo.isActive ? 'Habilitado' : 'Deshabilitado'}
          </span>
        </div>
      </div>

      {/* Información del supervisor */}
      <div className="equipo-info-container flex items-center mb-3 text-sm text-gray-600">
        <div className="w-5 h-5 mr-3 flex items-center justify-center">
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
        <div>
          <div className="text-xs text-gray-500 font-medium">Supervisor</div>
          <div className="font-medium text-gray-900">
            {equipo.supervisor?.fullName || 'Sin asignar'}
          </div>
        </div>
      </div>

      {/* Información del tipo de equipo */}
      <div className="equipo-info-container flex items-center mb-3 text-sm text-gray-600">
        <div className="w-5 h-5 mr-3 flex items-center justify-center">
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </div>
        <div>
          <div className="text-xs text-gray-500 font-medium">Tipo</div>
          <div className="font-medium text-gray-900">{equipo.teamType}</div>
        </div>
      </div>

      {/* Información del área */}
      <div className="equipo-info-container hidden md:flex items-center mb-4 text-sm text-gray-600">
        <div className="w-5 h-5 mr-3 flex items-center justify-center">
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
            <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
            <polyline points="2 17 12 22 22 17"></polyline>
            <polyline points="2 12 12 17 22 12"></polyline>
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-gray-500 font-medium">Área</div>
          <div className="font-medium text-gray-900 text-xs leading-tight truncate">{areaName}</div>
        </div>
      </div>

      {/* Línea separadora y miembros */}
      <div className="border-t border-gray-100 pt-4">
        <div className="flex justify-between items-center">
          {/* Info para pantallas grandes */}
          <div className="hidden md:block">
            <div className="text-xs text-gray-500 font-medium">Miembros del equipo</div>
            <div className="text-lg font-bold text-blue-900">{numeroMiembros}</div>
          </div>

          {/* Info para móviles */}
          <div className="md:hidden w-full flex justify-between items-center">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{numeroMiembros}</span> miembros
            </div>
            <div className="text-xs text-gray-400">
              {equipo.code}
            </div>
          </div>

          {/* Código del equipo en desktop */}
          <div className="hidden md:block text-xs text-gray-400">
            Código: {equipo.code}
          </div>
        </div>
      </div>
    </div>
  );
}