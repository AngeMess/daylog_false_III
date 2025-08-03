// CreateArea.jsx (Updated)
import React, { useState } from 'react';
import { Triangle, AlertTriangle, CheckCircle, EllipsisVertical, Edit, Trash2, Plus } from 'lucide-react';
import ConfirmationModal from '../../../../components/ui/ConfirmationModal.jsx';
import FormInput from '../../../../components/ui/FormInput.jsx';
import useAreas from '../../hooks/useAreaApi.js';
import CustomHeading from '../../../../components/Titles/TitleH1';
import { LoadingState, ErrorState, EmptyState } from '../../../../components/ui/stateHandler.jsx';
import GenericAreaCard from '../../components/AreaCards/GenericAreaCard.jsx';
import { Button } from '../../../../components/Buttons';

const CreateArea = ({ onCancel }) => {
  const [nombreArea, setNombreArea] = useState('');
  const [confirmarNombre, setConfirmarNombre] = useState('');
  const [alert, setAlert] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [areaToDelete, setAreaToDelete] = useState(null);
  const [areaToUpdate, setAreaToUpdate] = useState(null);
  const [localLoading, setLocalLoading] = useState(false);

  // Estados para el formulario de actualización
  const [updateNombreArea, setUpdateNombreArea] = useState('');
  const [updateConfirmarNombre, setUpdateConfirmarNombre] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);

  // Hook para manejar las áreas (ahora usa DataLoader internamente)
  const {
    areas,
    loading: areasLoading,
    error,
    createArea,
    updateArea,
    deleteArea,
    clearError,
    refetch // Función para recargar datos
  } = useAreas();

  // Validaciones para crear nueva área
  const isNombreValid = nombreArea.trim().length > 0 && nombreArea.trim().length <= 150;
  const isConfirmValid = confirmarNombre === nombreArea && isNombreValid;
  const isFormValid = isNombreValid && isConfirmValid;

  // Validaciones para actualizar área
  const isUpdateNombreValid = updateNombreArea.trim().length > 0 && updateNombreArea.trim().length <= 150;
  const isUpdateConfirmValid = updateConfirmarNombre === updateNombreArea && isUpdateNombreValid;
  const isUpdateFormValid = isUpdateNombreValid && isUpdateConfirmValid;

  // Mostrar alertas
  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      showAlert('error', 'Por favor corrija los errores del formulario');
      return;
    }

    setLocalLoading(true);

    try {
      const areaData = {
        name: nombreArea.trim()
      };

      await createArea(areaData);

      showAlert('success', 'Área creada correctamente');

      // Limpiar formulario
      setNombreArea('');
      setConfirmarNombre('');

      // Volver a la pantalla anterior después de mostrar el mensaje
      setTimeout(() => onCancel(), 2000);

    } catch (error) {
      console.error('Error al crear área:', error);
      showAlert('error', error.message || 'Error al crear el área');
    } finally {
      setLocalLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!areaToDelete) return;

    setUpdateLoading(true);
    try {
      await deleteArea(areaToDelete._id);
      setShowDeleteModal(false);
      setAreaToDelete(null);
      showAlert('success', 'Área eliminada correctamente');
    } catch (error) {
      console.error('Error al eliminar área:', error);
      showAlert('error', error.message || 'Error al eliminar el área');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    if (!isUpdateFormValid || !areaToUpdate) {
      showAlert('error', 'Por favor corrija los errores del formulario de actualización');
      return;
    }

    setUpdateLoading(true);

    try {
      const updateData = {
        name: updateNombreArea.trim()
      };

      await updateArea(areaToUpdate._id, updateData);

      setShowUpdateModal(false);
      setAreaToUpdate(null);
      setUpdateNombreArea('');
      setUpdateConfirmarNombre('');

      showAlert('success', 'Área actualizada correctamente');

    } catch (error) {
      console.error('Error al actualizar área:', error);
      showAlert('error', error.message || 'Error al actualizar el área');
    } finally {
      setUpdateLoading(false);
    }
  };

  const openUpdateModal = (area) => {
    setAreaToUpdate(area);
    setUpdateNombreArea(area.name);
    setUpdateConfirmarNombre(area.name);
    setShowUpdateModal(true);
  };

  const closeUpdateModal = () => {
    setShowUpdateModal(false);
    setAreaToUpdate(null);
    setUpdateNombreArea('');
    setUpdateConfirmarNombre('');
  };

  // Combinar loading states: local + DataLoader
  const isLoading = localLoading || areasLoading;

  // Función para renderizar el contenido de las áreas
  const renderAreasContent = () => {
    // Estado de carga
    if (areasLoading) {
      return <LoadingState message="Cargando áreas..." />;
    }

    // Estado de error
    if (error) {
      return (
        <ErrorState
          message={error.message || "Error al cargar las áreas"}
          onRetry={() => {
            clearError();
            refetch();
          }}
        />
      );
    }

    // Estado vacío
    if (!areas || areas.length === 0) {
      return (
        <EmptyState
          message="No hay áreas registradas"
          description="Crea tu primera área usando el formulario de arriba"
          icon={Triangle}
          iconColor="text-blue-400"
        />
      );
    }

    // Render normal con datos
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        {areas.map((area) => (
          <GenericAreaCard // Usar el nuevo componente
            key={area._id}
            area={area}
            icon={Triangle}
            onUpdate={openUpdateModal}
            onDelete={(areaToDelete) => {
              setAreaToDelete(areaToDelete);
              setShowDeleteModal(true);
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="flex flex-col items-start mb-10">
        <CustomHeading
          text="Crear Área"
          color="#01426A"
        />
        <br />

        <div className="w-full">
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="flex flex-col md:flex-row">
              {/* Columna izquierda para inputs */}
              <div className="w-full md:w-3/4 md:pr-12">
                {/* Campo: Nombre del área */}
                <FormInput
                  id="nombreArea"
                  label="Nombre de la nueva área"
                  value={nombreArea}
                  onChange={(e) => setNombreArea(e.target.value)}
                  icon={Triangle}
                  required
                  className="mb-4"
                />

                {/* Mostrar contador de caracteres */}
                {nombreArea.length > 0 && (
                  <p className={`mt-1 mb-2 text-sm ${nombreArea.length > 150 ? 'text-red-600' : 'text-gray-500'}`}>
                    {nombreArea.length}/150 caracteres
                  </p>
                )}

                {/* Campo: Confirmar nombre */}
                <FormInput
                  id="confirmarNombre"
                  label="Confirmar nombre de área"
                  value={confirmarNombre}
                  onChange={(e) => setConfirmarNombre(e.target.value)}
                  icon={Triangle}
                  required
                  className="mb-2"
                />

                {confirmarNombre.length > 0 && (
                  <p className={`mt-1 mb-4 text-sm ${isConfirmValid ? 'text-green-600' : 'text-red-600'}`}>
                    {isConfirmValid ? 'Los nombres coinciden' : 'Los nombres no coinciden'}
                  </p>
                )}
              </div>

              {/* Columna derecha para botones */}
              <div className="flex flex-col justify-start space-y-3 mt-2 md:mt-0 md:ml-auto mr-0 md:mr-12">
                <Button type="button" onClick={onCancel} disabled={isLoading} variant="btn_secondary">
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading} variant="btn_primary">
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                      <span>Creando...</span>
                    </div>
                  ) : (
                    'Crear'
                  )}
                </Button>
              </div>
            </div>
          </form>

          {/* Sección de áreas usando StateHandler */}
          {renderAreasContent()}

          {/* Alerta de confirmación o error */}
          {alert && (
            <div className={`mt-6 px-6 py-4 rounded-xl flex items-center gap-3 text-sm font-medium shadow-lg transition-all duration-300
              ${alert.type === 'error' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
              {alert.type === 'error' ? <AlertTriangle size={20} /> : <CheckCircle size={20} />}
              <span>{alert.message}</span>
            </div>
          )}
        </div>
      </div>

      {/* Modal de actualización */}
      {showUpdateModal && areaToUpdate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-transparent backdrop-blur-md" style={{ backdropFilter: 'blur(8px)' }}></div>
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative z-10">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Edit className="text-blue-500" size={24} />
              Actualizar área
            </h2>

            <form onSubmit={handleUpdateSubmit}>
              {/* Nombre del área */}
              <FormInput
                id="updateNombreArea"
                label="Nombre del área"
                value={updateNombreArea}
                onChange={(e) => setUpdateNombreArea(e.target.value)}
                icon={Triangle}
                required
                className="mb-4"
              />

              {updateNombreArea.length > 0 && (
                <p className={`mt-1 mb-2 text-sm ${updateNombreArea.length > 150 ? 'text-red-600' : 'text-gray-500'}`}>
                  {updateNombreArea.length}/150 caracteres
                </p>
              )}

              {/* Confirmar nombre */}
              <FormInput
                id="updateConfirmarNombre"
                label="Confirmar nombre"
                value={updateConfirmarNombre}
                onChange={(e) => setUpdateConfirmarNombre(e.target.value)}
                icon={Triangle}
                required
                className="mb-2"
              />

              {updateConfirmarNombre.length > 0 && (
                <p className={`mt-1 mb-4 text-sm ${isUpdateConfirmValid ? 'text-green-600' : 'text-red-600'}`}>
                  {isUpdateConfirmValid ? 'Los nombres coinciden' : 'Los nombres no coinciden'}
                </p>
              )}

              <div className="flex justify-end gap-4 mt-6">
                <Button type="button" onClick={closeUpdateModal} disabled={updateLoading} variant="btn_second_secondary">
                  Cancelar
                </Button>
                <Button type="submit" onClick={closeUpdateModal} disabled={updateLoading} variant="btn_second_primary">
                {updateLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                      Actualizando...
                    </div>
                  ) : (
                    'Actualizar'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      <ConfirmationModal
        isOpen={showDeleteModal && !!areaToDelete}
        title="Confirmar eliminación"
        message={areaToDelete ? `¿Estás seguro de que quieres eliminar el área "${areaToDelete.name}"?` : ''}
        warningText="Esta acción no se puede deshacer."
        cancelButtonText="Cancelar"
        confirmButtonText={updateLoading ? 'Eliminando...' : 'Eliminar'}
        confirmButtonColor="#ff0d4f"
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default CreateArea;