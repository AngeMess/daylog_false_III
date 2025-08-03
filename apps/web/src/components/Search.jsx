import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Componente de campo de búsqueda reutilizable
 *
 * Este componente renderiza un input de búsqueda con estilos modernos y responsivos.
 * Puede usarse en formularios, barras de navegación o cualquier lugar donde se requiera
 * un campo de búsqueda. Permite personalizar el tipo de input y las clases CSS.
 *
 * @param {Object} props - Propiedades del componente
 * @param {string} [props.className=''] - Clases CSS adicionales
 * @param {string} [props.type='text'] - Tipo de input (por defecto 'text')
 * @param {React.Ref} ref - Referencia forwardRef para el input
 * @returns {JSX.Element} El componente SearchComponent renderizado
 *
 * @example
 * // Campo de búsqueda básico
 * <SearchComponent />
 *
 * // Campo de búsqueda con clases personalizadas
 * <SearchComponent className="mb-4" />
 *
 * // Campo de búsqueda tipo email
 * <SearchComponent type="email" />
 */
const SearchComponent = React.forwardRef(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn("!pl-10 !pr-4 !py-2 !rounded-full !border !border-gray-200 !focus:outline-none focus:border-[#01426A] !transition-all w-full md:!w-64", className)}
        ref={ref}
        {...props}
      />
    )
  }
)
SearchComponent.displayName = "SearchComponent"

export { SearchComponent }
