import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import {
  Clock,
  Calendar,
  PenLine,
  X,
  Check,
  AlertCircle,
  AlertTriangle
} from 'lucide-react';
import FormInput from '../../../../components/ui/FormInput';
import '../../../../components/Toast.css';
import CustomHeading from '../../../../components/Titles/TitleH1';
import { Button } from "../../../../components/Buttons";

const AddActivity = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombreActividad: '',
    horaInicio: '',
    horaFin: '',
    fechaInicio: '',
    fechaFin: '',
    comentario: ''
  });

  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [showWarningToast, setShowWarningToast] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar campos requeridos
    if (!formData.nombreActividad || !formData.horaInicio || !formData.horaFin || !formData.fechaInicio || !formData.fechaFin) {
      setShowErrorToast(true);
      return;
    }

    try {
      // Aquí iría la lógica para enviar los datos al backend
      // Por ahora solo mostramos un toast de éxito
      setShowSuccessToast(true);
      
      // Limpiar el formulario después de enviar
      setFormData({
        nombreActividad: '',
        horaInicio: '',
        horaFin: '',
        fechaInicio: '',
        fechaFin: '',
        comentario: ''
      });
    } catch (error) {
      console.error('Error al agregar actividad:', error);
      setShowErrorToast(true);
    }
  };

  return (
    <div className="p-6">
      <CustomHeading
        text="Agregar Actividad"
        color="#01426A"
      />

      <div className="mt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre de actividad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <PenLine size={16} className="inline mr-1" />
              Nombre de actividad
            </label>
            <FormInput
              id="nombreActividad"
              type="text"
              value={formData.nombreActividad}
              onChange={handleChange}
              placeholder="Ingrese el nombre de la actividad"
              required
            />
          </div>

          {/* Hora de inicio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Clock size={16} className="inline mr-1" />
              Hora de inicio
            </label>
            <FormInput
              id="horaInicio"
              type="time"
              value={formData.horaInicio}
              onChange={handleChange}
              required
            />
          </div>

          {/* Hora de fin */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Clock size={16} className="inline mr-1" />
              Hora de fin
            </label>
            <FormInput
              id="horaFin"
              type="time"
              value={formData.horaFin}
              onChange={handleChange}
              required
            />
          </div>

          {/* Fecha de inicio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Calendar size={16} className="inline mr-1" />
              Fecha de inicio
            </label>
            <FormInput
              id="fechaInicio"
              type="date"
              value={formData.fechaInicio}
              onChange={handleChange}
              required
            />
          </div>

          {/* Fecha de fin */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Calendar size={16} className="inline mr-1" />
              Fecha de fin
            </label>
            <FormInput
              id="fechaFin"
              type="date"
              value={formData.fechaFin}
              onChange={handleChange}
              required
            />
          </div>

          {/* Comentario */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <PenLine size={16} className="inline mr-1" />
              Comentario
            </label>
            <textarea
              id="comentario"
              value={formData.comentario}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingrese un comentario..."
              rows={4}
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3">
            <Button variant="btn_secondary" onClick={() => navigate(-1)}>
              <X size={18} className="mr-2" />
              Cancelar
            </Button>
            <Button variant="btn_primary" type="submit">
              <Check size={18} className="mr-2" />
              Guardar
            </Button>
          </div>
        </form>
      </div>

      {/* Toasts */}
      {showSuccessToast && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg">
          <div className="flex items-center">
            <Check size={20} className="mr-3" />
            <span>Actividad agregada exitosamente</span>
          </div>
        </div>
      )}

      {showErrorToast && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg">
          <div className="flex items-center">
            <AlertCircle size={20} className="mr-3" />
            <span>Por favor complete todos los campos requeridos</span>
          </div>
        </div>
      )}

      {showWarningToast && (
        <div className="fixed bottom-4 right-4 bg-yellow-500 text-white p-4 rounded-lg shadow-lg">
          <div className="flex items-center">
            <AlertTriangle size={20} className="mr-3" />
            <span>Advertencia: Verifique los datos ingresados</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddActivity;