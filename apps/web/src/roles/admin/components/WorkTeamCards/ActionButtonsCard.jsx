import React from 'react';
import { Button } from '../../../../components/Buttons'; 

export default function ActionButtonsCard({ children, onVolver, isEditing, saving, handleCancelEdit, handleSaveEdit, handleEditTeam, handleToggleActiveStatus, toggling, isActive }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 bg-white rounded-lg p-4 shadow-sm gap-4 sm:gap-0">
      {/* Botón Volver - Conditionally rendered */}
      {!isEditing && (
        <Button variant="btn_secondary" type="button" onClick={onVolver}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          Volver
        </Button>
      )}

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
        {isEditing ? (
          // BOTONES DE LA SEGUNDA PANTALLA (MODO EDICIÓN)
          <>
            <Button
              variant="btn_secondary" 
              type="button"
              disabled={saving}
              onClick={handleCancelEdit}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <path d="M18 6L6 18M6 6l12 12"></path>
              </svg>
              Cancelar
            </Button>
            <Button
              variant="btn_primary" 
              type="button"
              disabled={saving}
              onClick={handleSaveEdit}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              {saving ? "Guardando..." : "Guardar"}
            </Button>
          </>
        ) : (
          // BOTONES DE LA PRIMERA PANTALLA (MODO LECTURA)
          <>
            <Button
              variant="btn_primary" 
              type="button"
              onClick={handleEditTeam}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
              Editar equipo
            </Button>

            <button
              onClick={handleToggleActiveStatus}
              disabled={toggling}
              className={`py-2 px-4
              sm:py-2.5 sm:px-5
              lg:py-3 lg:px-6
              font-medium rounded-full transition-all duration-300 border border-transparent shadow-sm hover:shadow-md flex items-center justify-center disabled:opacity-50 text-sm sm:text-base
              ${
                isActive
                  ? "bg-gray-200 text-gray-700 hover:bg-gray-600 hover:text-white"
                  : "bg-green-100 text-green-700 hover:bg-green-600 hover:text-white"
              }
              w-full sm:w-auto flex-grow sm:flex-initial`}
            >
              {isActive ? (
                <>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                  </svg>
                  <span className="hidden lg:inline">
                    {toggling ? "Deshabilitando..." : "Deshabilitar equipo"}
                  </span>
                  <span className="hidden sm:inline lg:hidden">
                    {toggling ? "Deshabilitando..." : "Deshabilitar"}
                  </span>
                  <span className="inline sm:hidden">
                    {toggling ? "Deshabilitando..." : "Deshabilitar"}
                  </span>
                </>
              ) : (
                <>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="9,12 12,15 16,10"></polyline>
                  </svg>
                  <span className="hidden lg:inline">
                    {toggling ? "Habilitando..." : "Habilitar equipo"}
                  </span>
                  <span className="hidden sm:inline lg:hidden">
                    {toggling ? "Habilitando..." : "Habilitar"}
                  </span>
                  <span className="inline sm:hidden">
                    {toggling ? "Habilitando..." : "Habilitar"}
                  </span>
                </>
              )}
            </button>
          </>
        )}
      </div>
      {children}
    </div>
  );
}