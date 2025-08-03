import React, { useState, useEffect } from 'react';
import { Download, File, Archive, AlertCircle, X, Loader } from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import axios from 'axios';
import { Button } from '../Buttons';

const ResourcesList = ({ projectId, projectName, deletable = false, pendingDeleteIds = [], onToggleDelete }) => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadingAll, setDownloadingAll] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Cargar recursos del proyecto
  useEffect(() => {
    const fetchResources = async () => {
      if (!projectId) return;
      
      setLoading(true);
      try {
        console.log(`Solicitando recursos para el proyecto con ID: ${projectId}`);
        const response = await axios.get(`http://localhost:3000/api/resources?proyect=${projectId}`);
        console.log('Respuesta completa de recursos:', response.data);
        
        // Filtrar cualquier recurso que pueda estar causando problemas
        const filteredResources = response.data.filter(resource => {
          // Verificar que el recurso es válido y tiene las propiedades necesarias
          // Usamos 'name' en lugar de 'fileName' que es el campo real en el modelo
          return (
            resource && 
            resource._id && 
            // El recurso puede tener name o url/urls
            (resource.name || resource.url || (resource.urls && resource.urls.length))
          );
        });
        
        console.log(`Recursos filtrados: ${filteredResources.length}`, filteredResources);
        setResources(filteredResources);
      } catch (error) {
        console.error('Error al cargar recursos:', error);
        setError('No se pudieron cargar los recursos del proyecto');
        setShowErrorToast(true);
        setErrorMessage('Error al cargar los recursos');
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [projectId]);

  // Descargar un archivo individual
  const handleDownload = async (resourceUrl) => {
    try {
      window.open(resourceUrl, '_blank');
    } catch (error) {
      console.error('Error al descargar el archivo:', error);
      setShowErrorToast(true);
      setErrorMessage('Error al descargar el archivo');
    }
  };

  // Descargar todos los archivos como ZIP
  const handleDownloadAll = async () => {
    if (!resources.length) return;
    
    setDownloadingAll(true);
    try {
      const zip = new JSZip();
      
      // Añadir cada recurso al ZIP
      const fetchPromises = resources.map(async (resource) => {
        try {
          const response = await fetch(resource.url);
          const blob = await response.blob();
          
          // Extraer la extensión del archivo de la URL
          const urlParts = resource.url.split('.');
          const extension = urlParts.length > 1 ? urlParts[urlParts.length - 1] : '';
          
          // Crear un nombre de archivo válido con extensión
          const fileName = `${resource.name.replace(/[/\\?%*:|"<>]/g, '-')}${extension ? '.' + extension : ''}`;
          
          zip.file(fileName, blob);
          return true;
        } catch (error) {
          console.error(`Error al obtener el archivo ${resource.name}:`, error);
          return false;
        }
      });
      
      await Promise.all(fetchPromises);
      
      // Generar el archivo ZIP
      const content = await zip.generateAsync({ type: 'blob' });
      // Usar el nombre del proyecto como nombre del ZIP
      const zipFileName = `${projectName || 'proyecto'}_recursos.zip`;
      
      saveAs(content, zipFileName);
    } catch (error) {
      console.error('Error al crear el archivo ZIP:', error);
      setShowErrorToast(true);
      setErrorMessage('Error al descargar los archivos');
    } finally {
      setDownloadingAll(false);
    }
  };

  // Determinar el ícono a mostrar según el tipo de archivo
  const getFileIcon = (url) => {
    if (!url) return <File className="text-gray-500" size={18} />;
    
    const extension = url.split('.').pop().toLowerCase();
    
    switch(extension) {
      case 'pdf':
        return <File className="text-red-500" size={18} />;
      case 'doc':
      case 'docx':
        return <File className="text-blue-500" size={18} />;
      case 'xls':
      case 'xlsx':
        return <File className="text-green-500" size={18} />;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <File className="text-purple-500" size={18} />;
      default:
        return <File className="text-gray-500" size={18} />;
    }
  };

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-8">
        <Loader className="animate-spin text-gray-400" size={24} />
        <span className="ml-2 text-gray-500">Cargando recursos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-8 text-center">
        <AlertCircle className="text-red-500 mb-2" size={24} />
        <p className="text-gray-700">{error}</p>
      </div>
    );
  }

  if (resources.length === 0) {
    return (
      <div className="w-full text-center py-8 bg-white rounded-lg shadow-sm p-8">
        <div className="flex flex-col items-center justify-center">
          <File className="text-gray-400 mb-4" size={48} />
          <h3 className="text-xl font-medium text-gray-700 mb-2">Sin recursos para este proyecto</h3>
          <p className="text-gray-500">No se han añadido documentos o archivos a este proyecto.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Botón de descarga masiva */}
      <div className="flex justify-end mb-4">
        <Button
          onClick={handleDownloadAll}
          disabled={downloadingAll || !resources.length}
          variant="btn_black"
        >
          {downloadingAll ? (
            <>
              <Loader size={16} className="animate-spin mr-2" />
              <span>Descargando...</span>
            </>
          ) : (
            <>
              <Archive size={16} className="mr-2" />
              <span>Descargar todos</span>
            </>
          )}
        </Button>
      </div>

      {/* Lista de recursos */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Archivo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acción
                </th>
                {deletable && (
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Eliminar</th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {resources.map((resource) => (
                <tr key={resource._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getFileIcon(resource.url)}
                      <div className="ml-2">
                        <div className="text-sm font-medium text-gray-900 line-clamp-1">{resource.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(resource.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      type="button"
                      onClick={() => handleDownload(resource.url)}
                      className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1"
                    >
                      <Download size={14} /> Descargar
                    </button>
                  </td>
                  {deletable && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        type="button"
                        onClick={() => onToggleDelete && onToggleDelete(resource._id)}
                        className={`${pendingDeleteIds.includes(resource._id) ? 'text-red-600' : 'text-gray-400'} hover:text-red-600`}
                      >
                        <X size={16} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Toast de error */}
      {showErrorToast && (
        <div className="fixed bottom-5 right-5 z-[9999]">
          <div className="bg-red-500 text-white p-3 rounded-lg shadow-lg flex items-center min-w-[300px]">
            <AlertCircle size={20} />
            <p className="flex-grow ml-3">{errorMessage}</p>
            <button onClick={() => setShowErrorToast(false)} className="p-1 hover:bg-white/20 rounded-full">
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourcesList;
