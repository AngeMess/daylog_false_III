/**
 * Componente Badge - Etiquetas de estado y categorización
 * 
 * Este componente crea etiquetas visuales (badges) para mostrar estados, países o categorías.
 * Utiliza los colores corporativos de DayLog y soporta diferentes variantes predefinidas.
 * 
 * Variantes disponibles:
 * - elsalvador: Badge para El Salvador con color azul corporativo
 * - guatemala: Badge para Guatemala con color morado
 * - honduras: Badge para Honduras con color rojo
 * - habilitado/inhabilitado: Estados de activación con iconos
 * - default: Badge genérico azul corporativo
 * 
 * Características:
 * - Colores corporativos automáticos según variante
 * - Iconos opcionales para cada variante
 * - Diseño responsivo y accesible
 * - Estilos consistentes con el sistema de diseño
 */

import React from "react";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  CircleX
} from "lucide-react";

// Estilos base para badges con colores corporativos
const getBaseStyles = (variant) => {
  const baseStyles = "!inline-flex !items-center !gap-2 !rounded-full !px-4 !py-2 !text-sm !font-medium";

  switch (variant) {                                                                                      
    case "elsalvador":
      return `${baseStyles} before:content-[''] before:!block before:!w-3 before:!h-3 before:!rounded-full before:!bg-[#01426A] !bg-[#e9f0f5] !text-[#01426A]`;
    case "guatemala":
      return `${baseStyles} before:content-[''] before:!block before:!w-3 before:!h-3 before:!rounded-full before:!bg-[#460B6B] !bg-[#EBDFF5] !text-[#5134A8]`;
    case "honduras":
      return `${baseStyles} before:content-[''] before:!block before:!w-3 before:!h-3 before:!rounded-full before:!bg-[#A32620] !bg-[#FFF2E0] !text-[#E04B40] !px-5`;
    case "inhabilitado":
      return `${baseStyles} !bg-[#B0B2B8] !text-[#505050]`; 
    case "habilitado":
      return `${baseStyles} !bg-[#DFF5E7] !text-[#0B6B35] !px-5`;
    default:
      return `${baseStyles} !border-transparent !bg-[#01426A] !text-white hover:bg-[#01426A]/90`;
  }
};

function Badge({ className, variant = "default", icon: Icon, children, ...props }) {
  const defaultIcons = {
    habilitado: <CheckCircle2 size={14} className="mr-1" />,
    inhabilitado: <CircleX size={14} className="mr-1" />,
    elsalvador: null,
    guatemala: null,
    honduras: null
  };

  const iconToShow = Icon || defaultIcons[variant];

  return (
    <div className={cn(getBaseStyles(variant), className, "flex items-center")} {...props}>
      {iconToShow && <span className="flex-shrink-0">{iconToShow}</span>}
      {children}
    </div>
  );
}

export { Badge };