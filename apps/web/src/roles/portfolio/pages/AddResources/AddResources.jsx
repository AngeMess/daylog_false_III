import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion as MotionComponent } from 'framer-motion';
import { Check, AlertCircle, AlertTriangle, X, ArrowLeft, FileText, Loader } from 'lucide-react';
import FileUpload from '../../../../components/FileUpload/FileUpload';
import axios from 'axios';

const AddResources = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  
  const [files, setFiles] = useState([]);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Cargar datos del proyecto
  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) {
        navigate('/portafolio/proyectos');
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3000/api/proyect/${projectId}`);
        setProject(response.data);
      } catch (error) {
        console.error('Error al cargar el proyecto:', error);
        setShowErrorToast(true);
        setErrorMessage('No se pudo cargar la información del proyecto');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId, navigate]);

  // Manejar cambios en la selección de archivos
  const handleFileChange = (files) => {
    setFiles(files);
  };

  // Subir archivos al servidor
  const handleUploadFiles = async () => {
    if (!files.length) {
      setShowErrorToast(true);
      setErrorMessage('Selecciona al menos un archivo para subir');
      return;
    }

    setUploading(true);
    try {
      // Subir cada archivo individualmente
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('proyect', projectId);
        formData.append('name', file.name);

        try {
          const response = await axios.post('http://localhost:3000/api/resources', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          return response.data;
        } catch (error) {
          console.error(`Error al subir archivo ${file.name}:`, error);
          return null;
        }
      });

      const results = await Promise.all(uploadPromises);
      const successfulUploads = results.filter(Boolean);

      if (successfulUploads.length > 0) {
        setShowSuccessToast(true);
        // Esperar un momento antes de redirigir
        setTimeout(() => {
          navigate(`/portafolio/proyectos/detalle-proyecto/${projectId}`);
        }, 2000);
      } else {
        throw new Error('No se pudo subir ningún archivo');
      }
    } catch (error) {
      console.error('Error al subir archivos:', error);
      setShowErrorToast(true);
      setErrorMessage(error.message || 'Error al subir los archivos');
    } finally {
      setUploading(false);
    }
  };

  // Regresar a la lista de proyectos
  const handleSkip = () => {
    navigate(`/portafolio/proyectos/detalle-proyecto/${projectId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] p-6 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader className="animate-spin text-[#01426A]" size={24} />
          <span className="text-gray-600">Cargando proyecto...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-6">
      {/* Encabezado */}
      <MotionComponent.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <button
          onClick={handleSkip}
          className="flex items-center text-[#01426A] hover:underline font-medium mb-6"
        >
          <ArrowLeft size={18} className="mr-1" />
          <span>Regresar a proyecto</span>
        </button>

        <h1 className="text-2xl sm:text-3xl font-bold text-[#01426A]">
          Agregar recursos
        </h1>
        <p className="text-gray-600 mt-2">
          {project ? `Proyecto: ${project.proyectName}` : 'Cargando proyecto...'}
        </p>
      </MotionComponent.div>

      {/* Contenido principal */}
      <MotionComponent.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 rounded-full bg-[#01426A] flex items-center justify-center text-white mr-3">
            <FileText size={20} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[#01426A]">Recursos del proyecto</h2>
            <p className="text-gray-500">Sube archivos relacionados con este proyecto</p>
          </div>
        </div>

        {/* Componente de carga de archivos */}
        <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed border-neutral-200 rounded-lg mb-8">
          <FileUpload onChange={handleFileChange} maxFiles={5} />
        </div>

        {files.length > 0 && (
          <p className="text-center text-gray-500 mb-6">
            {files.length} {files.length === 1 ? 'archivo seleccionado' : 'archivos seleccionados'}
          </p>
        )}

        {/* Botones de acción */}
        <div className="flex flex-wrap justify-end space-x-0 space-y-3 sm:space-x-4 sm:space-y-0 pt-6">
          <button
            type="button"
            onClick={handleSkip}
            className="w-full sm:w-auto py-3 px-6 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors flex items-center justify-center"
          >
            <span className="font-medium">Omitir</span>
          </button>
          
          <button
            type="button"
            onClick={handleUploadFiles}
            disabled={uploading || !files.length}
            className="w-full sm:w-auto py-3 px-6 bg-[#FFC600] text-[#01426A] font-medium rounded-full transition-all duration-300 border border-transparent hover:bg-[#FBFBFB] hover:text-[#FFC600] hover:border-[#FFC600] shadow-sm hover:shadow-md flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <>
                <Loader size={18} className="mr-2 animate-spin" />
                <span>Subiendo archivos...</span>
              </>
            ) : (
              <span>Subir archivos</span>
            )}
          </button>
        </div>
      </MotionComponent.div>

      {/* Toast de éxito */}
      {showSuccessToast && (
        <div className="fixed bottom-5 right-5 z-[9999]">
          <MotionComponent.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="bg-green-500 text-white p-3 rounded-lg shadow-lg flex items-center min-w-[300px]"
          >
            <Check size={20} />
            <p className="flex-grow ml-3">Archivos subidos con éxito</p>
            <button onClick={() => setShowSuccessToast(false)} className="p-1 hover:bg-white/20 rounded-full">
              <X size={16} />
            </button>
          </MotionComponent.div>
        </div>
      )}

      {/* Toast de error */}
      {showErrorToast && (
        <div className="fixed bottom-5 right-5 z-[9999]">
          <MotionComponent.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="bg-red-500 text-white p-3 rounded-lg shadow-lg flex items-center min-w-[300px]"
          >
            <AlertCircle size={20} />
            <p className="flex-grow ml-3">{errorMessage || 'Error al subir archivos'}</p>
            <button onClick={() => setShowErrorToast(false)} className="p-1 hover:bg-white/20 rounded-full">
              <X size={16} />
            </button>
          </MotionComponent.div>
        </div>
      )}
    </div>
  );
};

export default AddResources;
