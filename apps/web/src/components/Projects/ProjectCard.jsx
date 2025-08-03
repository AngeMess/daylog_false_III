import React, { useState, useEffect } from 'react';
// Importamos motion de framer-motion para animaciones
import { motion as MotionComponent } from 'framer-motion';
import { User, ChevronDown, ChevronUp, Minus, Info, Check, Eye, AlertTriangle, X, EyeOff, Code } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import useProyectsApi from '../../hooks/useProjectsApi';
import { useNotifications } from '../../context/NotificationContext';
import { useAuth } from '../../context/authContext';

// Asegurarse de que Modal esté configurado para accesibilidad
Modal.setAppElement('#root');

export default function ProjectCard({ project }) {
  const navigate = useNavigate();
  const { updateProyect } = useProyectsApi();
  const { addNotification } = useNotifications();
  const { userType } = useAuth();
  const [visibilityModalOpen, setVisibilityModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [visibleState, setVisibleState] = useState(project.visible);
  
  // Si el prop visible cambia externamente, sincronizar
  useEffect(() => {
    setVisibleState(project.visible);
  }, [project.visible]);
  
  const getTrendIcon = () => {
    // Si el estado es Finalizado, mostrar un check independientemente de la prioridad
    if (project.status === 'Finalizado') {
      return <Check className="text-green-600" size={20} />;
    }
    
    // Definir el icono basado en el valor de prioridad
    if (project.priority < 40) {
      return <ChevronDown className="text-green-500" size={20} />;
    } else if (project.priority >= 40 && project.priority <= 60) {
      return <Minus className="text-orange-500" size={20} />;
    } else { // prioridad > 60%
      return <ChevronUp className="text-red-500" size={20} />;
    }
  };

  const getStatusBadge = () => {
    let bgColor, icon;
    
    switch (project.status) {
      case 'Pendiente':
        bgColor = "bg-blue-900";
        icon = <Check size={12} className="mr-1" />;
        return (
          <span className={`px-3 py-1 text-xs font-medium ${bgColor} text-white rounded-md flex items-center`}>
            {icon} Pendiente
          </span>
        );
      case 'En proceso':
        bgColor = "bg-yellow-500";
        icon = <ChevronUp size={12} className="mr-1" />;
        return (
          <span className={`px-3 py-1 text-xs font-medium ${bgColor} text-white rounded-md flex items-center`}>
            {icon} Desarrollo
          </span>
        );
      case 'Finalizado':
        bgColor = "bg-green-600";
        icon = <Check size={12} className="mr-1" />;
        return (
          <span className={`px-3 py-1 text-xs font-medium ${bgColor} text-white rounded-md flex items-center`}>
            {icon} Finalizado
          </span>
        );
      case 'Cancelado':
        bgColor = "bg-gray-800";
        icon = <X size={12} className="mr-1" />;
        return (
          <span className={`px-3 py-1 text-xs font-medium ${bgColor} text-white rounded-md flex items-center`}>
            {icon} Cancelado
          </span>
        );
      case 'Atrasado':
        bgColor = "bg-red-600";
        icon = <AlertTriangle size={12} className="mr-1" />;
        return (
          <span className={`px-3 py-1 text-xs font-medium ${bgColor} text-white rounded-md flex items-center`}>
            {icon} Atrasado
          </span>
        );
      case 'En riesgo':
        bgColor = "bg-purple-600";
        icon = <AlertTriangle size={12} className="mr-1" />;
        return (
          <span className={`px-3 py-1 text-xs font-medium ${bgColor} text-white rounded-md flex items-center`}>
            {icon} Riesgo
          </span>
        );
      case 'Repriorizado':
        bgColor = "bg-pink-600";
        icon = <ChevronUp size={12} className="mr-1" />;
        return (
          <span className={`px-3 py-1 text-xs font-medium ${bgColor} text-white rounded-md flex items-center`}>
            {icon} Repriorizado
          </span>
        );
      default:
        return null;
    }
  };

  // Verificar si se puede cambiar la visibilidad
  const canToggleVisibility = () => {
    // Solo proyectos en estado Pendiente, Finalizado o Cancelado pueden cambiar visibilidad
    return project.status === 'Pendiente' || project.status === 'Finalizado' || project.status === 'Cancelado';
  };

  const getVisibilityBadge = () => {
    // Para todos los proyectos, mostrar su visibilidad actual
    if (visibleState) {
      return (
        <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-md flex items-center">
          <Eye size={12} className="mr-1" /> Visible
        </span>
      );
    } else {
      return (
        <span className="px-3 py-1 text-xs font-medium bg-gray-800 text-white rounded-md flex items-center">
          <EyeOff size={12} className="mr-1" /> Privado
        </span>
      );
    }
  };

  const getPriorityColor = () => {
    // Si el estado es Finalizado, color verde independientemente de la prioridad
    if (project.status === 'Finalizado') return 'text-green-600';
    
    // Colores según rango de prioridad
    if (project.priority < 40) return 'text-green-500';
    if (project.priority >= 40 && project.priority <= 60) return 'text-orange-500';
    return 'text-red-500'; // prioridad > 60%
  };

  // Función para cambiar la visibilidad del proyecto
  const toggleVisibility = async () => {
    if (!canToggleVisibility()) {
      addNotification({
        type: 'warning',
        title: 'Acción no permitida',
        message: 'Solo se puede cambiar la visibilidad de proyectos en estado Pendiente, Finalizado o Cancelado',
        targetRoles: ['portfolio', 'admin', 'supervisor']
      });
      return;
    }

    try {
      setIsUpdating(true);
      
      const updatedVisible = !visibleState;
      
      // Llamar al API para actualizar la visibilidad
      await updateProyect(project.id, {
        visible: updatedVisible
      });
      
      // Actualizar estado local
      setVisibleState(updatedVisible);
      
      // Mostrar notificación de éxito
      addNotification({
        type: 'success',
        title: 'Visibilidad actualizada',
        message: `El proyecto "${project.name}" ahora está ${updatedVisible ? 'visible' : 'oculto'}.`,
        targetRoles: ['portfolio', 'admin', 'supervisor']
      });
      
      // Cerrar el modal
      setVisibilityModalOpen(false);
    } catch (error) {
      console.error('Error al cambiar la visibilidad:', error);
      
      // Mostrar notificación de error
      addNotification({
        type: 'error',
        title: 'Error',
        message: `No se pudo cambiar la visibilidad del proyecto "${project.name}".`,
        targetRoles: ['portfolio', 'admin', 'supervisor']
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Función para obtener la ruta de detalle según el rol
  const getDetailRoute = () => {
    if (!userType) return null;
    switch (userType) {
      case 'Admin':
        return `/admin/proyectos/detalle-proyecto/${project.id}`;
      case 'Portafolio':
        return `/portafolio/proyectos/detalle-proyecto/${project.id}`;
      case 'Supervisor':
        return `/supervisor/proyectos/detalle-proyecto/${project.id}`;
      default:
        return null;
    }
  };
  
  return (
    <MotionComponent.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="glass-card overflow-hidden relative"
      onClick={(e) => e.stopPropagation()} // Prevenir que el click en la tarjeta navegue
      style={{
        position: 'relative',
        touchAction: 'none', // Mejorar manejo táctil
        transform: 'translate3d(0,0,0)', // Forzar composición de GPU
        backfaceVisibility: 'hidden', // Optimización de rendimiento
      }}
    >
      <div className="p-5 card-content relative">
        {/* Botones de acciones para pantallas grandes */}
        <div className="absolute right-3 top-3 flex items-center space-x-2">
          {/* Botón de visibilidad */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              if (canToggleVisibility()) {
                setVisibilityModalOpen(true);
              } else {
                addNotification({
                  type: 'warning',
                  title: 'Acción no permitida',
                  message: 'Solo se puede cambiar la visibilidad de proyectos finalizados o cancelados',
                  targetRoles: ['portfolio', 'admin', 'supervisor']
                });
              }
            }}
            className={`rounded-full w-8 h-8 ${
              canToggleVisibility() ? 'bg-blue-100/70 text-blue-600 hover:bg-blue-200' : 'bg-gray-100 text-gray-400'
            } items-center justify-center transition-all duration-300 flex`}
            disabled={!canToggleVisibility()}
          >
            {visibleState ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
          
          {/* Botón de detalles */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              const route = getDetailRoute();
              if (route) navigate(route);
            }}
            className="rounded-full w-8 h-8 bg-gray-200/50 text-gray-600 items-center justify-center hover:bg-gray-200 transition-all duration-300 flex"
            disabled={!getDetailRoute()}
            title={!getDetailRoute() ? "No tienes acceso al detalle" : "Ver detalle"}
          >
            <Info size={16} />
          </button>
        </div>

        {/* Código del proyecto */}
        <div className="flex items-center mb-3">
          <Code size={16} className="text-[#01426A] mr-1" />
          <h3 className="text-lg font-semibold text-[#01426A]">{project.name}</h3>
        </div>
        
        <div className="flex flex-col">
          {/* Grid 2x2 para badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
            {/* Fila 1 - Estado y Visibilidad */}
            <div className="flex justify-center">
              {getStatusBadge()}
            </div>
            <div className="flex justify-center">
              {getVisibilityBadge()}
            </div>
            
            {/* Fila 2 - Área y País */}
            <div className="flex justify-center">
              <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-md inline-block">
                {project.area}
              </span>
            </div>
            <div className="flex justify-center">
              <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-md inline-block">
                {project.country}
              </span>
            </div>
          </div>
          
          {/* Prioridad */}
          <div className="mb-3 flex justify-center">
            <div className="text-center">
              <span className="text-xs text-gray-500">Prioridad</span>
              <div className="flex items-center justify-center">
                <span className={`font-medium ${getPriorityColor()}`}>{project.priority}%</span>
                <span className="ml-1">{getTrendIcon()}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Línea divisoria central */}
        <div className="flex items-center justify-between mb-3">
          <div className="h-10 w-full border-b border-gray-200"></div>
        </div>
        
        {/* Información del supervisor */}
        <div className="flex justify-center">
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-500">Supervisor</span>
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700">{project.supervisor}</span>
              <div className="ml-2 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                <User size={14} className="text-gray-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal de confirmación para cambiar visibilidad */}
      <Modal
        isOpen={visibilityModalOpen}
        onRequestClose={() => setVisibilityModalOpen(false)}
        className="visibility-modal-content"
        overlayClassName="modal-overlay"
        style={{
          content: {
            position: 'fixed', // Cambiar a fixed para mejor manejo de z-index
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            borderRadius: '12px',
            border: 'none',
            padding: '24px',
            width: '90%',
            maxWidth: '450px',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)',
            backgroundColor: 'white',
            zIndex: 10000 // Asegurar que el modal esté por encima de todo
          },
          overlay: {
            position: 'fixed', // Cambiar a fixed
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            inset: 0 // Asegurar que cubra toda la pantalla
          }
        }}
        contentLabel="Cambiar visibilidad"
      >
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              {visibleState ? <Eye className="text-blue-500 mr-2" size={22} /> : <EyeOff className="text-gray-500 mr-2" size={22} />}
              <h2 className="text-xl font-semibold text-gray-800">Cambiar visibilidad</h2>
            </div>
            <button
              onClick={() => setVisibilityModalOpen(false)}
              className="text-gray-500 hover:text-gray-800 transition-colors"
            >
              <X size={22} />
            </button>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              Cambiar la visibilidad de este proyecto afectará si es visible para los empleados y en la vista general.
            </p>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-800">{project.name}</p>
                <p className="text-sm text-gray-500">Estado: {project.status}</p>
              </div>
              <div className="visibility-switch">
                <input 
                  type="checkbox" 
                  checked={visibleState} 
                  onChange={toggleVisibility}
                  disabled={isUpdating}
                />
                <span className="visibility-slider"></span>
              </div>
            </div>
            <p className="text-sm text-amber-500 mt-3 flex items-center">
              <AlertTriangle size={14} className="mr-1" /> 
              {visibleState 
                ? "Al cambiar a Privado, el proyecto no aparecerá en las vistas principales."
                : "Al cambiar a Visible, el proyecto aparecerá en las vistas principales."}
            </p>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setVisibilityModalOpen(false)}
              className="py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
              disabled={isUpdating}
            >
              Cancelar
            </button>
            
            <button
              onClick={toggleVisibility}
              className={`py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center ${isUpdating ? 'opacity-75 cursor-not-allowed' : ''}`}
              disabled={isUpdating}
            >
              {isUpdating ? 'Actualizando...' : visibleState ? 'Cambiar a Privado' : 'Cambiar a Visible'}
            </button>
          </div>
        </div>
      </Modal>
    </MotionComponent.div>
  );
}
