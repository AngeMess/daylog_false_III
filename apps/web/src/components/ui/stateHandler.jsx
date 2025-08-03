import React from 'react';
import { AlertCircle, RefreshCw, Triangle } from 'lucide-react';

// Estilos CSS para hacer el LoadingState responsive
const loadingStyles = `
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem;
    min-height: 140px;
  }
  
  .loading-spinner {
    position: relative;
    width: 64px;
    height: 64px;
    margin-bottom: 1.5rem;
    flex-shrink: 0;
  }
  
  .loading-spinner-ring {
    position: absolute;
    inset: 0;
    border: 4px solid #dbeafe;
    border-radius: 50%;
  }
  
  .loading-spinner-active {
    position: absolute;
    inset: 0;
    border: 4px solid transparent;
    border-top-color: #2563eb;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  .loading-text {
    color: #4b5563;
    font-weight: 500;
    font-size: 1rem;
    text-align: center;
    padding: 0 0.5rem;
    max-width: 384px;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  /* Media queries para pantallas pequeñas */
  @media (max-width: 640px) {
    .loading-container {
      padding: 1.5rem 1rem;
      min-height: 80px;
    }
    
    .loading-spinner {
      width: 48px;
      height: 48px;
      margin-bottom: 0;
    }
    
    .loading-spinner-ring {
      border-width: 3px;
    }
    
    .loading-spinner-active {
      border-width: 3px;
    }
    
    .loading-text {
      display: none;
    }
  }
`;

// Inyectar estilos al head
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = loadingStyles;
  document.head.appendChild(styleSheet);
}

// Componente para estado de carga
export const LoadingState = ({ message = "Cargando..." }) => (
  <div className="loading-container">
    <div className="loading-spinner">
      <div className="loading-spinner-ring"></div>
      <div className="loading-spinner-active"></div>
    </div>
    <p className="loading-text">{message}</p>
  </div>
);

// Componente para estado de error
export const ErrorState = ({ 
  message = "Ha ocurrido un error", 
  onRetry,
  showRetryButton = true 
}) => (
  <div className="flex flex-col items-center justify-center py-8 px-4 sm:py-12 bg-red-50 rounded-lg border border-red-200 mx-4 sm:mx-0">
    <div className="bg-red-100 p-2 sm:p-3 rounded-full mb-3 sm:mb-4">
      <AlertCircle className="text-red-600 w-6 h-6 sm:w-8 sm:h-8" />
    </div>
    <h3 className="text-base sm:text-lg font-semibold text-red-700 mb-2 text-center">Error</h3>
    <p className="text-red-600 text-center mb-4 max-w-md text-sm sm:text-base px-2">{message}</p>
    {showRetryButton && onRetry && (
      <button 
        onClick={onRetry}
        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center gap-2 text-sm sm:text-base min-w-0 w-full sm:w-auto max-w-xs justify-center"
      >
        <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
        <span className="truncate">Intentar nuevamente</span>
      </button>
    )}
  </div>
);

// Componente para estado vacío
export const EmptyState = ({ 
  message = "No hay elementos disponibles", 
  description,
  actionButton,
  icon: Icon = Triangle,
  iconColor = "text-gray-400"
}) => (
  <div className="flex flex-col items-center justify-center py-8 px-4 sm:py-12 bg-gray-50 rounded-lg mx-4 sm:mx-0">
    <div className="bg-gray-100 p-2 sm:p-3 rounded-full mb-3 sm:mb-4">
      <Icon className={`w-6 h-6 sm:w-8 sm:h-8 ${iconColor}`} />
    </div>
    <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2 text-center px-2">{message}</h3>
    {description && (
      <p className="text-gray-500 text-center mb-4 max-w-md text-sm sm:text-base px-2 leading-relaxed">{description}</p>
    )}
    {actionButton && (
      <div className="mt-2 w-full sm:w-auto max-w-xs">
        {React.cloneElement(actionButton, {
          className: `${actionButton.props.className || ''} w-full sm:w-auto justify-center text-sm sm:text-base`.trim()
        })}
      </div>
    )}
  </div>
);