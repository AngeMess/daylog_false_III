import React from 'react';
import { EllipsisVertical, Edit, Trash2 } from 'lucide-react'; 
import DropdownMenuComponent from '../../../../components/DropdownMenu/DropdownMenu';

const GenericAreaCard = ({ area, icon: Icon, onUpdate, onDelete }) => {
  const options = [
    {
      label: 'Actualizar',
      icon: Edit,
      onClick: () => onUpdate(area),
    },
    {
      label: 'Eliminar',
      icon: Trash2,
      onClick: () => onDelete(area),
    },
  ];

  return (
    <div key={area._id} className="bg-white rounded-3xl shadow-md p-6 flex flex-col items-center justify-center text-center h-44 relative overflow-hidden">
      {/* Dropdown Menu */}
      <div className="absolute top-3 right-3">
        <DropdownMenuComponent
          options={options}
          triggerColor="#667085" // Color del ícono de tres puntos
          hoverColor="#D6AC50" // Color al hacer hover
          backgroundColor="white" // Fondo del menú
          iconSize={16}
        />
      </div>

      {Icon && <Icon size={24} className="text-gray-600 mb-3" strokeWidth={1.5} />}
      <p className="text-sm text-gray-700 font-medium">{area.name}</p>
      {area.createdAt && (
        <p className="text-xs text-gray-500 mt-1">Creado: {new Date(area.createdAt).toLocaleDateString()}</p>
      )}
    </div>
  );
};

export default GenericAreaCard;