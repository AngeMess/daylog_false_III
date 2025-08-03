/**
 * Componente AnimatedGridPattern - Patrón de cuadrícula animada
 * 
 * Este componente crea un patrón de cuadrícula animada que se utiliza como
 * fondo decorativo en la aplicación. Los cuadrados aparecen y desaparecen
 * de manera aleatoria creando un efecto visual dinámico.
 * 
 * Funcionalidades:
 * - Patrón de cuadrícula SVG animada
 * - Cuadrados que aparecen/desaparecen aleatoriamente
 * - Posicionamiento dinámico de elementos
 * - Animaciones fluidas con Framer Motion
 * - Responsive design con ResizeObserver
 * 
 * Características:
 * - Cuadrícula configurable (ancho, alto, número de cuadrados)
 * - Colores corporativos (amarillo para cuadrados, gris para líneas)
 * - Opacidad configurable para efectos sutiles
 * - Duración y retrasos personalizables
 * - Patrón SVG escalable
 * 
 * Props configurables:
 * - width/height: Dimensiones de la cuadrícula
 * - numSquares: Número de cuadrados animados (limitado a 10)
 * - maxOpacity: Opacidad máxima de los cuadrados
 * - duration: Duración de las animaciones
 * - repeatDelay: Retraso entre repeticiones
 * - className: Clases CSS adicionales
 * 
 * Elementos visuales:
 * - Líneas de cuadrícula sutiles
 * - Cuadrados animados con colores corporativos
 * - Efectos de aparición/desaparición
 * - Posicionamiento aleatorio dinámico
 */

"use client";

import { motion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export function AnimatedGridPattern({
  width = 40,
  height = 40,
  x = -1,
  y = -1,
  strokeDasharray = 0,
  numSquares = 10, // Limitar a 10 cuadrados
  className,
  maxOpacity = 0.3,
  duration = 2,
  repeatDelay = 3,
  ...props
}) {
  const id = useId();
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [squares, setSquares] = useState(() => generateSquares(numSquares));

  function getPos() {
    return [
      Math.floor((Math.random() * dimensions.width) / width),
      Math.floor((Math.random() * dimensions.height) / height),
    ];
  }

  // Adjust the generateSquares function to return objects with an id, x, and y
  function generateSquares(count) {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      pos: getPos(),
    }));
  }

  // Function to update a single square's position
  const updateSquarePosition = (id) => {
    setSquares((currentSquares) =>
      currentSquares.map((sq) =>
        sq.id === id
          ? {
              ...sq,
              pos: getPos(),
            }
          : sq
      )
    );
  };

  // Update squares to animate in
  useEffect(() => {
    if (dimensions.width && dimensions.height) {
      setSquares(generateSquares(numSquares));
    }
  }, [dimensions, numSquares]);

  // Resize observer to update container dimensions
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, [containerRef]);

  return (
    <svg
      ref={containerRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full fill-yellow-400/10 stroke-gray-100/10", // Ajustar los colores
        className
      )}
      {...props}
    >
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path
            d={`M.5 ${height}V.5H${width}`}
            fill="none"
            strokeDasharray={strokeDasharray}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
      <svg x={x} y={y} className="overflow-visible">
        {squares.map(({ pos: [x, y], id }, index) => (
          <motion.rect
            initial={{ opacity: 0 }}
            animate={{ opacity: maxOpacity }}
            transition={{
              duration,
              repeat: 1,
              delay: index * 0.1,
              repeatType: "reverse",
            }}
            onAnimationComplete={() => updateSquarePosition(id)}
            key={`${x}-${y}-${index}`}
            width={width - 1}
            height={height - 1}
            x={x * width + 1}
            y={y * height + 1}
            fill="#FFC600" // Cambiar el color de los cuadros a #FFC600
            strokeWidth="0"
          />
        ))}
      </svg>
    </svg>
  );
}

