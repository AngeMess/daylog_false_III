import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useEmployeeApi from '../../hooks/useEmployeeApi';
import { ArrowLeft, MessageCircle, Settings } from 'lucide-react';
import CustomHeading from '../../../../components/Titles/TitleH1';
import { Button } from '../../../../components/Buttons';
// Card simple para datos del empleado (estilo minimalista)
function EmployeeMiniCard({ employee }) {
  if (!employee) return null;
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-4 min-w-[220px] max-w-[320px]">
      <div className="flex flex-col items-center mb-2">
        <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center mb-3">
          <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-3.314 0-10 1.657-10 5v3h20v-3c0-3.343-6.686-5-10-5z" fill="#B0B2B8"/></svg>
        </div>
        <h2 className="text-base font-semibold text-center text-[#194167]">Nombre Completo</h2>
        <p className="text-[#194167] text-base">{employee.fullName}</p>
      </div>
      <div className="space-y-2 flex-grow text-[#194167]">
        <div>
          <h3 className="font-semibold text-sm">CuscaID</h3>
          <p className="text-base">{employee.cuscaId}</p>
        </div>
        <div>
          <h3 className="font-semibold text-sm">Correo Electrónico</h3>
          <p className="text-base">{employee.email}</p>
        </div>
        <div>
          <h3 className="font-semibold text-sm">País</h3>
          <p className="text-base">{employee.country}</p>
        </div>
        <div>
          <h3 className="font-semibold text-sm">Área</h3>
          <p className="text-base">{employee.mainAreaArea}</p>
        </div>
        <div>
          <h3 className="font-semibold text-sm">Puesto</h3>
          <p className="text-base">{employee.position}</p>
        </div>
      </div>
    </div>
  );
}

export default function AddReminder() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { employees, loading } = useEmployeeApi();
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [comment, setComment] = useState('');
  const maxChars = 255;

  useEffect(() => {
    if (id && employees) {
      const employee = employees.find(emp => emp._id === id);
      setSelectedEmployee(employee || null);
    }
  }, [id, employees]);

  return (
    <div className="w-full px-4 sm:px-8 py-6">
      <CustomHeading text="Dar recordatorio" color="#194167" className="mb-6 text-2xl sm:text-3xl" />
      <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-stretch w-full">
        <div className="w-full md:min-w-[220px] md:max-w-[320px] md:w-auto flex-shrink-0 mb-4 md:mb-0">
          <EmployeeMiniCard employee={selectedEmployee} />
        </div>
        <div className="flex-1 w-full">
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle className="text-gray-400" size={20} />
            <span className="text-gray-500 text-sm">Comentario</span>
          </div>
          <div className="relative">
            <textarea
              className="w-full min-h-[100px] max-h-[180px] border-b-2 border-gray-300 focus:border-[#194167] outline-none resize-none p-2 text-base rounded-t-md bg-gray-50"
              maxLength={maxChars}
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Escribe tu comentario..."
            />
            <span className="absolute bottom-2 right-4 text-xs text-gray-400">{maxChars - comment.length}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 w-full max-w-2xl mx-auto">
        <Button
          variant="btn_secondary"
          className="w-full sm:w-auto justify-center"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={18} /> Cancelar
        </Button>
        <Button
          variant="btn_primary"
          className="w-full sm:w-auto justify-center"
          onClick={() => alert('Feedback enviado (mock)')}
        >
          <Settings size={18} /> Dar recordatorio
        </Button>
      </div>
    </div>
  );
} 