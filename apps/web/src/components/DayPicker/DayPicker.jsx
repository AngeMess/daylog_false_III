/**
 * Componente DayPicker - Selector de fecha simple
 * 
 * Este componente proporciona un selector de fecha básico y funcional que permite
 * a los usuarios seleccionar fechas de manera intuitiva. Incluye navegación por
 * meses y funcionalidad de selección rápida del día actual.
 * 
 * Funcionalidades:
 * - Calendario interactivo con navegación por meses
 * - Selección de fecha individual
 * - Botón "Hoy" para selección rápida
 * - Formato de fecha en español
 * - Navegación por teclado
 * 
 * Características:
 * - Diseño limpio y minimalista
 * - Integración con date-fns para manejo de fechas
 * - Localización en español
 * - Estados visuales claros
 * - Accesibilidad integrada
 * 
 * Props soportadas:
 * - initialDate: Fecha inicial seleccionada (default: fecha actual)
 * - onDateChange: Callback cuando cambia la fecha seleccionada
 * - showTodayButton: Indica si mostrar el botón "Hoy" (default: true)
 * - className: Clases CSS adicionales
 */

import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Componente selector de fecha (DayPicker)
 * @param {object} props - Propiedades del componente
 * @param {Date} [props.initialDate] - Fecha inicial seleccionada (default: fecha actual)
 * @param {function} [props.onDateChange] - Función a ejecutar cuando cambia la fecha seleccionada
 * @param {boolean} [props.showTodayButton=true] - Indica si se muestra el botón "Hoy"
 * @param {string} [props.className] - Clases adicionales para el contenedor
 * @returns {JSX.Element} Componente DayPicker
 */
const DayPicker = ({
  initialDate,
  onDateChange,
  showTodayButton = true,
  className = '',
  ...props
}) => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(initialDate || today);
  const [currentMonth, setCurrentMonth] = useState(selectedDate);

  // Manejar cambio de fecha seleccionada
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    if (onDateChange && typeof onDateChange === 'function') {
      onDateChange(date);
    }
  };

  // Ir al día actual
  const goToToday = () => {
    setSelectedDate(today);
    setCurrentMonth(today);
    if (onDateChange && typeof onDateChange === 'function') {
      onDateChange(today);
    }
  };

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-2 bg-white dark:bg-gray-800">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          month={currentMonth}
          onMonthChange={setCurrentMonth}
          locale={es} // Configuración en español
          {...props}
        />
        
        {showTodayButton && (
          <Button
            variant="outline"
            size="sm"
            className="my-1 w-full"
            onClick={goToToday}
          >
            Hoy
          </Button>
        )}
      </div>
      
      {selectedDate && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Fecha seleccionada: <span className="font-medium">{format(selectedDate, 'dd/MM/yyyy', { locale: es })}</span>
        </p>
      )}
    </div>
  );
};

export default DayPicker;
