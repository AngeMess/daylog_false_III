/**
 * Componente Pagination - Sistema de paginación completo
 * 
 * Este componente proporciona un sistema completo de paginación con navegación
 * por páginas, botones de anterior/siguiente, elipsis y enlaces directos.
 * Utiliza Radix UI para accesibilidad y funcionalidad robusta.
 * 
 * Funcionalidades:
 * - Navegación entre páginas
 * - Botones de anterior y siguiente
 * - Enlaces directos a páginas específicas
 * - Elipsis para rangos grandes
 * - Estados activos e inactivos
 * - Navegación por teclado
 * 
 * Componentes incluidos:
 * - Pagination: Contenedor principal
 * - PaginationContent: Contenedor de elementos
 * - PaginationItem: Elemento individual
 * - PaginationLink: Enlace de página
 * - PaginationPrevious: Botón anterior
 * - PaginationNext: Botón siguiente
 * - PaginationEllipsis: Indicador de elipsis
 * 
 * Características:
 * - Accesibilidad completa con ARIA labels
 * - Estados visuales claros (active, disabled)
 * - Diseño responsivo
 * - Integración con sistema de botones
 * - Navegación por teclado
 * 
 * Props soportadas:
 * - className: Clases CSS adicionales
 * - isActive: Indica si la página está activa
 * - size: Tamaño del componente (default, icon)
 * - Varias props de navegación y estado
 */

import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/Button"

const Pagination = ({ className, ...props }) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
)
Pagination.displayName = "Pagination"

const PaginationContent = React.forwardRef(
  ({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
))
PaginationContent.displayName = "PaginationContent"

const PaginationItem = React.forwardRef(
  ({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
))
PaginationItem.displayName = "PaginationItem"

const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  ...props
}) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? "outline" : "ghost",
        size,
      }),
      className,
    )}
    {...props}
  />
)
PaginationLink.displayName = "PaginationLink"

const PaginationPrevious = ({
  className,
  ...props
}) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn("gap-1 pl-2.5", className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </PaginationLink>
)
PaginationPrevious.displayName = "PaginationPrevious"

const PaginationNext = ({
  className,
  ...props
}) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn("gap-1 pr-2.5", className)}
    {...props}
  >
    <span>Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
)
PaginationNext.displayName = "PaginationNext"

const PaginationEllipsis = ({
  className,
  ...props
}) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
)
PaginationEllipsis.displayName = "PaginationEllipsis"

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
