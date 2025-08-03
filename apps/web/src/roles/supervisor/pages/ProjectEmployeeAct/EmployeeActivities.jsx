import React from 'react';
import { motion as MotionComponent } from 'framer-motion';
import { User, Users, Eye, EyeOff, CircleArrowLeft, CircleCheck, CircleX, } from 'lucide-react';
import { Button } from '../../../../components/Buttons';
import ProjectActivitiesTable from '../../../../components/Projects/ProjectActivitiesTable';
import { useNavigate } from 'react-router-dom';

export default function EmployeeActivities() {
  const navigate = useNavigate();

  // Datos estáticos del empleado
  const employeeData = {
    fullName: "Ana García",
    cuscaId: "CUS-002",
    email: "ana.garcia@empresa.com",
    country: "El Salvador",
    inmediateBoss: "Carlos López",
    subManager: "Ethan Henríquez",
    mainAreaArea: "Desarrollo Frontend",
    daylogRol: "Desarrollador",
    position: "Desarrollador Senior",
    isActive: true
  };

  // Datos estáticos de equipos
  const workTeams = [
    {
      _id: "team-1",
      name: "Desarrollo Web",
      teamType: "Desarrollo",
      mainArea: "Desarrollo",
      subArea: "Frontend",
      supervisorName: "Carlos López"
    },
    {
      _id: "team-2",
      name: "Soporte Técnico",
      teamType: "Soporte",
      mainArea: "Soporte",
      subArea: "Técnico",
      supervisorName: "Ana García"
    }
  ];

  const activities = [
    {
      id: 1,
      actividad: "Desarrollo de componente de tabla",
      fecha: "2025-07-01",
      horas: 8,
      proyecto: "Desarrollo Web"
    },
    {
      id: 2,
      actividad: "Revisión de código",
      fecha: "2025-07-02",
      horas: 2,
      proyecto: "Desarrollo Web"
    },
    {
      id: 3,
      actividad: "Implementación de pruebas",
      fecha: "2025-07-03",
      horas: 3,
      proyecto: "Desarrollo Web"
    }
  ];

  return (
    <div className="p-4 sm:p-6 w-full">
      <MotionComponent.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 lg:grid-cols-[450px_1fr] gap-6"
      >
        {/* Columna 1: Información personal */}
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm h-full flex flex-col">
          <div className="flex flex-col items-center mb-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <User size={24} sm:size={32} className="text-gray-600" />
            </div>
            <h2 className="text-lg font-semibold text-center text-[#194167]">Nombre Completo</h2>
            <p className="text-[#194167]">{employeeData.fullName}</p>
          </div>
          {employeeData.isActive ? (
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
              <p>{employeeData.cuscaId}</p>
            </div>

            <div>
              <h3 className="font-semibold">Correo Electrónico</h3>
              <p>{employeeData.email}</p>
            </div>

            <div>
              <h3 className="font-semibold">País</h3>
              <p>{employeeData.country}</p>
            </div>

            <div>
              <h3 className="font-semibold">Jefe Inmediato</h3>
              <p>{employeeData.inmediateBoss}</p>
            </div>

            <div>
              <h3 className="font-semibold">Sub Gerente</h3>
              <p>{employeeData.subManager}</p>
            </div>

            <div>
              <h3 className="font-semibold">Área</h3>
              <p>{employeeData.mainAreaArea}</p>
            </div>

            <div>
              <h3 className="font-semibold">Rol</h3>
              <p>{employeeData.daylogRol}</p>
            </div>

            <div>
              <h3 className="font-semibold">Puesto</h3>
              <p>{employeeData.position}</p>
            </div>

            <div>
              <Button className="mr-auto" variant="btn_secondary" onClick={() => navigate('/supervisor/proyectos/detalle-proyecto')}>
                <CircleArrowLeft size={20} />
                Volver
              </Button>
            </div>
          </div>
        </div>

        {/* Columna 2: Tabla de actividades */}
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
          <ProjectActivitiesTable activities={activities} />
        </div>
      </MotionComponent.div>
    </div>
  );
}