import React from 'react';

/**
 * Componente modal de confirmación reutilizable
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.title - Título del modal
 * @param {string} props.message - Mensaje principal del modal
 * @param {string} [props.warningText] - Texto de advertencia opcional (en rojo)
 * @param {string} [props.cancelButtonText='Cancelar'] - Texto del botón de cancelar
 * @param {string} [props.confirmButtonText='Eliminar'] - Texto del botón de confirmación
 * @param {string} [props.confirmButtonColor='#ff0d4f'] - Color del botón de confirmación
 * @param {Function} props.onCancel - Función a ejecutar cuando se cancela
 * @param {Function} props.onConfirm - Función a ejecutar cuando se confirma
 * @param {boolean} props.isOpen - Si el modal está abierto o cerrado
 * @returns {JSX.Element|null} El componente Modal o null si está cerrado
 */
const ConfirmationModal = ({ 
  title,
  message,
  warningText,
  cancelButtonText = 'Cancelar',
  confirmButtonText = 'Eliminar',
  confirmButtonColor = '#ff0d4f',
  onCancel,
  onConfirm,
  isOpen
}) => {
  // Si el modal no está abierto, no renderizamos nada
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-md z-50 flex justify-center items-center" style={{ backdropFilter: 'blur(8px)' }}>
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
        {/* Encabezado con icono y título */}
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0 mr-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="9" stroke="#ff0d4f" strokeWidth="2" />
              <path d="M12 7V13" stroke="#ff0d4f" strokeWidth="2" strokeLinecap="round" />
              <circle cx="12" cy="16" r="1" fill="#ff0d4f" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        </div>
        
        {/* Contenido del modal */}
        <div className="mb-5">
          <p className="text-sm text-gray-600 mb-2">{message}</p>
          {warningText && (
            <p className="text-sm text-red-500">{warningText}</p>
          )}
        </div>
        
        {/* Botones de acción */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            {cancelButtonText}
          </button>
          <button
            onClick={onConfirm}
            style={{ backgroundColor: confirmButtonColor }}
            className="px-4 py-2 text-white rounded-md hover:opacity-90 transition-opacity"
          >
            {confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
