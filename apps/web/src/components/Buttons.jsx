/**
 * Componente Button - Sistema de botones unificado
 * 
 * Este componente proporciona un sistema completo de botones con variantes predefinidas
 * que siguen el diseño corporativo de DayLog. Incluye diferentes estilos y tamaños.
 * 
 * Variantes disponibles:
 * - default: Botón primario azul corporativo
 * - btn_primary: Botón amarillo con hover inverso
 * - btn_g: Botón gris secundario
 * - btn_secondary: Botón outline azul
 * - btn_second_primary: Botón primario de ancho completo en móvil, ancho fijo en desktop
 * - btn_second_secondary: Botón secundario de ancho completo en móvil, ancho fijo en desktop
 * - btn_black: Botón negro con texto blanco
 * - btn_white: Botón blanco con texto negro y borde difuminado
 * 
 * Tamaños disponibles:
 * - default: Tamaño estándar
 * - sm: Tamaño pequeño
 * - lg: Tamaño grande
 * - icon: Tamaño para iconos
 * 
 * Características:
 * - Colores corporativos automáticos
 * - Estados hover y disabled
 * - Diseño responsivo
 * - Accesibilidad integrada
 */

import React from "react";
import { cn } from "@/lib/utils";

// Definición de estilos de botones con los colores corporativos
const buttonVariants = ({ variant, size, className }) => {
  // Estilos base comunes para todos los botones
  const baseStyles = "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50";
  
  // Variantes de estilo
  const variants = {
    // Botón azul corporativo principal
    default: "bg-[#01426A] text-white hover:bg-[#01426A]/90",
    
    // Botón amarillo con hover inverso
    btn_primary: "cursor-pointer add-button flex items-center gap-2 py-2 px-4 bg-[#FFC600] text-[#01426A] !font-medium rounded-full transition-all duration-300 border border-transparent hover:bg-[#FBFBFB] hover:text-[#FFC600] hover:border-[#FFC600] shadow-sm hover:shadow-md w-full sm:w-auto",
    
    // Botón gris secundario
    btn_g: "!add-button flex items-center gap-2 py-2 px-4 bg-[#F2F2F2] text-[#5A5A5A] font-medium rounded-full transition-all duration-300 border border-transparent hover:bg-[#CCCCCC] shadow-sm hover:shadow-md w-full sm:w-auto",
    
    // Botón outline azul
    btn_secondary: "!add-button flex items-center gap-2 py-2 px-4 bg-transparent border-2 border-[#2C85BC] text-[#2C85BC] font-medium rounded-full transition-all duration-300 hover:bg-[#2C85BC] hover:text-[#FFF] shadow-sm hover:shadow-md cursor-pointer w-full sm:w-auto",
    
    // Botón amarillo principal - ancho fijo en desktop, completo en móvil
    btn_second_primary: "cursor-pointer py-3 bg-[#FFC600] text-[#01426A] font-semibold rounded-sm transition-all duration-300 border border-transparent hover:bg-[#FBFBFB] hover:text-[#FFC600] hover:border-[#FFC600] shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed !w-full !md:w-auto !md:min-w-[180px] !md:max-w-[240px]",
    
    // Botón outline azul secundario - ancho fijo en desktop, completo en móvil
    btn_second_secondary: "cursor-pointer py-3 bg-transparent border-2 border-[#2C85BC] text-[#2C85BC] font-semibold rounded-sm transition-all duration-300 hover:bg-[#2C85BC] hover:text-[#FFF] shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed !w-full !md:w-auto !md:min-w-[180px] !md:max-w-[240px]",
    
    // Botón negro con texto blanco
    btn_black: "cursor-pointer py-3 bg-black text-white font-semibold rounded-full transition-all duration-300 border border-transparent hover:bg-white hover:text-black hover:border-black shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto md:min-w-[180px] md:max-w-[240px]",
    
    // Botón blanco con texto negro y bordes difuminados
    btn_white: "cursor-pointer py-3 bg-white text-black font-semibold rounded-full transition-all duration-300 border border-gray-200 hover:bg-gray-50 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto md:min-w-[180px] md:max-w-[240px]"
  };

  // Tamaños
  const sizes = {
    default: "h-11 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  };

  // Aplicar variante y tamaño por defecto si no se proporcionan
  const appliedVariant = variants[variant || "default"];
  const appliedSize = sizes[size || "default"];

  // Combinar estilos base, variante y tamaño
  return cn(baseStyles, appliedVariant, appliedSize, className);
};

const Button = React.forwardRef(({ className, variant, size, ...props }, ref) => {
  return (
    <button
      className={buttonVariants({ variant, size, className })}
      ref={ref}
      {...props}
    />
  );
});

Button.displayName = "Button";

export { Button, buttonVariants };