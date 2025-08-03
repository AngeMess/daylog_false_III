/**
 * Componente FormInputPassword - Campo de entrada de contraseña
 * 
 * Este componente crea un campo de entrada especializado para contraseñas con
 * funcionalidad de mostrar/ocultar la contraseña. Incluye iconos, validación
 * y estilos consistentes con el sistema de diseño corporativo.
 * 
 * Funcionalidades:
 * - Campo de contraseña con toggle de visibilidad
 * - Icono de candado por defecto (personalizable)
 * - Estados visuales claros (focus, hover, filled)
 * - Validación de campos requeridos
 * - Accesibilidad completa
 * 
 * Características:
 * - Diseño responsivo y consistente
 * - Colores corporativos automáticos
 * - Transiciones suaves entre estados
 * - Manejo de estados disabled y readonly
 * - Label flotante animado
 * 
 * Props soportadas:
 * - id: Identificador único del campo
 * - label: Etiqueta descriptiva
 * - value: Valor actual del campo
 * - onChange: Callback para cambios
 * - icon: Icono personalizable (default: Lock)
 * - required: Indica si el campo es obligatorio
 * - readOnly: Estado de solo lectura
 * - className: Clases CSS adicionales
 * - placeholder: Texto de placeholder
 */

import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

const FormInputPassword = ({ 
  id, 
  label, 
  value, 
  onChange, 
  icon: Icon = Lock, 
  required = false,
  readOnly = false,
  className = "",
  placeholder = " "
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`relative w-full mb-6 group ${className}`}>
      <div className="flex items-center">
        {Icon && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 pl-2.5">
            <Icon size={20} className={`${value ? 'text-[#01426A]' : 'text-[#8D91A0]'} group-hover:text-[#01426A] transition-all duration-300`} />
          </div>
        )}
        <input
          type={showPassword ? "text" : "password"}
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          className={`${Icon ? 'pl-10' : 'pl-3'} rounded-lg block py-2.5 px-0 w-full text-lg bg-transparent border-0 border-b-3 appearance-none ${value ? 'text-[#01426A] border-[#01426A]' : 'text-[#8D91A0] border-[#8D91A0]'} hover:text-[#01426A] hover:border-[#01426A] transition-all duration-300 ease-in-out focus:outline-none focus:ring-0 focus:border-[#194167] peer`}
          placeholder={placeholder}
          required={required}
        />
        <button 
          type="button" 
          onClick={() => setShowPassword(!showPassword)} 
          className="absolute right-2 top-1/2 -translate-y-1/2"
        >
          {showPassword ? 
            <EyeOff size={20} className={`${value ? 'text-[#01426A]' : 'text-[#8D91A0]'} group-hover:text-[#01426A] transition-all duration-300`} /> : 
            <Eye size={20} className={`${value ? 'text-[#01426A]' : 'text-[#8D91A0]'} group-hover:text-[#01426A] transition-all duration-300`} />}
        </button>
        <label
          htmlFor={id}
          className={`${Icon ? 'pl-10' : 'pl-3'} peer-focus:font-medium font-medium absolute text-lg ${value ? 'text-[#01426A]' : 'text-[#8D91A0]'} group-hover:text-[#01426A] duration-300 transform -translate-y-6 scale-75 top-3 z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-[#01426A] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 transition-all`}
        >
          {label}
        </label>
      </div>
    </div>
  );
};

export default FormInputPassword;