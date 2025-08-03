import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Componente de selector de formulario personalizado
 * 
 * Este componente proporciona un selector desplegable con diseño moderno que incluye
 * soporte para iconos, etiquetas flotantes y opciones dinámicas. Utiliza un diseño
 * material design con animaciones suaves y manejo de eventos de clic fuera del componente.
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.id - Identificador único del selector
 * @param {string} props.label - Etiqueta del campo
 * @param {string} props.value - Valor actualmente seleccionado
 * @param {Function} props.onChange - Función que se ejecuta cuando cambia la selección
 * @param {Array} [props.options=[]] - Array de opciones disponibles
 * @param {string} props.options[].value - Valor único de la opción
 * @param {string} props.options[].label - Texto visible de la opción
 * @param {React.Component} [props.icon] - Componente de icono de Lucide React
 * @param {string} [props.className=''] - Clases CSS adicionales
 * @param {number} [props.iconSize=20] - Tamaño del icono
 * @param {string} [props.iconPadding='pl-3.5'] - Padding del icono
 * @param {string} [props.inputPadding='pl-12'] - Padding del input
 * @param {string} [props.labelPadding='pl-12'] - Padding de la etiqueta
 * @param {boolean} [props.disabled=false] - Si el selector está deshabilitado
 * @returns {JSX.Element} El componente FormSelect renderizado
 * 
 * @example
 * // Selector básico con opciones
 * <FormSelect
 *   id="pais"
 *   label="País"
 *   value={paisSeleccionado}
 *   onChange={handlePaisChange}
 *   options={[
 *     { value: 'elsalvador', label: 'El Salvador' },
 *     { value: 'guatemala', label: 'Guatemala' },
 *     { value: 'honduras', label: 'Honduras' }
 *   ]}
 * />
 * 
 * // Selector con icono
 * <FormSelect
 *   id="area"
 *   label="Área de trabajo"
 *   value={areaSeleccionada}
 *   onChange={handleAreaChange}
 *   icon={BuildingIcon}
 *   options={areasOptions}
 * />
 * 
 * // Selector deshabilitado
 * <FormSelect
 *   id="rol"
 *   label="Rol"
 *   value={rolSeleccionado}
 *   onChange={handleRolChange}
 *   options={rolesOptions}
 *   disabled
 * />
 */
const FormSelect = ({
  id,
  label,
  value,
  onChange,
  options = [],
  icon: Icon,
  className = "",
  iconSize = 20,
  iconPadding = "pl-3.5",
  inputPadding = "pl-12",
  labelPadding = "pl-12",
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  /**
   * Cierra el dropdown cuando se hace clic fuera de él
   * Utiliza event listeners para detectar clics fuera del componente
   */
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /**
   * Maneja la selección de una opción del dropdown
   * @param {Object} option - Opción seleccionada
   */
  const handleSelect = (option) => {
    onChange({ target: { id, value: option.value, label: option.label } });
    setIsOpen(false);
  };

  /**
   * Encuentra la etiqueta actual para mostrar en el input
   */
  const currentLabel = value
    ? options.find(opt => opt.value === value)?.label || value
    : "";

  // Generar un ID único para el div que actuará como select
  const selectId = `select-${id}`;

  return (
    <div className={`relative w-full mb-6 group ${className}`}>
      <div
        id={selectId}
        ref={inputRef}
        className={`flex items-center ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} ${Icon ? inputPadding : 'pl-4'} rounded-lg py-2.5 px-0 w-full min-h-[48px] text-lg appearance-none
    ${disabled
      ? 'bg-transparent !shadow-none !border-0 !border-b-2 !border-[#d1d5db] !text-gray-400'
      : 'bg-transparent border-0 border-b-3 ' + (value ? 'text-[#01426A] border-[#01426A]' : 'text-[#8D91A0] border-[#8D91A0]') + ' hover:text-[#01426A] hover:border-[#01426A] focus:outline-none focus:ring-0 focus:border-[#194167]'}
    peer disabled:opacity-100`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-labelledby={`label-${id}`}
        style={{ backgroundColor: 'transparent' }}
      >
        {Icon && (
          <div className={`absolute left-0 top-1/2 -translate-y-1/2 ${iconPadding} z-20`}>
            <Icon
              size={iconSize}
              className={
                disabled
                  ? 'text-gray-400'
                  : (value ? 'text-[#01426A]' : 'text-[#8D91A0]') + ' group-hover:text-[#01426A] transition-all duration-300'
              }
            />
          </div>
        )}
        <div className="flex-1 min-w-0 overflow-hidden">
          <span className="block truncate text-ellipsis">
            {currentLabel}
          </span>
        </div>
        <ChevronDown
          size={20}
          className={`transition-transform ml-2 mr-1 flex-shrink-0 ${isOpen ? 'rotate-180' : ''} ${disabled ? 'text-gray-400' : value ? 'text-[#01426A]' : 'text-[#8D91A0]'}`}
        />
      </div>
      <label
        id={`label-${id}`}
        htmlFor={selectId}
        className={`${Icon ? labelPadding : 'pl-4'} peer-focus:font-medium font-medium absolute text-lg
    ${disabled ? '!text-gray-400' : value ? 'text-[#01426A]' : 'text-[#8D91A0]'}
    ${!disabled ? 'group-hover:text-[#01426A]' : ''} duration-300 transform -translate-y-6 scale-75 top-3 z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-[#01426A] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 transition-all max-w-[85%] whitespace-nowrap overflow-hidden text-ellipsis`}
      >
        {label}
      </label>
      {isOpen && !disabled && (
        <div
          ref={dropdownRef}
          className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 shadow-lg rounded-md z-50 max-h-40 overflow-auto w-full pointer-events-auto"
          style={{top: '100%'}}
        >
          {options.map((option) => (
            <div
              key={option.value}
              className={`p-3 cursor-pointer hover:bg-gray-100 text-sm sm:text-base ${option.value === value ? 'bg-gray-50 text-[#01426A] font-medium' : 'text-gray-700'}`}
              onClick={() => handleSelect(option)}
            >
              <span className="block truncate">
                {option.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FormSelect;
