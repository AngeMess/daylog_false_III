import React from 'react';
import { User, Award, Layers, BarChart3 } from 'lucide-react';
import { cn } from "@/lib/utils";

import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";

/**
 * Configuración de características para el dashboard de DayLog
 * Define las tarjetas que se mostrarán en el dashboard con sus propiedades
 * y estilos personalizados usando una escala de grises e imágenes de fondo.
 */
const features = [
  {
    Icon: User,
    name: "Usuarios Totales",
    description: "Visualiza y gestiona todos los usuarios activos en la plataforma.",
    href: "",
    background: (
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 opacity-60"></div>
        <div className="absolute right-0 bottom-0 w-32 h-32 transform translate-x-1/3 translate-y-1/4 opacity-10 group-hover:opacity-15 transition-all duration-300">
          <svg className="w-full h-full text-[#01426A]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
          </svg>
        </div>
      </div>
    ),
    className: "lg:col-span-1 lg:row-span-1",
    value: "1123",
    order: 1
  },
  {
    Icon: Award,
    name: "Mayor Rendimiento",
    description: "País con el mejor rendimiento en términos de actividad y valoraciones.",
    href: "",
    background: (
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 opacity-60"></div>
        <div className="absolute right-0 bottom-0 w-36 h-36 transform translate-x-1/3 translate-y-1/4 opacity-10 group-hover:opacity-15 transition-all duration-300">
          <svg className="w-full h-full text-[#01426A]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/>
          </svg>
        </div>
      </div>
    ),
    className: "lg:col-span-1 lg:row-span-1",
    value: "El Salvador",
    order: 2
  },
  {
    Icon: Layers,
    name: "Proyectos Activos",
    description: "Proyectos actualmente en desarrollo por equipos de trabajo.",
    href: "",
    background: (
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 opacity-60"></div>
        <div className="absolute right-0 bottom-0 w-36 h-36 transform translate-x-1/3 translate-y-1/4 opacity-10 group-hover:opacity-15 transition-all duration-300">
          <svg className="w-full h-full text-[#01426A]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 10h2v7H7zm4-3h2v10h-2zm4 6h2v4h-2z"/>
          </svg>
        </div>
      </div>
    ),
    className: "lg:col-span-2 lg:row-span-2",
    value: "10",
    order: 3
  },
  {
    Icon: Layers,
    name: "Proyectos Completados",
    description: "Proyectos finalizados y entregados a los clientes.",
    href: "",
    background: <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 opacity-40"></div>,
    className: "lg:col-span-1 lg:hidden",
    value: "27"
  },
];

/**
 * Componente principal del dashboard Bento para DayLog
 * 
 * Este componente renderiza un grid de tarjetas informativas que muestran
 * estadísticas clave del sistema como usuarios totales, rendimiento por país,
 * proyectos activos y completados. Utiliza un diseño responsive que se adapta
 * a diferentes tamaños de pantalla.
 * 
 * @returns {JSX.Element} El dashboard Bento renderizado
 * 
 * // Uso básico en una página de dashboard
 * <BentoDemo />
 */
function BentoDemo() {
  // Ordenar y posicionar elementos - Usuario y Rendimiento a la izquierda, Proyectos a la derecha
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 lg:grid-rows-2 gap-3">
      <div className="col-span-1 lg:col-span-1 row-span-2 flex flex-col gap-3">
        <BentoCardWithValue {...features[0]} />
        <BentoCardWithValue {...features[1]} />
      </div>
      <div className="col-span-1 lg:col-span-2 row-span-2 h-full">
        <div className="h-full">
          <BentoCardWithValue {...features[2]} className="h-full" />
        </div>
      </div>
    </div>
  );
}

/**
 * Versión personalizada de BentoCard con valor destacado
 * 
 * Este componente extiende la funcionalidad de BentoCard para mostrar
 * un valor numérico prominente junto con el icono, manteniendo el diseño
 * limpio y moderno del sistema DayLog.
 * 

 */
const BentoCardWithValue = (props) => {
  const {
    name,
    className,
    background,
    Icon,
    description,
    value,
  } = props;
  
  return (
  <div
    className={cn(
      "group relative col-span-1 flex flex-col justify-between overflow-hidden rounded-xl",
      // light styles
      "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
      // dark styles
      "transform-gpu dark:bg-black dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
      className,
    )}
  >
    {background}
    <div className="pointer-events-none z-10 flex h-full transform-gpu flex-col p-6">
      <div className="flex items-center justify-between">
        <Icon className="h-10 w-10 text-[#D6AC50] transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" />
        <span className="text-2xl font-bold text-[#01426A] transition-all duration-300 group-hover:scale-105">{value}</span>
      </div>
      
      <div className="mt-auto transform-gpu transition-all duration-300 group-hover:-translate-y-2">
        <h3 className="text-xl font-semibold text-gray-800">
          {name}
        </h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
    <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-black/[.03] group-hover:dark:bg-neutral-800/10" />
  </div>
  );
};

export { BentoDemo };
