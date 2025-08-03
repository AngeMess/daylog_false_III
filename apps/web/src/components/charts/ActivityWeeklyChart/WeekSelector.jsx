/**
 * Componente WeekSelector - Selector de período para gráficos
 * 
 * Este componente proporciona una interfaz para seleccionar diferentes períodos
 * de tiempo en los gráficos de actividades. Permite cambiar entre vista semanal,
 * anterior y mensual de manera intuitiva.
 * 
 * Opciones disponibles:
 * - Esta semana: Muestra datos de la semana actual
 * - Semana anterior: Muestra datos de la semana pasada
 * - Este mes: Muestra datos del mes actual
 * 
 * Características:
 * - Diseño responsivo que se adapta a móviles y desktop
 * - Estados visuales claros para la opción seleccionada
 * - Transiciones suaves entre estados
 * - Colores corporativos consistentes
 * - Layout flexible según el espacio disponible
 * - Accesibilidad integrada con navegación por teclado
 */

import React from 'react';

const WeekSelector = ({ selectedPeriod, setSelectedPeriod, isMobile = false }) => {
  const options = [
    { id: 'thisWeek', label: 'Esta semana' },
    { id: 'lastWeek', label: 'Semana anterior' },
    { id: 'month', label: 'Este mes' }
  ];

  return (
    <div className={`flex ${isMobile ? 'flex-row space-x-2' : 'items-center'}`}>
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => setSelectedPeriod(option.id)}
          className={`px-3 py-1.5 text-sm rounded-full transition-all duration-200 ${
            selectedPeriod === option.id
              ? 'bg-[#01426A] text-white font-medium'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default WeekSelector;
