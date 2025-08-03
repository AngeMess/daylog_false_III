import React, { useState } from 'react';
import { FileText, Calendar, Send, AlertCircle, CheckCircle } from 'lucide-react';
import DatePickerPopover from '../../../../components/DatePickerPopover/DatePickerPopover';
import FormInput from '../../../../components/ui/FormInput';
import FormSelect from '../../../../components/ui/FormSelect';
import { Button } from "../../../../components/Buttons";
import usePermissionsApi from '../../hooks/usePermissionsApi';

export default function RequestFormCard({ onPermitCreated, className = "" }) {
  // Estados del formulario
  const [permissionType, setPermissionType] = useState('');
  const [reason, setReason] = useState('');
  const [date, setDate] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Hook personalizado para permisos
  const {
    createPermit,
    loading,
    error,
    PERMIT_TYPES,
    validatePermitData
  } = usePermissionsApi();

  // Opciones para el select de tipo de permiso
  const permissionOptions = PERMIT_TYPES.map(type => ({
    value: type,
    label: type
  }));

  // Limpiar formulario
  const clearForm = () => {
    setPermissionType('');
    setReason('');
    setDate(null);
  };

  // Mostrar mensaje de éxito
  const showSuccessMessage = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 4000);
  };

  // Mostrar mensaje de error
  const showErrorMessage = (message) => {
    setErrorMessage(message);
    setShowError(true);
    setTimeout(() => {
      setShowError(false);
      setErrorMessage('');
    }, 5000);
  };

  // Validar formulario
  const validateForm = () => {
    if (!permissionType) {
      showErrorMessage('Por favor selecciona un tipo de permiso');
      return false;
    }

    if (!reason || reason.trim() === '') {
      showErrorMessage('Por favor ingresa el motivo del permiso');
      return false;
    }

    if (reason.length > 350) {
      showErrorMessage('El motivo no puede exceder los 350 caracteres');
      return false;
    }

    if (!date) {
      showErrorMessage('Por favor selecciona una fecha para el permiso');
      return false;
    }

    // Validar que la fecha no sea en el pasado
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      showErrorMessage('La fecha del permiso no puede ser en el pasado');
      return false;
    }

    return true;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar formulario
    if (!validateForm()) {
      return;
    }

    // Preparar datos del permiso
    const permitData = {
      date: date,
      motive: reason.trim(),
      state: 'Pendiente', // Estado inicial
      permitType: permissionType
    };

    // Validación adicional usando el hook
    const validationError = validatePermitData(permitData);
    if (validationError) {
      showErrorMessage(validationError);
      return;
    }

    try {
      // Crear el permiso usando el hook
      const newPermit = await createPermit(permitData);
      
      // Mostrar mensaje de éxito
      showSuccessMessage();
      
      // Limpiar formulario
      clearForm();
      
      // Notificar al componente padre si existe callback
      if (onPermitCreated && typeof onPermitCreated === 'function') {
        onPermitCreated(newPermit);
      }

      console.log('Permiso creado exitosamente:', newPermit);
      
    } catch (err) {
      console.error('Error al crear permiso:', err);
      showErrorMessage(err.message || 'Error al enviar la solicitud. Por favor intenta nuevamente.');
    }
  };

  // Contar caracteres del motivo
  const characterCount = reason.length;
  const isCharacterLimitNear = characterCount > 300;
  const isCharacterLimitExceeded = characterCount > 350;

  return (
    <div className={`bg-white rounded-xl shadow-lg p-8 h-full ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2
          className="text-xl font-semibold text-[#194167] flex items-center gap-2"
          style={{ fontFamily: 'Montserrat' }}
        >
          <Send className="w-5 h-5" />
          Enviar solicitud de permiso
        </h2>
      </div>

      {/* Mensajes de estado */}
      {showSuccess && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
          <CheckCircle className="w-5 h-5" />
          <span>¡Solicitud enviada exitosamente! Tu permiso está pendiente de aprobación.</span>
        </div>
      )}

      {(showError || error) && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
          <AlertCircle className="w-5 h-5" />
          <span>{errorMessage || error}</span>
        </div>
      )}

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tipo de permiso */}
          <FormSelect
            id="permissionType"
            label="Tipo de permiso"
            value={permissionType}
            onChange={(e) => setPermissionType(e.target.value)}
            options={[
              { value: '', label: 'Selecciona un tipo de permiso' },
              ...permissionOptions
            ]}
            icon={FileText}
            className="w-full"
            disabled={loading}
            required
          />

          {/* Fecha */}
          <div className="relative">
            <DatePickerPopover
              id="date"
              label="Fecha del permiso"
              value={date}
              onChange={setDate}
              required
              minDate={new Date()}
              disabled={loading}
              icon={Calendar}
            />
          </div>
        </div>

        {/* Motivo */}
        <div className="space-y-2">
          <FormInput
            id="reason"
            label="Motivo del permiso"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            icon={FileText}
            required
            disabled={loading}
            placeholder="Describe detalladamente el motivo de tu solicitud..."
            maxLength={350}
            className="w-full"
            type="textarea"
            rows={4}
          />
          
          {/* Contador de caracteres */}
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">
              Máximo 350 caracteres
            </span>
            <span className={`${
              isCharacterLimitExceeded 
                ? 'text-red-500 font-semibold' 
                : isCharacterLimitNear 
                  ? 'text-yellow-600 font-medium' 
                  : 'text-gray-500'
            }`}>
              {characterCount}/350
            </span>
          </div>
        </div>

        {/* Botón de envío */}
        <div className="flex justify-end pt-4">
          <Button
            variant="btn_second_primary"
            type="submit"
            disabled={loading || isCharacterLimitExceeded}
            className={`flex items-center gap-2 min-w-[180px] ${
              (loading || isCharacterLimitExceeded) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Enviando...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Enviar solicitud
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Información adicional */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-700">
          <strong>Nota:</strong> Tu solicitud será enviada con estado "Pendiente" y será revisada por tu supervisor. 
          Recibirás una notificación cuando sea aprobada o denegada.
        </p>
      </div>
    </div>
  );
}