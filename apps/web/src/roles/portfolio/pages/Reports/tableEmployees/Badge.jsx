import React from "react";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  CircleX,
} from "lucide-react";

// Estilos base para badges con colores corporativos
const getBaseStyles = (variant) => {
  const baseStyles = "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium";

  switch (variant) {                                                                                      
    case "elsalvador":
      return `${baseStyles} before:content-[''] before:block before:w-3 before:h-3 before:rounded-full before:bg-[#01426A] bg-[#e9f0f5] text-[#01426A]`;
    case "guatemala":
      return `${baseStyles} before:content-[''] before:block before:w-3 before:h-3 before:rounded-full before:bg-[#460B6B] bg-[#EBDFF5] text-[#5134A8]`;
    case "honduras":
      return `${baseStyles} before:content-[''] before:block before:w-3 before:h-3 before:rounded-full before:bg-[#A32620] bg-[#FFF2E0] text-[#E04B40] px-5`;
    case "gtprofile": // Guatemala profile badge
      return `flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium bg-[#2786cb] text-white`;
      // Note: Removed the before:content and using a more explicit approach with the dot in the component itself
    case "svprofile": // El Salvador profile badge
      return `${baseStyles} before:content-[''] before:block before:w-3 before:h-3 before:rounded-full before:bg-[#01426A] bg-[#2C85BC] text-white px-6`;
    case "hnprofile": // Honduras profile badge
      return `${baseStyles} before:content-[''] before:block before:w-3 before:h-3 before:rounded-full before:bg-[#A32620] bg-[#2C85BC] text-white px-6`;
    case "inhabilitado":
      return `${baseStyles} bg-[#B0B2B8] text-[#505050]`; 
    case "habilitado":
      return `${baseStyles} bg-[#DFF5E7] text-[#0B6B35] px-5`;
    default:
      return `${baseStyles} border-transparent bg-[#01426A] text-white hover:bg-[#01426A]/90`;
  }
};

function Badge({ className, variant = "default", ...props }) {
  return (
    <div className={cn(getBaseStyles(variant), className)} {...props} />
  );
}

export { Badge };
