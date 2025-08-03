// AreaCard.jsx
import React from 'react';
import { Layers, Triangle, FileText, Trash } from 'lucide-react';
import DropdownMenuComponent from '../../../../components/DropdownMenu/DropdownMenu';

const AreaCard = ({ area, onShowDetail, onDelete }) => {
  return (
    <div
      key={area._id}
      className="bg-white rounded-3xl shadow-lg p-8 flex flex-col items-start justify-center text-left backdrop-blur-md bg-white/90 border border-white/20 relative
        sm:p-6 md:p-8 max-md:p-6 max-[430px]:p-3 max-w-full w-full min-w-0"
    >
      <div className="flex items-center mb-2 w-full max-[430px]:flex-col max-[430px]:text-center max-[430px]:w-full">
        <div className="flex items-center gap-2 mr-2 max-[430px]:mr-0 max-[430px]:mb-2">
          {area.mainAreaName && area.areaName ? (
            <Layers size={20} className="text-[#01426A]" />
          ) : (
            <Triangle size={20} className="text-[#01426A]" />
          )}
        </div>
        <h4 className="text-lg font-semibold mb-2 truncate max-w-[70vw] max-md:text-base max-[768px]:leading-tight max-[430px]:text-base max-[430px]:w-full max-[430px]:mb-2">
          {area.displayName}
        </h4>
      </div>
      <div className="mb-4 space-y-1 mt-auto w-full max-md:text-sm max-[768px]:mt-2 max-[430px]:text-xs max-[430px]:w-full max-[430px]:text-center max-[430px]:mt-2">
        {area.mainAreaName && (
          <p className="text-sm break-words" style={{ color: '#01426A' }}>
            <strong>Área Principal:</strong> {area.mainAreaName}
          </p>
        )}
        {area.areaName && (
          <p className="text-sm text-green-600 break-words">
            <strong>Área:</strong> {area.areaName}
          </p>
        )}
        <p className="text-sm text-gray-500"><strong>Empleados:</strong> {area.amountEmployee}</p>
        <p className="text-sm text-gray-500"><strong>Creado:</strong> {new Date(area.createdAt).toLocaleDateString()}</p>
      </div>
      <div className="w-full flex justify-end mt-4 relative z-10 max-[430px]:static max-[430px]:mt-2 max-[430px]:w-full">
        <DropdownMenuComponent
          options={[
            {
              label: "Mostrar todo",
              icon: FileText,
              onClick: () => onShowDetail(area)
            },
            {
              label: "Eliminar",
              icon: Trash,
              onClick: () => onDelete(area)
            }
          ]}
          triggerColor="#667085"
          hoverColor="#D6AC50"
          backgroundColor="white"
          iconSize={16}
        />
      </div>
    </div>
  );
};

export default AreaCard;