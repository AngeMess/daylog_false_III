import React from "react";
import { cn } from "@/lib/utils";

// Definición de estilos de botones con los colores corporativos
const buttonVariants = ({ variant, size, className }) => {
  // Estilos base comunes para todos los botones
  const baseStyles = "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50";
  
  // Variantes de estilo
  const variants = {
    default: "bg-[#01426A] text-white hover:bg-[#01426A]/90",
    btn_primary: "add-button flex items-center gap-2 py-2 px-4 bg-[#FFC600] text-[#01426A] font-medium rounded-full transition-all duration-300 border border-transparent hover:bg-[#FBFBFB] hover:text-[#FFC600] hover:border-[#FFC600] shadow-sm hover:shadow-md",
    btn_g: "add-button flex items-center gap-2 py-2 px-4 bg-[#F2F2F2] text-[#5A5A5A] font-medium rounded-md transition-all duration-300 border border-transparent hover:bg-[#CCCCCC] shadow-sm hover:shadow-md",
    btn_back_1: "!add-button !flex !items-center !gap-2 !py-2 !px-4 !bg-transparent !border-2 !border-[#2C85BC] !text-[#2C85BC] !font-medium !rounded-full !transition-all !duration-300 hover:!bg-[#2C85BC] hover:!text-[#FFF] !shadow-sm hover:!shadow-md !cursor-pointer",

  };
  
  // Tamaños
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  };
  
  // Aplicar variante y tamaño por defecto si no se proporcionan
  const appliedVariant = variants[variant || "default"];
  const appliedSize = sizes[size || "default"];
  
  return cn(baseStyles, appliedVariant, appliedSize, className);
};

const Button = React.forwardRef(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={buttonVariants({ variant, size, className })}
        ref={ref}
        {...props}
      />
    )
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
