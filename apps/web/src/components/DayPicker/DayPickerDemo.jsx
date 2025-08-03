/**
 * Componente DayPickerDemo - Demostración del selector de fechas
 * 
 * Este componente sirve como demostración y ejemplo de uso del componente DayPicker.
 * Muestra cómo implementar el selector de fechas y manejar los cambios de fecha
 * seleccionada.
 * 
 * Funcionalidades de demostración:
 * - Implementación completa del DayPicker
 * - Manejo de estado de fecha seleccionada
 * - Visualización de la fecha seleccionada en formato legible
 * - Logging de cambios de fecha en consola
 * 
 * Características:
 * - Diseño de ejemplo con contenedor centrado
 * - Visualización clara de la fecha seleccionada
 * - Formato de fecha en español completo
 * - Estilos de demostración con fondo diferenciado
 * 
 * Uso:
 * - Componente de referencia para implementaciones
 * - Demostración de funcionalidades del DayPicker
 * - Ejemplo de manejo de estado y callbacks
 */

import React, { useState } from 'react';
import DayPicker from './DayPicker';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Componente de demostración para DayPicker
 */
const DayPickerDemo = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (date) => {
    setSelectedDate(date);
    console.log('Nueva fecha seleccionada:', format(date, 'dd/MM/yyyy', { locale: es }));
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Demo del Selector de Fechas</h2>
      
      <div className="mb-6">
        <DayPicker 
          initialDate={selectedDate}
          onDateChange={handleDateChange}
          showTodayButton={true}
        />
      </div>
      
      <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
        <h3 className="text-lg font-medium mb-2">Fecha seleccionada:</h3>
        <p className="text-blue-600 dark:text-blue-400 font-medium">
          {format(selectedDate, 'EEEE, dd \'de\' MMMM \'de\' yyyy', { locale: es })}
        </p>
      </div>
    </div>
  );
};

export default DayPickerDemo;
