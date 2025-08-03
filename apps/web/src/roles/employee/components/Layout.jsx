import React, { useState, useEffect } from 'react';
import { motion as Motion } from 'framer-motion';
import { Outlet } from 'react-router-dom';
import NavbarEmployee from './NavbarEmployee';

// Hook personalizado para detectar tamaño de pantalla
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
};

export default function Layout() {
  // Estado para saber si el menú está expandido o contraído
  const [navExpanded, setNavExpanded] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width: 1200px)');
  
  // En pantallas pequeñas, siempre mantenemos el menú contraído
  useEffect(() => {
    // Si estamos en pantalla pequeña, aseguramos que el nav esté contraído
    if (isSmallScreen) {
      setNavExpanded(false);
    }
  }, [isSmallScreen]); // Solo dependemos de isSmallScreen
  
  // Calculamos el margen en función del tamaño de pantalla y estado del nav
  const mainMargin = isSmallScreen 
    ? 80 // En móviles, solo margen top para el navbar horizontal
    : navExpanded ? 280 : 110; // En pantallas grandes, margen lateral

  return (
    <div className="relative min-h-screen" style={{ backgroundColor: '#f5f5f0' }}>
      <NavbarEmployee isExpanded={navExpanded} onExpandChange={setNavExpanded} />
      <Motion.div
        animate={isSmallScreen 
          ? { marginTop: mainMargin, marginLeft: 0 }
          : { marginLeft: mainMargin, marginTop: 0 }
        }
        transition={{ duration: 0.08, ease: [0.4, 0.0, 0.2, 5] }}
        className="min-h-screen p-4 md:p-8 transition-all">
        <div className="bg-white rounded-xl shadow-md p-3 md:p-6 min-h-[calc(100vh-4rem)] overflow-x-hidden">
          <Outlet />
        </div>
      </Motion.div>
    </div>
  );
}
