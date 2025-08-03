// =================================================================
// HighlightAreaCard - Componente para destacar un área o categoría importante
// =================================================================
// Este componente muestra visualmente un área destacada o categoría relevante
// con un diseño que llama la atención. Se utiliza para resaltar información
// crítica o áreas de atención prioritaria dentro del dashboard global.
// =================================================================

import React from 'react';
import { motion as Motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

const HighlightAreaCard = ({ area }) => {
  return (
    // Animación de entrada de la tarjeta de área destacada:
    // - initial: estado inicial con opacidad 0 (invisible) y desplazada 20px hacia abajo
    // - animate: estado final con opacidad 1 (visible) y en su posición correcta (y: 0)
    // - transition: duración de 0.3 segundos para mantener consistencia con otros componentes
    // - Esta animación sigue el mismo patrón que las demás tarjetas para una experiencia visual unificada
    <Motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-sm p-5"
    >
      <h3 className="text-xs md:text-sm text-gray-600 mb-2 md:mb-3">Área más sobresaliente</h3>
      <div className="flex items-center gap-2 md:gap-3">
        <div className="text-[#01426A]">
          <AlertTriangle size={20} className="w-5 h-5 md:w-7 md:h-7" />
        </div>
        <h2 className="text-base md:text-xl font-semibold text-gray-800">{area}</h2>
      </div>
    </Motion.div>
  );
};

export default HighlightAreaCard;
