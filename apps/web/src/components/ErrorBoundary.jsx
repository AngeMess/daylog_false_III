/**
 * Componente ErrorBoundary - Límite de errores para React
 * 
 * Este componente actúa como un límite de errores (error boundary) que captura
 * errores de JavaScript en cualquier parte del árbol de componentes hijo,
 * los registra y muestra una interfaz de fallback en lugar del árbol de
 * componentes que falló.
 * 
 * Funcionalidades:
 * - Captura errores de JavaScript en componentes hijos
 * - Registra errores en consola para debugging
 * - Muestra interfaz de error amigable al usuario
 * - Proporciona opción de recargar la página
 * - Previene que errores críticos rompan toda la aplicación
 * 
 * Características:
 * - Interfaz de error visualmente atractiva
 * - Mensaje claro y comprensible para el usuario
 * - Botón de acción para recuperación
 * - Logging automático de errores
 * - Manejo de errores en tiempo de ejecución
 * 
 * Uso:
 * - Envuelve componentes que pueden generar errores
 * - Proporciona fallback seguro cuando algo falla
 * - Mejora la experiencia del usuario durante errores
 * - Facilita el debugging de errores en producción
 */

import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center p-8">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Algo salió mal
            </h2>
            <p className="text-gray-600 mb-4">
              No se pudo cargar el componente. Por favor, intenta recargar la página.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
              Recargar página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 