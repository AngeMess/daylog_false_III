import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useEmployeeApi from '../../hooks/useEmployeeApi';
import EmployeeInfoCard from '../../../../roles/admin/components/CardsEmployee/EmployeeInfoCard';

function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm flex flex-col items-center w-full">
      <span className="text-sm text-gray-500 mb-1">{title}</span>
      <span className="text-2xl font-bold text-[#194167]">{value}</span>
    </div>
  );
}

function ProjectCard({ name, status, tag, user, trend }) {
  const statusColor = status === 'Por Hacer' ? 'bg-blue-100 text-blue-800' : status === 'En Progreso' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800';
  const trendColor = trend === '↑' ? 'text-green-600' : 'text-red-500';
  return (
    <div className="border rounded-lg p-3 mb-2 bg-white">
      <div className="flex items-center gap-2 mb-1">
        <span className={`${statusColor} text-xs px-2 py-0.5 rounded-full`}>{status}</span>
        <span className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-full">{tag}</span>
        <span className={`ml-auto font-bold ${trendColor}`}>{trend}</span>
      </div>
      <div className="text-sm font-semibold text-[#194167]">{name}</div>
      <div className="flex items-center gap-2 mt-1">
        <span className="text-xs text-gray-500">{user}</span>
      </div>
    </div>
  );
}

function CircularRating({ percent, size = 48 }) {
  const radius = size;
  const stroke = 8;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percent / 100) * circumference;
  return (
    <svg height={radius * 2} width={radius * 2} className="block mx-auto">
      <circle
        stroke="#E5E7EB"
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        stroke="#D6AC50"
        fill="transparent"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference + ' ' + circumference}
        style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.35s' }}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".3em"
        fontSize={size * 0.6}
        fill="#222"
        fontWeight="bold"
      >
        {percent}%
      </text>
    </svg>
  );
}

export default function EmployeeDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { employees, loading, error } = useEmployeeApi();
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    if (id && employees) {
      const employee = employees.find(emp => emp._id === id);
      setSelectedEmployee(employee || null);
    }
  }, [id, employees]);

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p>Cargando datos del empleado...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        <p>Error al cargar los datos del empleado</p>
      </div>
    );
  }

  if (!selectedEmployee) {
    return (
      <div className="p-6 text-center">
        <p>Dato no encontrado</p>
      </div>
    );
  }

  // MOCK DATA para la columna derecha
  const mockProjects = [
    { name: 'Creación de sistema web', status: 'Por Hacer', tag: 'Tecnología', user: 'Luis Fernando Palomo', trend: '↑' },
    { name: 'Implementación CRM', status: 'En Progreso', tag: 'Ventas', user: 'Ana Martínez', trend: '↓' },
    { name: 'Actualización App Móvil', status: 'Finalizado', tag: 'Mobile', user: 'Carlos López', trend: '↑' },
    { name: 'Migración a la nube', status: 'Por Hacer', tag: 'Infraestructura', user: 'Sofía Torres', trend: '↓' },
  ];

  return (
    <div className="p-6 w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Columna 1: Información personal */}
        <EmployeeInfoCard selectedEmployee={selectedEmployee} />
        {/* Columna central: Horas compensatorias y proyectos */}
        <div className="flex flex-col gap-4 w-full h-full">
          <StatCard title="Horas compensatorias" value="160h" />
          <div className="bg-white rounded-xl p-4 shadow-sm flex flex-col flex-1 min-h-[420px] h-full">
            <span className="text-sm text-gray-500 mb-2 font-semibold">Proyectos</span>
            <div className="flex-1 overflow-y-auto max-h-[340px] pr-1">
              {mockProjects.map((p, i) => <ProjectCard key={i} {...p} />)}
            </div>
          </div>
        </div>
        {/* Columna derecha: Total horas y las otras cards apiladas */}
        <div className="flex flex-col gap-8 w-full max-w-sm min-w-[260px] mx-auto">
          <StatCard title="Total horas trabajadas" value="160h" />
          <div className="bg-white rounded-xl p-6 shadow-sm flex flex-col items-center w-full min-h-[100px] justify-center">
            <span className="text-base text-gray-500 font-semibold">Proyectos externos</span>
            <div className="text-[#194167] font-bold mt-2">Guatemala</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm flex flex-col items-center w-full min-h-[100px] justify-center">
            <span className="text-base text-gray-500 font-semibold">Equipo de trabajo</span>
            <div className="text-[#194167] font-bold mt-2">LEGENDS</div>
          </div>
          <div className="bg-white rounded-xl p-8 shadow-sm flex flex-col items-center w-full min-h-[180px] justify-center">
            <span className="text-base text-gray-500 font-semibold mb-4">Valoraciones</span>
            <CircularRating percent={46} size={60} />
          </div>
        </div>
      </div>
    </div>
  );
} 