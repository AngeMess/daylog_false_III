import React from "react";
import { ArrowRightIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/**
 * Componente de grid Bento para organizar tarjetas informativas
 * 
 * Este componente crea un grid responsive que organiza las tarjetas Bento
 * en un layout flexible que se adapta a diferentes tamaños de pantalla.
 * Utiliza CSS Grid para crear un diseño moderno y organizado.
 * 
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Elementos hijos (tarjetas Bento)
 * @param {string} [props.className=''] - Clases CSS adicionales para personalizar el grid
 * @returns {JSX.Element} El grid Bento renderizado
 * 
 * @example
 * <BentoGrid className="my-8">
 *   <BentoCard name="Tarjeta 1" description="Descripción" />
 *   <BentoCard name="Tarjeta 2" description="Descripción" />
 * </BentoGrid>
 */
const BentoGrid = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[22rem] grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
        className,
      )}
    >
      {children}
    </div>
  );
};

/**
 * Componente de tarjeta Bento individual
 * 
 * Este componente crea una tarjeta informativa con diseño moderno que incluye
 * un icono, título, descripción y opcionalmente un enlace con call-to-action.
 * Las tarjetas tienen efectos hover y animaciones suaves para mejorar la UX.
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.name - Título de la tarjeta
 * @param {string} [props.className=''] - Clases CSS adicionales
 * @param {JSX.Element} [props.background] - Elemento de fondo de la tarjeta
 * @param {React.Component} props.Icon - Componente de icono de Lucide React
 * @param {string} props.description - Descripción de la tarjeta
 * @param {string} [props.href] - Enlace opcional para la tarjeta
 * @param {string} [props.cta] - Texto del call-to-action
 * @returns {JSX.Element} La tarjeta Bento renderizada
 * 
 * @example
 * <BentoCard
 *   name="Gestión de Proyectos"
 *   description="Administra y supervisa todos los proyectos activos"
 *   Icon={FolderIcon}
 *   href="/projects"
 *   cta="Ver proyectos"
 * />
 */
const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
}) => (
  <div
    key={name}
    className={cn(
      "group relative col-span-1 flex flex-col justify-between overflow-hidden rounded-xl",
      // light styles
      "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
      // dark styles
      "transform-gpu dark:bg-black dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
      className,
    )}
  >
    <div>{background}</div>
    <div className="pointer-events-none z-10 flex transform-gpu flex-col gap-1 p-6 transition-all duration-300 group-hover:-translate-y-10">
      <Icon className="h-12 w-12 origin-left transform-gpu text-neutral-700 transition-all duration-300 ease-in-out group-hover:scale-75" />
      <h3 className="text-xl font-semibold text-neutral-700 dark:text-neutral-300">
        {name}
      </h3>
      <p className="max-w-lg text-neutral-400">{description}</p>
    </div>

    <div
      className={cn(
        "pointer-events-none absolute bottom-0 flex w-full translate-y-10 transform-gpu flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100",
      )}
    >
      <Button variant="ghost" asChild size="sm" className="pointer-events-auto">
        <a href={href}>
          {cta}
          <ArrowRightIcon className="ml-2 h-4 w-4" />
        </a>
      </Button>
    </div>
    <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-black/[.03] group-hover:dark:bg-neutral-800/10" />
  </div>
);

export { BentoCard, BentoGrid };
