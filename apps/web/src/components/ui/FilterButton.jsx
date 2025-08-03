import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Button } from '../../roles/admin/pages/EmployeeManagement/tableEmployees/Button';

/**
 * Componente de botón de filtro con menú desplegable
 * 
 * Este componente proporciona una interfaz de filtrado con un botón que despliega
 * un menú de opciones. Es altamente personalizable y puede incluir iconos,
 * contenido personalizado y diferentes estilos de presentación.
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.label - Texto del botón principal
 * @param {Array} props.options - Array de opciones del menú desplegable
 * @param {string} props.options[].value - Valor único de la opción
 * @param {string} props.options[].label - Texto visible de la opción
 * @param {Function} props.onSelect - Función que se ejecuta cuando se selecciona una opción
 * @param {string} [props.selectedValue] - Valor actualmente seleccionado
 * @param {string} [props.title] - Título opcional del menú desplegable
 * @param {React.Component} [props.icon] - Componente de icono para el botón
 * @param {React.ReactNode} [props.customContent] - Contenido personalizado para el menú
 * @returns {JSX.Element} El componente FilterButton renderizado
 * 
 * @example
 * // Filtro básico con opciones
 * <FilterButton
 *   label="Filtrar por país"
 *   options={[
 *     { value: 'elsalvador', label: 'El Salvador' },
 *     { value: 'guatemala', label: 'Guatemala' },
 *     { value: 'honduras', label: 'Honduras' }
 *   ]}
 *   onSelect={(value) => console.log('Seleccionado:', value)}
 *   selectedValue="elsalvador"
 * />
 * 
 * // Filtro con icono y contenido personalizado
 * <FilterButton
 *   label="Filtros avanzados"
 *   icon={FilterIcon}
 *   customContent={<CustomFilterContent />}
 *   onSelect={handleFilterSelect}
 * />
 */
const FilterButton = ({ 
  label, 
  options, 
  onSelect, 
  selectedValue,
  title,
  icon: Icon,
  customContent,
}) => {
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  
  /**
   * Maneja la selección de una opción del menú
   * @param {Object} option - Opción seleccionada
   */
  const handleOptionSelect = (option) => {
    onSelect(option.value);
    setShowFilterMenu(false);
  };

  return (
    <DropdownMenu.Root open={showFilterMenu} onOpenChange={setShowFilterMenu}>
      <DropdownMenu.Trigger asChild>
        <Button variant="btn_g" className="flex items-center gap-2 w-full md:w-auto justify-between">
          <div className="flex items-center">
            {Icon && (
              <Icon
                className="-ms-1 me-2 opacity-100"
                size={20}
                strokeWidth={2}
                aria-hidden="true"
              />
            )}
            {label}
          </div>
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content align="start" className="bg-white rounded-lg shadow-md p-4 min-w-[300px] z-50">
        {customContent ? (
          customContent
        ) : (
          <div className="grid grid-cols-1">
            <div>
              {title && <h3 className="text-sm font-semibold text-[#194167]">{title}</h3>}
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {options.map((option) => (
                  <div 
                    key={option.value} 
                    className="flex items-center cursor-pointer hover:bg-gray-50 hover:text-[#D6AC50] transition-all px-2 py-1 rounded text-[#667085]"
                    onClick={() => handleOptionSelect(option)}
                  >
                    <span className={`text-sm ${selectedValue === option.value ? 'text-[#D6AC50] font-medium' : ''}`}>
                      {option.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

FilterButton.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ),
  onSelect: PropTypes.func.isRequired,
  selectedValue: PropTypes.string,
  title: PropTypes.string,
  icon: PropTypes.elementType,
  customContent: PropTypes.node,
};

export default FilterButton;
