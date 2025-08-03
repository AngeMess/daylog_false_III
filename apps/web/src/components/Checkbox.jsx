/**
 * Componente Checkbox - Casilla de verificación personalizada
 * 
 * Este componente crea una casilla de verificación (checkbox) personalizada que
 * sigue el diseño corporativo de DayLog. Incluye estilos consistentes y
 * funcionalidad completa de accesibilidad.
 * 
 * Características:
 * - Colores corporativos (amarillo para checked, azul para focus)
 * - Estados visuales claros (checked, unchecked, disabled, focus)
 * - Transiciones suaves entre estados
 * - Accesibilidad completa con labels asociados
 * - Diseño responsivo y consistente
 * 
 * Props soportadas:
 * - id: Identificador único del checkbox
 * - checked: Estado de selección
 * - onChange: Función de callback para cambios
 * - disabled: Estado de deshabilitación
 * - label: Texto descriptivo del checkbox
 * - className: Clases CSS adicionales
 */

import React from "react";
import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef(({
  id,
  checked,
  onChange,
  disabled = false,
  label = "",
  className = "",
  ...props
}, ref) => {
  return (
    <div className={cn("!flex !items-center", className)}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={cn(
          "!cursor-pointer !w-4 !h-4 !mr-2 !accent-[#FFC600] !text-[#FFC600] !border-[#8D91A0] !rounded-full focus:ring-[#01426A] focus:ring-offset-0 !transition-all !duration-300",
          disabled && "!disabled:opacity-50"
        )}
        ref={ref}
        {...props}
      />
      <label htmlFor={id} className="!text-[#8D91A0] !text-base">
        <span className="flex items-center">{label}</span>
      </label>
    </div>
  );
});

Checkbox.displayName = "Checkbox";

export { Checkbox };