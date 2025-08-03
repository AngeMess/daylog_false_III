import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./button-variants";

/**
 * Componente Button reutilizable con múltiples variantes
 * 
 * Este componente proporciona un botón flexible que puede renderizarse como
 * un elemento button nativo o como cualquier otro elemento usando la prop asChild.
 * Soporta múltiples variantes de estilo y tamaños definidos en button-variants.js.
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} [props.className=''] - Clases CSS adicionales
 * @param {string} [props.variant='default'] - Variante de estilo del botón
 * @param {string} [props.size='default'] - Tamaño del botón
 * @param {boolean} [props.asChild=false] - Si es true, renderiza como Slot (elemento hijo)
 * @param {React.Ref} ref - Referencia forwardRef
 * @returns {JSX.Element} El componente Button renderizado
 * 
 * @example
 * // Botón básico
 * <Button>Click me</Button>
 * 
 * // Botón con variante y tamaño
 * <Button variant="destructive" size="lg">
 *   Eliminar
 * </Button>
 * 
 * // Botón como enlace
 * <Button asChild>
 *   <a href="/dashboard">Ir al Dashboard</a>
 * </Button>
 */
const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button };
