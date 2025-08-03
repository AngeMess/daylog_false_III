// =================================================================
// StatCard - Componente de tarjeta para mostrar estadísticas individuales
// =================================================================
// Este componente renderiza una tarjeta estándar para mostrar una 
// estadística individual con un título, valor e icono. Tiene animación
// de entrada y un diseño limpio y consistente que se utiliza en varios
// lugares del dashboard global.
// =================================================================

import React from 'react';
import { motion as Motion } from 'framer-motion';

const StatCard = ({ title, value, icon }) => {
  return (
    // Animación de entrada de la tarjeta de estadísticas:
    // - initial: comienza invisible (opacity: 0) y desplazada hacia abajo (y: 20px)
    // - animate: transiciona a completamente visible (opacity: 1) y en su posición final (y: 0)
    // - transition: duración corta de 0.3 segundos para una aparición rápida pero agradable
    // - Esta animación crea un efecto de "deslizamiento hacia arriba con aparecer gradual"
    <Motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-sm p-5 flex flex-col items-start"
    >
      <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-gray-100 rounded-full mb-2 md:mb-3">
        {icon}
      </div>
      <h3 className="text-sm md:text-base font-medium text-gray-600 mb-1">{title}</h3>
      <p className="text-xl md:text-2xl font-semibold text-gray-800">{value}</p>
    </Motion.div>
  );
};

export default StatCard;
