// =================================================================
// GlobeChart - Componente moderno para visualización de globo terráqueo
// =================================================================
// Este componente utiliza la biblioteca cobe para crear una visualización
// moderna y realista de un globo terráqueo interactivo con marcadores para
// países centroamericanos.
// =================================================================
import React, { useEffect, useRef, useState } from 'react';
import createGlobe from "cobe";
import { motion as Motion } from "framer-motion";
import { useMotionValue, useSpring } from "framer-motion";
import { TrendingUp, TrendingDown, Users } from "lucide-react";

const degToRad = (deg) => (deg * Math.PI) / 180;
const MOVEMENT_DAMPING = 1400;

// Coordenadas y posiciones fijas para los países
const COUNTRY_META = {
  'El Salvador': {
    id: 'SLV',
    name: 'El Salvador',
    location: [13.7942, -88.8965],
    position: { top: '52%', left: '48%' },
    cardPosition: { top: '5%', left: '40%' }
  },
  'Guatemala': {
    id: 'GTM',
    name: 'Guatemala',
    location: [15.7835, -90.2308],
    position: { top: '50%', left: '46%' },
    cardPosition: { top: '40%', left: '5%' }
  },
  'Honduras': {
    id: 'HND',
    name: 'Honduras',
    location: [13.9444, -83.1966],
    position: { top: '54%', left: '50%' },
    cardPosition: { top: '40%', left: '75%' }
  }
};

const GLOBE_CONFIG = {
  width: 1200,
  height: 1200,
  devicePixelRatio: 2,
  phi: degToRad(-90), // enfoca la longitud de Centroamérica
  theta: degToRad(10), // enfoca la latitud de Centroamérica
  dark: 0,
  diffuse: 0.2,
  mapSamples: 32000,
  mapBrightness: 1.8,
  baseColor: [1, 1, 1],
  markerColor: [230 / 255, 200 / 255, 21 / 255], // Color amarillo para marcadores
  glowColor: [1, 1, 1],
  markers: Object.values(COUNTRY_META).map(meta => ({ location: meta.location, size: 0.05 })),
};

