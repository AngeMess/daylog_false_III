import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useToast } from '../context/ToastContext'; // Asegúrate de que la ruta sea correcta
import { CheckCircle, AlertTriangle, Hand, Info } from 'lucide-react';

const ToastContainer = () => {
  const { toasts, removeToast, triggerNextPageToasts } = useToast();
  const location = useLocation();

  // Trigger toasts that are waiting for the next page
  useEffect(() => {
    triggerNextPageToasts();
  }, [location.pathname, triggerNextPageToasts]);

  const getToastStyles = (type) => {
    switch (type) {
      case 'error':
        return 'bg-red-100 text-red-600';
      case 'success':
        return 'bg-[#A3D9A5] text-[#065F46]';
      case 'warning':
        return 'bg-yellow-100 text-yellow-700';
      case 'info':
        return 'bg-blue-100 text-blue-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getToastIcon = (type) => {
    switch (type) {
      case 'error':
        return <AlertTriangle className="toast-icon" />;
      case 'success':
        return <CheckCircle className="toast-icon" />;
      case 'warning':
        return <Hand className="toast-icon" />;
      case 'info':
        return <Info className="toast-icon" />;
      default:
        return <Info className="toast-icon" />;
    }
  };

  const getPositionStyles = (position) => {
    switch (position) {
      case 'top-center':
        return 'toast-container toast-top-center';
      case 'top-right':
        return 'toast-container toast-top-right';
      case 'top-right-centered': // Nueva posición como la del screenshot
        return 'toast-container toast-top-right-centered';
      case 'bottom-center':
        return 'toast-container toast-bottom-center';
      case 'bottom-right':
        return 'toast-container toast-bottom-right';
      case 'top-left':
        return 'toast-container toast-top-left';
      case 'bottom-left':
        return 'toast-container toast-bottom-left';
      default:
        return 'toast-container toast-top-right-centered'; // Por defecto la nueva posición
    }
  };

  // Agrupar toasts por posición
  const toastsByPosition = toasts.reduce((acc, toast) => {
    const position = toast.position || 'top-right-centered'; // Por defecto la nueva posición
    if (!acc[position]) {
      acc[position] = [];
    }
    acc[position].push(toast);
    return acc;
  }, {});

  return (
    <>
      {Object.entries(toastsByPosition).map(([position, positionToasts]) => (
        <div key={position} className={getPositionStyles(position)}>
          <div className="toast-group">
            {positionToasts.map((toast) => (
              <div
                key={toast.id}
                className={`toast-item ${getToastStyles(toast.type)}`}
              >
                {getToastIcon(toast.type)}
                <span className="toast-message">{toast.message}</span>
                {toast.closable !== false && (
                  <button
                    onClick={() => removeToast(toast.id)}
                    className="toast-close"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
      
      {/* Estilos CSS para animaciones y responsive */}
      <style jsx>{`
        .toast-container {
          position: fixed;
          z-index: 50;
        }
        
        .toast-top-center {
          top: 1rem;
          left: 50%;
          transform: translateX(-50%);
        }
        
        .toast-top-right {
          top: 1rem;
          right: 1rem;
        }
        
        /* Nueva posición centrada superior derecha como en la imagen */
        .toast-top-right-centered {
          top: 1rem;
          right: 50%;
          transform: translateX(50%);
        }
        
        .toast-bottom-center {
          bottom: 1rem;
          left: 50%;
          transform: translateX(-50%);
        }
        
        .toast-bottom-right {
          bottom: 1rem;
          right: 1rem;
        }
        
        .toast-top-left {
          top: 1rem;
          left: 1rem;
        }
        
        .toast-bottom-left {
          bottom: 1rem;
          left: 1rem;
        }
        
        .toast-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .toast-item {
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          font-weight: 500;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          z-index: 20;
          animation: toastSlideUp 0.3s ease-out forwards;
          min-width: 240px;
          max-width: 320px;
        }
        
        .toast-icon {
          width: 16px;
          height: 16px;
          flex-shrink: 0;
        }
        
        .toast-message {
          flex: 1;
          word-wrap: break-word;
        }
        
        .toast-close {
          margin-left: 0.5rem;
          color: currentColor;
          opacity: 0.7;
          background: none;
          border: none;
          font-size: 1.1rem;
          line-height: 1;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        
        .toast-close:hover {
          opacity: 1;
        }
        
        @keyframes toastSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Media queries para pantallas pequeñas */
        @media (max-width: 640px) {
          .toast-top-right {
            top: 0.5rem;
            right: 0.5rem;
          }
          
          .toast-top-right-centered {
            top: 0.5rem;
            right: 50%;
            transform: translateX(50%);
          }
          
          .toast-item {
            padding: 0.625rem 0.875rem;
            font-size: 0.75rem;
            min-width: 200px;
            max-width: 280px;
            gap: 0.5rem;
          }
          
          .toast-icon {
            width: 14px;
            height: 14px;
          }
          
          .toast-close {
            font-size: 1rem;
            margin-left: 0.25rem;
          }
          
          .toast-group {
            gap: 0.375rem;
          }
        }
        
        /* Media queries para pantallas muy pequeñas */
        @media (max-width: 480px) {
          .toast-top-right-centered {
            top: 0.5rem;
            right: 50%;
            transform: translateX(50%);
          }
          
          .toast-item {
            padding: 0.5rem 0.75rem;
            font-size: 0.7rem;
            border-radius: 0.375rem;
            min-width: 180px;
            max-width: 240px;
          }
          
          .toast-icon {
            width: 12px;
            height: 12px;
          }
          
          .toast-close {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </>
  );
};

export default ToastContainer;