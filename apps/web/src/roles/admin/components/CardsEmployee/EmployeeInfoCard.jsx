import React from 'react';
import { User, CircleCheck, CircleX, CircleArrowLeft } from 'lucide-react';
import { Button } from '../../../../components/Buttons';
import { useNavigate } from 'react-router-dom';

export default function EmployeeInfoCard({ selectedEmployee }) {
  const navigate = useNavigate();

  if (!selectedEmployee) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm h-full flex flex-col items-center justify-center">
        <p className="text-gray-500">No hay información del empleado para mostrar.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm h-full flex flex-col">
      <div className="flex flex-col items-center mb-4">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
          <User size={32} className="text-gray-600" />
        </div>
        <h2 className="text-lg font-semibold text-center text-[#194167]">Nombre Completo</h2>
        <p className="text-[#194167]">{selectedEmployee.fullName || 'Dato no encontrado'}</p>
      </div>
      {selectedEmployee.isActive ? (
        <div className="bg-[#DFF5E7] text-[#0B6B35] rounded-full py-2 px-4 flex justify-center items-center mb-6">
          <CircleCheck
            className="-ms-1 me-2 opacity-100"
            size={22}
            strokeWidth={2}
            aria-hidden="true"
          />
          <span className="text-base font-normal">Habilitado</span>
        </div>
      ) : (
        <div className="bg-[#B6B8BD] text-[#4F4F4F] rounded-full py-2 px-4 flex justify-center items-center mb-6">
          <CircleX
            className="-ms-1 me-2 opacity-100"
            size={22}
            strokeWidth={2}
            aria-hidden="true"
          />
          <span className="text-base font-normal">Inhabilitado</span>
        </div>
      )}
      <div className="space-y-4 flex-grow text-[#194167]">
        <div>
          <h3 className="font-semibold">CuscaID</h3>
          <p>{selectedEmployee.cuscaId || 'Dato no encontrado'}</p>
        </div>

        <div>
          <h3 className="font-semibold">Correo Electrónico</h3>
          <p>{selectedEmployee.email || 'Dato no encontrado'}</p>
        </div>

        <div>
          <h3 className="font-semibold">País</h3>
          <p>{selectedEmployee.country || 'País no asignado'}</p>
        </div>

        <div>
          <h3 className="font-semibold">Jefe Inmediato</h3>
          <p>{selectedEmployee.inmediateBoss || 'Sin jefe asignado'}</p>
        </div>

        <div>
          <h3 className="font-semibold">Sub Gerente</h3>
          <p>{selectedEmployee.subManager || 'Sin subgerente asignado'}</p>
        </div>

        <div>
          <h3 className="font-semibold">Área</h3>
          <p>{selectedEmployee.mainAreaArea || 'Sin área asignada'}</p>
        </div>

        <div>
          <h3 className="font-semibold">Rol</h3>
          <p>{selectedEmployee.daylogRol || 'Rol no asignado'}</p>
        </div>

        <div>
          <h3 className="font-semibold">Puesto</h3>
          <p>{selectedEmployee.position || 'Dato no encontrado'}</p>
        </div>

        <div>
          <Button className="mr-auto" variant="btn_secondary" onClick={() => navigate('/admin/gestionEmpleados')}>
            <CircleArrowLeft size={20} />
            Volver
          </Button>
        </div>
      </div>
    </div>
  );
}