import React, { useEffect } from 'react';
import { motion as Motion } from 'framer-motion';
import { Bot, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AIAssistantInterface } from '@/components/AIAssistantInterface';

const RexAIPage = () => {
  const navigate = useNavigate();

  // Efecto para modificar el fondo del Layout
  useEffect(() => {
    // Acceder al elemento principal del Layout (tarjeta blanca)
    const layoutContent = document.querySelector('.bg-white.rounded-xl.shadow-md');
    
    if (layoutContent) {
      // Guardar el estilo original para restaurarlo después
      const originalBg = layoutContent.style.backgroundColor;
      const originalShadow = layoutContent.style.boxShadow;
      const originalOverflow = layoutContent.style.overflow;
      
      // Modificar el estilo para mostrar el fondo de puntos
      layoutContent.style.backgroundColor = 'transparent';
      layoutContent.style.boxShadow = 'none';
      layoutContent.style.position = 'relative';
      layoutContent.style.zIndex = '1';
      layoutContent.style.overflow = 'hidden';
      
      // Generar un ID único para el patrón de puntos
      const uniqueId = `dotted-pattern-${Date.now()}`;
      
      // Agregar el fondo de puntos
      const dotBg = document.createElement('div');
      dotBg.className = 'absolute inset-0 z-0';
      dotBg.style.overflow = 'hidden';
      
      // Crear el SVG manualmente para el patrón de puntos (solo dotted pattern)
      dotBg.innerHTML = `
        <svg
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="blur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="0.7" />
            </filter>
            <pattern
              id="${uniqueId}"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <!-- // Puntos con efecto glassmórfico -->
              <circle cx="10" cy="10" r="1.5" fill="rgba(1, 66, 106, 0.4)" filter="url(#blur)" />
            </pattern>
          </defs>
          <!-- // Fondo con efecto glassmórfico -->
          <rect x="0" y="0" width="100%" height="100%" fill="rgba(255, 255, 255, 0.9)" stroke="none" />
          <rect x="0" y="0" width="100%" height="100%" fill="url(#${uniqueId})" stroke="none" />
        </svg>
      `;
      
      // Añadir al DOM antes del primer hijo
      layoutContent.insertBefore(dotBg, layoutContent.firstChild);
      
      // Limpiar al desmontar el componente
      return () => {
        if (layoutContent) {
          layoutContent.style.backgroundColor = originalBg;
          layoutContent.style.boxShadow = originalShadow;
          layoutContent.style.overflow = originalOverflow;
          if (dotBg && dotBg.parentNode === layoutContent) {
            layoutContent.removeChild(dotBg);
          }
        }
      };
    }
  }, []);

  return (
    <div className="relative z-10 w-full">
      {/* Contenido de la página */}
      <Motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        {/* Encabezado */}
        <div className="flex items-center mb-8">
          <button 
            onClick={() => navigate('/admin/global')} 
            className="flex items-center text-black hover:text-[#FFC600] transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            <span>Volver a Global</span>
          </button>
        </div>

        {/* Contenido principal con efecto glassmorphism */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-xl rounded-xl p-6 md:p-8 relative">
          {/* Glassmorphism inner glow effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/25 to-transparent pointer-events-none rounded-xl"></div>
          
          {/* Integración del componente AIAssistantInterface */}
          <AIAssistantInterface />
        </div>
      </Motion.div>
    </div>
  );
};

export default RexAIPage;
