import React from 'react';
import { motion as Motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

/**
 * Componente de botón flotante y responsivo para acceder a RexAI
 *
 * Este componente muestra un botón animado que permite acceder rápidamente a la sección de RexAI.
 * Se adapta a escritorio y móvil, mostrando una versión flotante en escritorio y una barra superior en móvil.
 * Incluye animaciones de entrada, hover y pulsación para mejorar la experiencia de usuario.
 *

 * // Botón flotante por defecto
 * <RexAIButton />
 *
 * // Botón en una posición personalizada
 * <RexAIButton className="absolute top-10 left-10" isFloating={false} />
 */
const RexAIButton = ({ className = "", isFloating = true }) => {
  const navigate = useNavigate();

  // Función para navegar a la página de RexAI
  const handleClick = () => {
    navigate('/admin/rexai');
  };

  return (
    <>
      {/* Versión para pantallas grandes */}
      <Motion.div
        className={`${isFloating ? "fixed bottom-6 right-6 z-50" : className} hidden md:block`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.3
        }}
      >
        <Motion.button
          onClick={handleClick}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-[#01426A] to-[#026BB3] text-white shadow-lg flex items-center justify-center overflow-hidden"
          whileHover={{ 
            scale: 1.1,
            boxShadow: "0 0 15px rgba(1, 66, 106, 0.6)",
            rotate: [0, 5, -5, 0]
          }}
          whileTap={{ scale: 0.9 }}
          animate={{
            y: [0, -5, 0],
          }}
          transition={{
            y: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        >
          <Motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              background: [
                "radial-gradient(circle at 30% 30%, rgba(1, 66, 106, 1), rgba(2, 107, 179, 0.8))",
                "radial-gradient(circle at 70% 70%, rgba(1, 66, 106, 1), rgba(2, 107, 179, 0.8))",
                "radial-gradient(circle at 30% 30%, rgba(1, 66, 106, 1), rgba(2, 107, 179, 0.8))"
              ]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <span className="z-10 text-sm font-bold">Rex</span>
        </Motion.button>
      </Motion.div>

      {/* Versión para dispositivos móviles */}
      <Motion.div
        className={`${isFloating ? "fixed top-0 left-0 right-0 z-50" : className} md:hidden`}
        initial={isFloating ? { y: -100 } : { opacity: 0 }}
        animate={isFloating ? { y: 0 } : { opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Motion.button
          onClick={handleClick}
          className="w-full py-2 bg-gradient-to-r from-[#01426A] to-[#026BB3] text-white shadow-md flex items-center justify-center"
          whileTap={{ scale: 0.97 }}
        >
          <Motion.span
            className="font-bold"
            animate={{ 
              scale: [1, 1.05, 1],
              color: ["#ffffff", "#FFC600", "#ffffff"]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            RexAI
          </Motion.span>
        </Motion.button>
      </Motion.div>
    </>
  );
};

export default RexAIButton;