const GlobeChart = ({ employeesByCountry = {}, projectsByCountry = {}, className }) => {
  // Mapear datos reales a los países del globo
  const countriesData = Object.values(COUNTRY_META).map(meta => {
    // Buscar el país por nombre en employeesByCountry y projectsByCountry
    const empEntry = Object.values(employeesByCountry).find(e => e.name === meta.name);
    const projEntry = Object.values(projectsByCountry).find(p => p.name === meta.name);
    // Calcular saturación real
    let saturation = 0;
    let trend = 'down';
    if (projEntry) {
      const total = projEntry.finalizados + projEntry.activos + projEntry.pendientes + projEntry.retrasados;
      if (total > 0) {
        saturation = Math.round(((projEntry.activos + projEntry.pendientes + projEntry.retrasados) / total) * 100);
        trend = projEntry.saturado ? 'up' : 'down';
      }
    }
    return {
      ...meta,
      employees: empEntry ? empEntry.count : 0,
      saturation,
      trend
    };
  });

  // Mostrar en consola los datos recibidos para depuración
  console.log('Empleados por país:', employeesByCountry);
  console.log('Proyectos por país:', projectsByCountry);
  const phiRef = useRef(0);
  const widthRef = useRef(0);
  const canvasRef = useRef(null);
  const pointerInteracting = useRef(null);
  const pointerInteractionMovement = useRef(0);
  const [showCards, setShowCards] = useState(false);
  
  // Configuración de la animación de rotación con Framer Motion
  const r = useMotionValue(0); // Valor base para el ángulo de rotación
  const rs = useSpring(r, {
    mass: 1,        // Masa del "resorte" (impacta la inercia)
    damping: 30,    // Amortiguación (reduce oscilaciones)
    stiffness: 100, // Rigidez (determina la velocidad de la animación)
  });

  const updatePointerInteraction = (value) => {
    pointerInteracting.current = value;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value !== null ? "grabbing" : "grab";
    }
  };

  const updateMovement = (clientX) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current;
      pointerInteractionMovement.current = delta;
      r.set(r.get() + delta / MOVEMENT_DAMPING);
    }
  };

  // Efecto para mostrar las tarjetas cuando el globo está en la posición correcta
  useEffect(() => {
    const unsubscribe = rs.onChange((value) => {
      // Mostrar las tarjetas cuando el globo está aproximadamente en la posición de Centroamérica
      // El rango es aproximado y puede necesitar ajustes
      const isInCentralAmericaView = (value % (2 * Math.PI)) < 0.8 || (value % (2 * Math.PI)) > 5.5;
      setShowCards(isInCentralAmericaView);
    });
    
    return () => unsubscribe();
  }, [rs]);

  useEffect(() => {
    const onResize = () => {
      if (canvasRef.current) {
        widthRef.current = canvasRef.current.offsetWidth;
      }
    };

    window.addEventListener("resize", onResize);
    onResize();

    // Crear el globo con cobe
    const globe = createGlobe(canvasRef.current, {
      ...GLOBE_CONFIG,
      width: widthRef.current * 2,
      height: widthRef.current * 2,
      onRender: (state) => {
        if (!pointerInteracting.current) phiRef.current += 0.002; // Giro más lento
        state.phi = phiRef.current + rs.get();
        state.width = widthRef.current * 2;
        state.height = widthRef.current * 2;
      },
    });

    // Hacer visible el globo después de cargarlo
    setTimeout(() => {
      if (canvasRef.current) {
        canvasRef.current.style.opacity = "1";
      }
    }, 0);
    
    return () => {
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, [rs]);

  // Componente para la tarjeta de información de país con línea conectora
  const CountryInfoCard = ({ country, visible }) => (
    <>
      {/* Línea conectora */}
      <Motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: visible ? 0.6 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute pointer-events-none z-10"
        style={{
          top: country.position.top,
          left: country.position.left,
          width: '1px',
          height: '1px',
        }}
      />

      {/* Tarjeta de información */}
      <Motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: visible ? 1 : 0, 
          y: visible ? 0 : 20,
          scale: visible ? 1 : 0.8
        }}
        transition={{ duration: 0.3 }}
        className="absolute bg-white rounded-lg shadow-lg p-3 z-20 w-[140px]"
        style={{
          top: country.cardPosition.top,
          left: country.cardPosition.left,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div className="font-semibold text-sm text-gray-800 mb-1">{country.name}</div>
        <div className="flex items-center text-xs text-gray-600 mb-1">
          <Users size={12} className="mr-1" />
          <span>{country.employees} empleados</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-xs">Saturación:</div>
          <div className={`flex items-center text-xs font-medium ${country.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {country.saturation}%
            {country.trend === 'up' ? 
              <TrendingUp size={12} className="ml-1" /> : 
              <TrendingDown size={12} className="ml-1" />}
          </div>
        </div>
      </Motion.div>
    </>
  );

  return (
    <Motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`relative mx-auto aspect-[1/1] w-full max-w-[600px] ${className || ''}`}
    >
      {/* Tarjetas de información de países */}
      {countriesData.map((country) => (
        <CountryInfoCard 
          key={country.id} 
          country={country} 
          visible={showCards}
        />
      ))}
      
      <canvas
        className="size-full opacity-0 transition-opacity duration-500 rounded-full [contain:layout_paint_size]"
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX;
          updatePointerInteraction(e.clientX);
        }}
        onPointerUp={() => updatePointerInteraction(null)}
        onPointerOut={() => updatePointerInteraction(null)}
        onMouseMove={(e) => updateMovement(e.clientX)}
        onTouchMove={(e) =>
          e.touches[0] && updateMovement(e.touches[0].clientX)
        }
      />
      
      {/* Instrucción para el usuario */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 bg-white/80 px-2 py-1 rounded-full">
        Gira el globo para ver detalles
      </div>
    </Motion.div>
  );
};

export default GlobeChart;
