/**
 * Componente DropdownMenu - Menú desplegable personalizable
 * 
 * Este componente crea un menú desplegable que se abre al hacer clic en un botón
 * de tres puntos. Utiliza Radix UI para accesibilidad y funcionalidad robusta,
 * con estilos personalizables según el diseño corporativo.
 * 
 * Funcionalidades:
 * - Menú desplegable con opciones personalizables
 * - Iconos opcionales para cada opción
 * - Colores personalizables para trigger y hover
 * - Posicionamiento automático
 * - Cierre automático al hacer clic fuera
 * 
 * Características:
 * - Accesibilidad completa con Radix UI
 * - Navegación por teclado
 * - Estados hover y focus
 * - Animaciones suaves
 * - Diseño responsivo
 * 
 * Props configurables:
 * - options: Array de opciones con label, icon y onClick
 * - triggerColor: Color del icono de tres puntos
 * - hoverColor: Color al hacer hover
 * - backgroundColor: Color de fondo del menú
 * - iconSize: Tamaño del icono
 * - className: Clases CSS adicionales
 * - triggerClassName: Clases CSS para el trigger
 * 
 * Ejemplo de uso incluido en comentarios del código
 */

import React from 'react';
import { EllipsisVertical } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

/*
EJEMPLO DE USO:

import DropdownMenuComponent from './DropdownMenuComponent';
import { FileText, Trash, Edit } from 'lucide-react';

<DropdownMenuComponent
  options={[
    {
      label: "Mostrar todo",
      icon: FileText,
      onClick: () => handleShowDetails(item)
    },
    {
      label: "Editar",
      icon: Edit,
      onClick: () => handleEdit(item)
    },
    {
      label: "Eliminar",
      icon: Trash,
      onClick: () => handleDelete(item)
    }
  ]}
  triggerColor="#667085"     // Color del ícono de tres puntos
  hoverColor="#D6AC50"       // Color al hacer hover
  backgroundColor="white"    // Fondo del menú
  iconSize={16}             // Tamaño del ícono
/>
*/

const DropdownMenuComponent = ({ 
  options = [], 
  triggerColor = '#667085',
  hoverColor = '#D6AC50',
  backgroundColor = 'white',
  className = '',
  iconSize = 16,
  triggerClassName = ''
}) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <div className="flex justify-end">
          <button 
            className={`inline-flex items-center justify-center h-10 w-10 hover:bg-slate-100 hover:text-[#01426A] transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50 shadow-none ${triggerClassName}`}
            aria-label="Opciones"
          >
            <EllipsisVertical 
              size={iconSize} 
              strokeWidth={2} 
              aria-hidden="true" 
              style={{ color: triggerColor }}
            />
          </button>
        </div>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content 
          align="end" 
          className={`rounded-lg shadow-md p-1 min-w-[120px] z-50 ${className}`}
          style={{ backgroundColor }}
          sideOffset={5}
        >
          {options.map((option, index) => (
            <DropdownMenu.Item 
              key={index}
              className="px-3 py-2 hover:bg-gray-100 transition-all rounded-md cursor-pointer flex items-center"
              style={{ 
                color: triggerColor,
                ':hover': { color: hoverColor }
              }}
              onMouseEnter={(e) => {
                e.target.style.color = hoverColor;
              }}
              onMouseLeave={(e) => {
                e.target.style.color = triggerColor;
              }}
              onClick={option.onClick}
            >
              <span className="text-sm font-medium flex items-center"> 
                {option.icon && (
                  <option.icon 
                    size={18} 
                    strokeWidth={2} 
                    aria-hidden="true" 
                    className="h-4 w-4 mr-2" 
                  />
                )}
                {option.label}
              </span>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default DropdownMenuComponent;