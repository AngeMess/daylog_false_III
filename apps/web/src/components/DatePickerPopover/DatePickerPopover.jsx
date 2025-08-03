/**
 * Componente DatePickerPopover - Selector de fecha con popover
 * 
 * Este componente proporciona un selector de fecha avanzado que se abre en un popover.
 * Incluye funcionalidades de calendario interactivo, validación de fechas y
 * diseño responsivo con animaciones suaves.
 * 
 * Funcionalidades:
 * - Calendario interactivo con navegación por meses
 * - Selección de fecha con formato dd/MM/yyyy
 * - Botón "Hoy" para selección rápida
 * - Validación de fechas de entrada
 * - Cierre automático al hacer clic fuera
 * - Formato de fecha en español
 * 
 * Características:
 * - Diseño responsivo con breakpoints específicos
 * - Animaciones fluidas con Framer Motion
 * - Estados visuales claros (focus, hover, disabled)
 * - Accesibilidad completa con navegación por teclado
 * - Manejo de fechas inválidas
 * - Estilos corporativos consistentes
 * 
 * Props soportadas:
 * - id: Identificador único del campo
 * - label: Etiqueta descriptiva
 * - value: Valor de fecha actual
 * - onChange: Callback para cambios de fecha
 * - required: Indica si el campo es obligatorio
 * - error: Mensaje de error a mostrar
 * - disabled: Estado de deshabilitación
 */

import React, { useState, useEffect, useRef } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { CalendarDays } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
//eslint-disable-next-line
import { motion, AnimatePresence } from 'framer-motion';

const DatePickerPopover = ({
  id,
  label,
  value,
  onChange,
  required = false,
  error,
  className = '',
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState(null);
  const popoverRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (value) {
      try {
        if (typeof value === 'string') {
          const fecha = new Date(value.includes('T') ? value : `${value}T12:00:00`);
          if (!isNaN(fecha.getTime())) {
            setDate(fecha);
          } else {
            console.error('Fecha inválida:', value);
          }
        } else if (value instanceof Date && !isNaN(value.getTime())) {
          setDate(value);
        }
      } catch (error) {
        console.error('Error al inicializar fecha:', error);
      }
    } else {
      setDate(null);
    }
  }, [value]);

  const formattedDate = date ? format(date, 'dd/MM/yyyy', { locale: es }) : '';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target) &&
        inputRef.current && !inputRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDateSelect = (newDate) => {
    setDate(newDate);

    if (newDate) {
      const year = newDate.getFullYear();
      const month = String(newDate.getMonth() + 1).padStart(2, '0');
      const day = String(newDate.getDate()).padStart(2, '0');
      const formattedValue = `${year}-${month}-${day}`;

      if (onChange) {
        onChange(formattedValue);
      }
    } else if (onChange) {
      onChange('');
    }

    setTimeout(() => setIsOpen(false), 300);
  };

  const handleTodayClick = () => {
    const today = new Date();
    setDate(today);

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedValue = `${year}-${month}-${day}`;

    if (onChange) {
      onChange(formattedValue);
    }

    setTimeout(() => setIsOpen(false), 300);
  };

  return (
    <div className={`relative w-full mb-6 group ${className}`}>
      {/* --- ESTILO EN LÍNEA PARA CENTRAR EL LABEL DEL MES EN MÓVIL --- */}
      <style>{`
        .rdp-caption,
        div.rdp-caption,
        div.rdp-caption.mx-10,
        div.rdp-caption.mx-10.mb-1.flex.h-9.items-center.justify-center.z-20 {
          display: grid !important;
          grid-template-columns: auto 1fr auto !important;
          align-items: center !important;
          width: 100% !important;
          min-width: 0 !important;
          box-sizing: border-box !important;
        }
        .rdp-caption_label {
          grid-column: 2 !important;
          justify-content: center !important;
          text-align: center !important;
          display: flex !important;
          width: 100% !important;
        }
        .rdp-nav_button_previous {
          grid-column: 1 !important;
          justify-self: start !important;
        }
        .rdp-nav_button_next {
          grid-column: 3 !important;
          justify-self: end !important;
        }
        .rdp-months,
        .rdp-month {
          max-width: 310px !important;
          width: 100% !important;
          margin: 0 auto !important;
          min-width: 0 !important;
          box-sizing: border-box !important;
        }
        @media (max-width: 1024px) {
          .rdp-months,
          .rdp-month,
          .rdp-caption,
          .rdp-caption_label {
            width: 100% !important;
            min-width: 0 !important;
            box-sizing: border-box !important;
          }
        }
      `}</style>
      <div className="flex items-center">
        <div ref={inputRef} className="relative w-full">
          <div
            className={`absolute left-0 top-1/2 -translate-y-1/2 pl-2.5 z-20 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            onClick={() => !disabled && setIsOpen(!isOpen)}
          >
            <CalendarDays
              size={20}
              className={`${disabled ? 'text-gray-400' : formattedDate ? 'text-[#01426A]' : 'text-[#8D91A0]'} ${!disabled ? 'group-hover:text-[#01426A]' : ''} transition-all duration-300`}
            />
          </div>
          <input
            type="text"
            id={id}
            name={id}
            value={formattedDate}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            readOnly
            disabled={disabled}
            className={`pl-10 rounded-lg block py-2.5 px-0 w-full text-lg bg-transparent border-0 border-b-3 appearance-none ${
              disabled 
                ? 'text-gray-400 border-gray-300 cursor-not-allowed' 
                : formattedDate ? 'text-[#01426A] border-[#01426A]' : 'text-[#8D91A0] border-[#8D91A0]'
            } ${!disabled ? 'hover:text-[#01426A] hover:border-[#01426A] cursor-pointer' : ''} transition-all duration-300 ease-in-out focus:outline-none focus:ring-0 focus:border-[#194167]`}
            placeholder=" "
            required={required}
          />
          <label
            htmlFor={id}
            className={`pl-10 peer-focus:font-medium font-medium absolute text-lg ${disabled ? 'text-gray-400' : formattedDate ? 'text-[#01426A]' : 'text-[#8D91A0]'} ${!disabled ? 'group-hover:text-[#01426A]' : ''} duration-300 transform -translate-y-6 scale-75 top-3 z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-[#01426A] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 transition-all`}
          >
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        </div>
      </div>

      {/* Calendario desplegable con animación */}
      <AnimatePresence>
        {isOpen && !disabled && (
          <motion.div
            ref={popoverRef}
            className={
              `z-[9999] mt-1 bg-white rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 dark:bg-gray-800 flex flex-col items-center
              ${typeof window !== 'undefined' && window.innerWidth <= 1024 ? 'static w-full relative' : 'absolute left-0 right-0'}
              `
            }
            style={
              typeof window !== 'undefined' && window.innerWidth <= 1024
                ? {
                    maxWidth: '100%',
                    width: '100%',
                    position: 'static',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    transformOrigin: 'center top',
                  }
                : {
                    maxWidth: '310px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    transformOrigin: 'center top',
                  }
            }
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              locale={es}
              className="z-30 mx-auto"
              initialFocus
            />

            <div className="flex justify-center w-full mt-2">
              <button
                type="button"
                onClick={handleTodayClick}
                className="bg-[#FFC600] text-[#01426A] font-medium text-sm rounded-full px-4 py-2 hover:bg-[#01426A] hover:text-white transition-colors"
              >
                Hoy
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mensaje de error */}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default DatePickerPopover;

