import React from 'react';
import { X, ChevronDown } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import DatePickerPopover from '../../../components/DatePickerPopover/DatePickerPopover';
import FormSelect from '../../../components/ui/FormSelect';
import { Button } from '../../../components/Buttons';
import {  Plus } from 'lucide-react';

const ActivityModal = ({
    isOpen,
    onClose,
    formData,
    onInputChange,
    onSubmit,
    isEditing,
    activityToEdit,
    // employees ya no es necesario si siempre se asigna al loggeado
    // loggedInEmployeeId ya no es necesario pasarlo al modal si no se usa para mostrar
    // isAdmin ya no es necesario si el modal es solo para empleados
}) => {
    if (!isOpen) return null;

    const currentFormData = isEditing ? activityToEdit : formData;

    // Nueva función para manejar el cambio del FormSelect
    const handleFormSelectChange = (e) => {
        const syntheticEvent = {
            target: {
                name: e.target.id,
                value: e.target.value,
            },
        };
        onInputChange(syntheticEvent);
    };

    const handleLocalSubmit = () => {
        if (isEditing) {
            if (!currentFormData.state || !currentFormData.finishHour || currentFormData.finishMinute === undefined) {
                alert('Por favor complete los campos requeridos (Estado, Hora fin)');
                return;
            }
        } else {
            if (!currentFormData.name || !currentFormData.state || !currentFormData.date || 
                currentFormData.startHour === undefined || currentFormData.startMinute === undefined ||
                currentFormData.finishHour === undefined || currentFormData.finishMinute === undefined ||
                !currentFormData.description) { // No validation for employee or compensatory here, as they are handled implicitly/forced
                alert('Por favor complete todos los campos requeridos');
                return;
            }
            
            // Validar que la descripción tenga entre 50 y 350 caracteres
            if (currentFormData.description.length < 50 || currentFormData.description.length > 350) {
                alert('La descripción debe tener entre 50 y 350 caracteres');
                return;
            }

            // Validar que la hora de fin sea posterior a la de inicio
            const startTime = currentFormData.startHour + (currentFormData.startMinute / 60);
            const finishTime = currentFormData.finishHour + (currentFormData.finishMinute / 60);
            
            if (finishTime <= startTime) {
                alert('La hora de finalización debe ser posterior a la hora de inicio');
                return;
            }
        }
        onSubmit();
    };

    // Opciones para los selects según el esquema de Activity
    const stateOptions = [
        { value: 'Pendiente', label: 'Pendiente' },
        { value: 'En progreso', label: 'En progreso' },
        { value: 'Finalizada', label: 'Finalizada' },
    ];

    // Opciones de horas (1-24)
    const hourOptions = Array.from({ length: 24 }, (_, i) => ({
        value: i + 1,
        label: `${i + 1}:00`
    }));

    // Opciones de minutos (solo 0 y 30)
    const minuteOptions = [
        { value: 0, label: '00' },
        { value: 30, label: '30' }
    ];

    return (
        <div className="modal-overlay fixed inset-0 flex items-center justify-center backdrop-blur-md" 
             style={{ backgroundColor: 'rgba(0,0,0,0.4)' }} 
             onClick={onClose}>
            <div className="modal-content bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" 
                 onClick={(e) => e.stopPropagation()}>
                <div className="modal-header flex justify-between items-center p-6 border-b">
                    <h2 className="modal-title text-xl font-semibold text-gray-800">
                        {isEditing ? 'Editar actividad' : 'Nueva actividad'}
                    </h2>
                    <button className="modal-close-btn p-2 hover:bg-gray-100 rounded-full" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-form p-6 space-y-4">
                    {!isEditing && (
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label block text-sm font-medium text-gray-700 mb-2">
                                    Nombre de la actividad *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={currentFormData.name || ''}
                                    onChange={onInputChange}
                                    className="form-input w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Ingrese el nombre de la actividad"
                                    maxLength={100}
                                    required
                                />
                            </div>
                        </div>
                    )}

                    <div className="form-row">
                        <div className="form-group">
                            <FormSelect
                                id="state"
                                label="Estado *"
                                value={currentFormData.state || ''}
                                onChange={handleFormSelectChange}
                                options={stateOptions}
                            />
                        </div>
                    </div>

                    {!isEditing && (
                        <>
                            <div className="form-row">
                                <div className="form-group">
                                    <DatePickerPopover
                                        id="date"
                                        label="Fecha *"
                                        value={currentFormData.date || ''}
                                        onChange={(date) => onInputChange({ target: { name: 'date', value: date } })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-group">
                                    <FormSelect
                                        id="startHour"
                                        label="Hora de inicio *"
                                        value={currentFormData.startHour || ''}
                                        onChange={handleFormSelectChange}
                                        options={hourOptions}
                                    />
                                </div>
                                <div className="form-group">
                                    <FormSelect
                                        id="startMinute"
                                        label="Minutos de inicio *"
                                        value={currentFormData.startMinute !== undefined ? currentFormData.startMinute : ''}
                                        onChange={handleFormSelectChange}
                                        options={minuteOptions}
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-group">
                            <FormSelect
                                id="finishHour"
                                label="Hora de finalización *"
                                value={currentFormData.finishHour || ''}
                                onChange={handleFormSelectChange}
                                options={hourOptions}
                            />
                        </div>
                        <div className="form-group">
                            <FormSelect
                                id="finishMinute"
                                label="Minutos de finalización *"
                                value={currentFormData.finishMinute !== undefined ? currentFormData.finishMinute : ''}
                                onChange={handleFormSelectChange}
                                options={minuteOptions}
                            />
                        </div>
                    </div>

                    {/* Eliminar completamente la sección de "compensatory" para empleados */}
                    {/* Eliminar completamente la sección de "employee assigned" para empleados */}

                    <div className="form-group">
                        <label className="form-label block text-sm font-medium text-gray-700 mb-2">
                            Descripción * (50-350 caracteres)
                        </label>
                        <textarea
                            name="description"
                            value={currentFormData.description || ''}
                            onChange={onInputChange}
                            className="form-textarea w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="4"
                            placeholder="Ingrese una descripción detallada de la actividad (mínimo 50 caracteres)..."
                            minLength={50}
                            maxLength={350}
                            required
                        />
                        <div className="text-sm text-gray-500 mt-1">
                            {(currentFormData.description || '').length}/350 caracteres
                        </div>
                    </div>

                    <div className="modal-actions pt-4 border-t">
                        <div className="flex justify-end space-x-3">

                            <Button variant="btn_second_secondary" onClick={onClose} type="button" >
                                Cancelar
                            </Button>
                            
                            

                            <Button variant="btn_second_primary" onClick={() => handleLocalSubmit(true)}>
                                {isEditing ? 'Guardar Cambios' : 'Guardar Actividad'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActivityModal;