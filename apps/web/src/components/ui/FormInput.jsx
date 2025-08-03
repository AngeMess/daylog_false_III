import React, { useState } from 'react';

/**
 * Componente de campo de entrada de formulario personalizado
 * 
 * Este componente proporciona un campo de entrada con diseño moderno que incluye
 * soporte para iconos, etiquetas flotantes, validación y diferentes tipos de entrada.
 * Utiliza un diseño material design con animaciones suaves y estados visuales claros.
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.id - Identificador único del campo
 * @param {string} [props.type='text'] - Tipo de entrada HTML (text, email, password, etc.)
 * @param {string} props.label - Etiqueta del campo
 * @param {string} props.value - Valor actual del campo
 * @param {Function} props.onChange - Función que se ejecuta cuando cambia el valor
 * @param {React.Component} [props.icon] - Componente de icono de Lucide React
 * @param {boolean} [props.required=false] - Si el campo es obligatorio
 * @param {boolean} [props.readOnly=false] - Si el campo es de solo lectura
 * @param {string} [props.className=''] - Clases CSS adicionales
 * @param {string} [props.placeholder=' '] - Texto de placeholder
 * @param {React.ReactNode} [props.rightComponent] - Componente adicional a la derecha
 * @param {boolean} [props.disabled=false] - Si el campo está deshabilitado
 * @param {Function} [props.onKeyPress] - Función para manejar eventos de teclado
 * @param {string} [props.autoComplete] - Valor de autocompletado
 * @param {number} [props.iconSize=20] - Tamaño del icono
 * @param {string} [props.iconPadding='pl-3.5'] - Padding del icono
 * @param {string} [props.inputPadding='pl-12'] - Padding del input
 * @param {string} [props.labelPadding='pl-12'] - Padding de la etiqueta
 * @param {string} [props.labelZIndex='z-10'] - Z-index de la etiqueta
 * @param {number} [props.maxLength] - Longitud máxima del texto
 * @param {boolean} [props.numbersOnly=false] - Si solo permite números
 * @returns {JSX.Element} El componente FormInput renderizado
 * 
 * @example
 * // Campo de texto básico
 * <FormInput
 *   id="nombre"
 *   label="Nombre completo"
 *   value={nombre}
 *   onChange={(e) => setNombre(e.target.value)}
 *   required
 * />
 * 
 * // Campo con icono y validación de números
 * <FormInput
 *   id="telefono"
 *   label="Teléfono"
 *   value={telefono}
 *   onChange={handleTelefonoChange}
 *   icon={PhoneIcon}
 *   numbersOnly
 *   maxLength={10}
 * />
 * 
 * // Campo deshabilitado
 * <FormInput
 *   id="email"
 *   label="Correo electrónico"
 *   value={email}
 *   onChange={handleEmailChange}
 *   icon={MailIcon}
 *   disabled
 * />
 */
const FormInput = ({ 
  id, 
  type = "text", 
  label, 
  value, 
  onChange, 
  icon: Icon, 
  required = false,
  readOnly = false,
  className = "",
  placeholder = " ",
  rightComponent = null,
  disabled = false,
  onKeyPress,
  autoComplete,
  iconSize = 20,
  iconPadding = "pl-3.5",
  inputPadding = "pl-12",
  labelPadding = "pl-12",
  labelZIndex = "z-10",
  maxLength,
  numbersOnly = false
}) => {
  /**
   * Maneja el cambio de valor del input con validación opcional de números
   * @param {Event} e - Evento del input
   */
  const handleChange = (e) => {
    if (numbersOnly) {
      const numericValue = e.target.value.replace(/[^0-9]/g, '');
      // Creamos un nuevo evento con el valor filtrado
      const newEvent = {
        ...e,
        target: {
          ...e.target,
          value: numericValue
        }
      };
      onChange(newEvent);
    } else {
      onChange(e);
    }
  };
  
  // Estado para controlar el foco del input
  const [isFocused, setIsFocused] = useState(false);

  /**
   * Maneja el evento de foco del input
   */
  const handleFocus = () => setIsFocused(true);
  
  /**
   * Maneja el evento de pérdida de foco del input
   */
  const handleBlur = () => setIsFocused(false);
  
  return (
    <div className={`relative w-full mb-6 group ${className} ${disabled ? '!bg-transparent' : ''}`}>
      <div className="flex items-center w-full">
        {Icon && (
          <div className={`absolute left-0 top-1/2 -translate-y-1/2 ${iconPadding} z-20`}>
            <Icon 
              size={iconSize} 
              className={
                disabled
                  ? 'text-gray-400'
                  : (value || isFocused ? 'text-[#01426A]' : 'text-[#8D91A0]') + ' group-hover:text-[#01426A] transition-all duration-300'
              }
            />
          </div>
        )}
        <input
          onFocus={handleFocus}
          onBlur={handleBlur}
          type={type}
          id={id}
          name={id}
          value={value}
          onChange={handleChange}
          onKeyPress={onKeyPress}
          readOnly={readOnly}
          disabled={disabled}
          maxLength={maxLength}
          className={
            `${Icon ? inputPadding : 'pl-4'} rounded-lg block py-2.5 px-0 w-full min-h-[48px] text-lg appearance-none border-0 border-b-3
            ${disabled
              ? '!bg-transparent !shadow-none !border-0 !border-b-2 !border-[#d1d5db] !text-gray-400 cursor-not-allowed'
              : 'bg-transparent border-b-3 ' + (value ? 'text-[#01426A] border-[#01426A]' : 'text-[#8D91A0] border-[#8D91A0]') + ' hover:text-[#01426A] hover:border-[#01426A] focus:outline-none focus:ring-0 focus:border-[#194167]'}
            peer disabled:opacity-100`
          }
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          style={{
            wordWrap: "break-word",
            overflowWrap: "break-word"
          }}
          onAnimationStart={(e) => {
            if (e.animationName.startsWith('onAutoFill')) {
              e.target.classList.add('has-autofill');
            }
          }}
        />
        {rightComponent}
        <label
          htmlFor={id}
          className={
            `${Icon ? labelPadding : 'pl-4'} peer-focus:font-medium font-medium absolute text-lg
            ${disabled ? '!text-gray-400' : (value || isFocused) ? 'text-[#01426A]' : 'text-[#8D91A0]'}
            group-hover:text-[#01426A] duration-300 transform -translate-y-6 scale-75 top-3 z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-[#01426A] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 transition-all max-w-[85%] whitespace-nowrap overflow-hidden text-ellipsis`
          }
        >
          {label}
        </label>
      </div>
    </div>
  );
};

export default FormInput;
