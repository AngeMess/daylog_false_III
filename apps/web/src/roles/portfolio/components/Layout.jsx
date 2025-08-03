import React, { useState, useEffect } from 'react';
import { motion as Motion } from 'framer-motion';
import { Outlet } from 'react-router-dom';
import NavbarPortfolio from './NavbarPortfolio';

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

export default function LayoutPortfolio() {
  // Estado para saber si el menú está expandido o contraído
  const [navExpanded, setNavExpanded] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width: 1200px)');
  
  // Calculamos el margen en función del tamaño de pantalla y estado del nav
  const mainMargin = isSmallScreen 
    ? 80 // En móviles, solo margen top para el navbar horizontal
    : navExpanded ? 280 : 110; // En pantallas grandes, margen lateral

  return (
    <div className="relative min-h-screen" style={{ backgroundColor: '#f5f5f5' }}>
      <NavbarPortfolio isExpanded={navExpanded} onExpandChange={setNavExpanded} />
      <Motion.div
        animate={isSmallScreen 
          ? { marginTop: mainMargin, marginLeft: 0 }
          : { marginLeft: mainMargin, marginTop: 0 }
        }
        transition={{ type: 'tween', duration: 0.1, ease: 'easeInOut' }}
        className="min-h-screen p-8 transition-all">
        <div className="bg-white rounded-xl shadow-md p-6 min-h-[calc(100vh-4rem)]">
          <Outlet />
        </div>
      </Motion.div>
    </div>
  );
}
