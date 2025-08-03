/**
 * Componente LoadingScreen - Pantalla de carga con animación Lottie
 * 
 * Este componente muestra una pantalla de carga atractiva mientras se cargan
 * los recursos de la aplicación. Utiliza animaciones Lottie para crear una
 * experiencia visual atractiva y profesional.
 * 
 * Funcionalidades:
 * - Pantalla de carga a pantalla completa
 * - Animación Lottie personalizada
 * - Mensaje de bienvenida corporativo
 * - Overlay que cubre toda la aplicación
 * - Transiciones suaves
 * 
 * Características:
 * - Animación Lottie con colores corporativos
 * - Fondo blanco limpio
 * - Mensaje de marca "DayLog tu app de confianza"
 * - Posicionamiento centrado
 * - Z-index alto para estar por encima de todo
 * 
 * Configuración:
 * - Animación en loop infinito
 * - Autoplay activado
 * - Tamaño de animación 300x300px
 * - Preservación de aspect ratio
 * - Archivo de animación: Loading_Color_Cusca.json
 */

// components/LoadingScreen.jsx

import React from 'react';
import Lottie from 'react-lottie';
import animationData from '../assets/Loading_Color_Cusca.json';  // Asegúrate de poner la ruta correcta a tu archivo JSON de Lottie

const LoadingScreen = () => {
  // Configuración de Lottie
  const defaultOptions = {
    loop: true,
    autoplay: true, 
    animationData: animationData, 
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50 p-4">
      {/* Pantalla de carga con la animación de Lottie */}
      <Lottie options={defaultOptions} height={300} width={300} />
      
      {/* Textos debajo de la animación */}
      <div className="text-center mt-4">
        <p className="text-xl font-semibold text-yellow-400">DayLog tu app de confianza.</p>
      </div>
    </div>
  );
};

export default LoadingScreen;


