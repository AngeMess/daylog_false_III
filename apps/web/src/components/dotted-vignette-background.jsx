/**
 * Componente DottedBackground - Fondo con patrón de puntos y viñeta
 * 
 * Este componente crea un fondo decorativo con un patrón de puntos y efectos
 * de viñeta e iluminación interna. Utiliza SVG para crear patrones vectoriales
 * escalables y efectos visuales avanzados.
 * 
 * Funcionalidades:
 * - Patrón de puntos personalizable (tamaño, espaciado, color)
 * - Efecto de viñeta radial opcional
 * - Iluminación interna opcional
 * - Fondo personalizable
 * - Patrones SVG escalables
 * 
 * Características visuales:
 * - Patrón de puntos repetitivo usando SVG patterns
 * - Gradientes radiales para efectos de viñeta
 * - Efectos de iluminación interna
 * - Colores personalizables
 * - Escalabilidad perfecta en cualquier resolución
 * 
 * Props configurables:
 * - dotColor: Color de los puntos
 * - backgroundColor: Color de fondo
 * - dotSize: Tamaño de los puntos
 * - dotSpacing: Espaciado entre puntos
 * - enableVignette: Activar efecto de viñeta
 * - vignetteColor: Color de la viñeta
 * - enableInnerGlow: Activar iluminación interna
 * - innerGlowColor: Color de la iluminación
 * - className: Clases CSS adicionales
 * - style: Estilos inline adicionales
 */

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

const DottedBackground = ({
  dotColor = '#000000',
  backgroundColor = 'transparent',
  dotSize = 2,
  dotSpacing = 10,
  enableVignette = true,
  vignetteColor = 'rgb(0,0,0)',
  enableInnerGlow = true,
  innerGlowColor = 'rgb(0,0,0)',
  className = '',
  style = {},
}) => {
  const ids = useMemo(() => {
    const baseId = `dotted-bg-${Math.random().toString(36).substr(2, 9)}`;
    return {
      pattern: `${baseId}-pattern`,
      vignette: `${baseId}-vignette`,
      innerGlow: `${baseId}-inner-glow`,
    };
  }, []);

  return (
    <div className={`w-full h-full ${className}`} style={style}>
      <svg
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Pattern */}
          <pattern
            id={ids.pattern}
            x="0"
            y="0"
            width={dotSpacing}
            height={dotSpacing}
            patternUnits="userSpaceOnUse"
          >
            <circle cx={dotSpacing / 2} cy={dotSpacing / 2} r={dotSize} fill={dotColor} />
          </pattern>

          {/* Vignette Gradient */}
          {enableVignette && (
            <radialGradient
              id={ids.vignette}
              cx="50%"
              cy="50%"
              r="50%"
              fx="50%"
              fy="50%"
            >
              <stop offset="40%" stopColor={vignetteColor} stopOpacity="0" />
              <stop offset="100%" stopColor={vignetteColor} stopOpacity="1" />
            </radialGradient>
          )}

          {/* Inner Glow Gradient */}
          {enableInnerGlow && (
            <radialGradient
              id={ids.innerGlow}
              cx="50%"
              cy="50%"
              r="50%"
              fx="50%"
              fy="50%"
            >
              <stop offset="50%" stopColor={innerGlowColor} stopOpacity="0.7" />
              <stop offset="100%" stopColor={innerGlowColor} stopOpacity="0" />
            </radialGradient>
          )}
        </defs>

        {/* Background */}
        <rect x="0" y="0" width="100%" height="100%" fill={backgroundColor} stroke="none" />
        <rect x="0" y="0" width="100%" height="100%" fill={`url(#${ids.pattern})`} stroke="none" />

        {/* Vignette */}
        {enableVignette && (
          <rect x="0" y="0" width="100%" height="100%" fill={`url(#${ids.vignette})`} stroke="none" />
        )}

        {/* Inner Glow */}
        {enableInnerGlow && (
          <circle cx="50%" cy="50%" r="25%" fill={`url(#${ids.innerGlow})`} stroke="none" />
        )}
      </svg>
    </div>
  );
};

DottedBackground.propTypes = {
  dotColor: PropTypes.string,
  backgroundColor: PropTypes.string,
  dotSize: PropTypes.number,
  dotSpacing: PropTypes.number,
  enableVignette: PropTypes.bool,
  vignetteColor: PropTypes.string,
  enableInnerGlow: PropTypes.bool,
  innerGlowColor: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object
};

export { DottedBackground }

