import React, { useRef } from 'react';
import Lottie from 'react-lottie';
import { motion as Motion, useAnimation } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import RexAiAnimation from '@/assets/Rex_Ai.json';

/**
 * Componente de animación interactiva de RexAI
 *
 * Este componente muestra una animación Lottie de RexAI con efectos de hover y click.
 * Al hacer click, navega a la página de RexAI. Incluye animaciones de escala y brillo
 * al pasar el mouse para mejorar la experiencia visual.
 *

 * // Animación básica de RexAI
 * <RexAIAnimation />
 *
 * // Animación con clases personalizadas
 * <RexAIAnimation className="mx-auto my-8" />
 */
const RexAIAnimation = ({ className = "" }) => {
  const navigate = useNavigate();
  const animationControls = useAnimation();
  const containerRef = useRef(null);

  // Opciones para la animación Lottie
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: RexAiAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
      clearCanvas: true,
      progressiveLoad: true,
      hideOnTransparent: true
    }
  };

  // Función para navegar a la página de RexAI
  const handleClick = () => {
    navigate('/admin/rexai');
  };

  // Animación al pasar el mouse
  const handleMouseEnter = () => {
    animationControls.start({
      scale: 1.2,
      filter: "brightness(1.2)",
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    });
  };

  const handleMouseLeave = () => {
    animationControls.start({
      scale: 1,
      filter: "brightness(1)",
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    });
  };

  return (
    <Motion.div
      ref={containerRef}
      className={`relative cursor-pointer rounded-full overflow-visible ${className}`}
      animate={animationControls}
      initial={{ 
        scale: 1, 
        filter: "brightness(1)"
      }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ 
        width: "100px",
        height: "100px",
        background: "transparent"
      }}
    >
      <Lottie 
        options={defaultOptions}
        height="100%"
        width="100%"
      />
    </Motion.div>
  );
};

export default RexAIAnimation;
