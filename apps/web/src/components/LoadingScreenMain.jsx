/**
 * Componente LoadingScreenMain - Pantalla de carga principal avanzada
 * 
 * Este componente proporciona una pantalla de carga principal más sofisticada
 * con animaciones GSAP, partículas dinámicas y efectos visuales avanzados.
 * Se utiliza durante la carga inicial de la aplicación.
 * 
 * Funcionalidades:
 * - Pantalla de carga a pantalla completa con overlay
 * - Animación Lottie central con efectos de pulso
 * - Partículas animadas de fondo
 * - Elementos decorativos circulares
 * - Animaciones GSAP complejas
 * - Timeline de animaciones coordinadas
 * 
 * Características:
 * - Fondo degradado con colores corporativos
 * - Partículas con colores dinámicos (#01426A, #FFC600, etc.)
 * - Círculos decorativos con animación pulse
 * - Contenedor central con backdrop blur
 * - Animaciones escalonadas y coordinadas
 * - Z-index máximo para estar por encima de todo
 * 
 * Elementos visuales:
 * - 15 partículas animadas aleatoriamente
 * - 2 círculos decorativos con diferentes tamaños
 * - Animación Lottie central con escala dinámica
 * - Efectos de resplandor y blur
 * - Transiciones suaves entre estados
 */

// components/LoadingScreenMain.jsx

import React, { useEffect, useRef, useState } from 'react';
import Lottie from 'react-lottie';
import { gsap } from 'gsap';
import animationData from '../assets/Loading_Color_Cusca.json';

const LoadingScreenMain = () => {
  const containerRef = useRef(null);
  const backgroundRef = useRef(null);
  const contentRef = useRef(null);
  const lottieRef = useRef(null);
  // Ya no necesitamos referencias para textos
  const particlesRef = useRef([]);
  // No necesitamos mantener estado para el timer
  const [, setIsReady] = useState(false);

  // Configuración de Lottie
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };
  
  // Crear partículas aleatorias
  const generateParticles = () => {
    const particles = [];
    const colors = ['#01426A', '#FFC600', '#0072B5', '#FFD700'];
    
    for (let i = 0; i < 15; i++) {
      particles.push({
        id: i,
        size: Math.random() * 30 + 10,
        x: Math.random() * 100,
        y: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    
    return particles;
  };

  // Efecto para crear y animar partículas
  useEffect(() => {
    // Esperar a que el DOM se cargue por completo antes de animar
    const timer = setTimeout(() => {
      setIsReady(true);
      
      if (backgroundRef.current && containerRef.current && lottieRef.current) {
        
        // Timeline principal
        const mainTl = gsap.timeline();
        
        // 1. Animar el fondo
        mainTl.fromTo(backgroundRef.current, {
          opacity: 0,
        }, {
          opacity: 1,
          duration: 1.5,
        }, 0);
        
        // 2. Animar el contenido central
        mainTl.fromTo(contentRef.current, {
          opacity: 0,
          scale: 0.8,
        }, {
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: 'back.out(1.7)',
        }, 0.3);
        
        // Ya no animamos texto, se ha eliminado
        
        // 4. Animar partículas
        particlesRef.current.forEach((particle, i) => {
          if (!particle) return;
          
          // Animación continua de partículas
          gsap.to(particle, {
            x: `+=${Math.sin(i) * 100}`,
            y: `+=${Math.cos(i) * 100}`,
            rotation: Math.random() * 360,
            duration: 3 + Math.random() * 5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: Math.random(),
          });
        });
        
        // 5. Animar Lottie con pulso
        gsap.to(lottieRef.current, {
          scale: 1.05,
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
        
        // 6. Animar fondo con resplandor
        gsap.to(backgroundRef.current, {
          background: 'radial-gradient(circle, rgba(1,66,106,0.1) 0%, rgba(255,198,0,0.05) 50%, rgba(1,66,106,0.1) 100%)',
          duration: 4,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }
    }, 50); // Pequeño retraso para asegurar que el DOM esté listo
    
    // Configurar temporizador para mantener la pantalla de carga por 10 segundos
    const loadingTimer = setTimeout(() => {
      // Aquí podrías agregar una animación de salida o transición
    }, 10000);
    
    // Guardar referencias para la limpieza
    const cleanupRefs = () => {
      const particlesArray = [...particlesRef.current];
      const lottieEl = lottieRef.current;
      const backgroundEl = backgroundRef.current;
      const contentEl = contentRef.current;
      // Ya no necesitamos referencias a elementos de texto
      
      return { particlesArray, lottieEl, backgroundEl, contentEl };
    };
    
    // Guardar las referencias antes de la limpieza
    const refs = cleanupRefs();
    
    return () => {
      clearTimeout(timer);
      clearTimeout(loadingTimer);
      
      // Usar las referencias guardadas para la limpieza
      if (refs.particlesArray.length > 0) {
        refs.particlesArray.forEach(el => el && gsap.killTweensOf(el));
      }
      if (refs.lottieEl) gsap.killTweensOf(refs.lottieEl);
      if (refs.backgroundEl) gsap.killTweensOf(refs.backgroundEl);
      if (refs.contentEl) gsap.killTweensOf(refs.contentEl);
      // Ya no hay elementos de texto
    };
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-[9999] overflow-hidden">
      {/* Fondo animado */}
      <div 
        ref={backgroundRef}
        className="absolute inset-0 bg-gradient-to-br from-blue-50 to-yellow-50"
      />
      
      {/* Contenedor principal con referencia para animación */}
      <div ref={containerRef} className="h-full w-full relative">
        {/* Partículas de fondo animadas */}
        {generateParticles().map((particle, index) => (
          <div
            key={particle.id}
            ref={el => { particlesRef.current[index] = el; }}
            className="absolute rounded-full"
            style={{
              backgroundColor: particle.color,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              opacity: 0.3,
              boxShadow: `0 0 ${particle.size / 2}px ${particle.color}`,
            }}
          />
        ))}
        
        {/* Círculos decorativos */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border-4 border-blue-200/30 animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full border-4 border-yellow-200/30 animate-pulse delay-300" />
        
        {/* Contenido central */}
        <div 
          ref={contentRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-6 rounded-full bg-white/90 backdrop-blur-lg shadow-2xl 
                     flex items-center justify-center z-10 w-64 h-64"
        >
          {/* Animación Lottie */}
          <div ref={lottieRef}>
            <Lottie 
              options={defaultOptions} 
              height={210} 
              width={210}
              isStopped={false}
              isPaused={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreenMain;
