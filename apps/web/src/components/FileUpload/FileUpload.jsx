/**
 * Componente FileUpload - Sistema de carga de archivos avanzado
 * 
 * Este componente proporciona una interfaz completa para la carga de archivos
 * con funcionalidades de drag & drop, validación de tipos, límites de archivos
 * y visualización de progreso. Incluye animaciones fluidas y diseño responsivo.
 * 
 * Funcionalidades:
 * - Drag & drop de archivos múltiples
 * - Validación de tipos de archivo (PDF, DOC, DOCX, XLS, XLSX, JPG, PNG)
 * - Límite configurable de archivos
 * - Visualización de archivos cargados
 * - Eliminación individual de archivos
 * - Información detallada de cada archivo
 * 
 * Características:
 * - Animaciones fluidas con Framer Motion
 * - Diseño responsivo y accesible
 * - Estados visuales claros (drag, hover, loading)
 * - Validación en tiempo real
 * - Interfaz intuitiva y moderna
 * 
 * Props configurables:
 * - onChange: Callback cuando cambian los archivos
 * - maxFiles: Número máximo de archivos permitidos
 * 
 * Componentes incluidos:
 * - GridPattern: Patrón de fondo decorativo
 * - Manejo de estados de archivos
 * - Validación de tipos MIME
 */

import React, { useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { IconUpload } from "@tabler/icons-react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion"; // Necesario para los componentes motion.div

const mainVariant = {
  initial: {
    x: 0,
    y: 0,
  },
  animate: {
    x: 20,
    y: -20,
    opacity: 0.9,
  },
};

const secondaryVariant = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
};

export const FileUpload = ({
  onChange,
  maxFiles = 5,
}) => {
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileChange = (newFiles) => {
    if (maxFiles && files.length + newFiles.length > maxFiles) {
      alert(`Solo puedes subir un máximo de ${maxFiles} archivos.`);
      const allowedNewFiles = newFiles.slice(0, maxFiles - files.length);
      setFiles((prevFiles) => [...prevFiles, ...allowedNewFiles]);
      onChange && onChange([...files, ...allowedNewFiles]);
      return;
    }
    
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    onChange && onChange([...files, ...newFiles]);
  };

  const handleRemoveFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onChange && onChange(newFiles);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: true,
    noClick: true,
    onDrop: handleFileChange,
    onDropRejected: (error) => {
      console.log(error);
    },
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    }
  });

  const cn = (...classes) => {
    return classes.filter(Boolean).join(' ');
  };

  return (
    <div className="w-full" {...getRootProps()}>
      <motion.div
        onClick={handleClick}
        whileHover="animate"
        className="p-10 group/file block rounded-lg cursor-pointer w-full relative overflow-hidden"
      >
        <input
          ref={fileInputRef}
          id="file-upload-handle"
          type="file"
          onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
          className="hidden"
          multiple
        />
        <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
          <GridPattern />
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="relative z-20 font-sans font-bold text-neutral-700 dark:text-neutral-300 text-base">
            Subir archivos
          </p>
          <p className="relative z-20 font-sans font-normal text-neutral-400 dark:text-neutral-400 text-base mt-2">
            Arrastra y suelta tus archivos aquí o haz clic para seleccionarlos
          </p>
          <div className="relative w-full mt-10 max-w-xl mx-auto">
            {files.length > 0 &&
              files.map((file, idx) => (
                <motion.div
                  key={"file" + idx}
                  layoutId={idx === 0 ? "file-upload" : "file-upload-" + idx}
                  className={cn(
                    "relative overflow-hidden z-40 bg-white dark:bg-neutral-900 flex flex-col items-start justify-start md:h-24 p-4 mt-4 w-full mx-auto rounded-md",
                    "shadow-sm"
                  )}
                >
                  <div className="flex justify-between w-full items-center gap-2 sm:gap-4">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                      className="text-base text-neutral-700 dark:text-neutral-300 truncate max-w-[150px] sm:max-w-xs"
                    >
                      {file.name}
                    </motion.div>

                    <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        layout
                        className="rounded-lg px-2 py-1 w-fit flex-shrink-0 text-xs sm:text-sm text-neutral-600 bg-[#FFC600] dark:text-white shadow-input hidden sm:block"
                      >
                        <span className="text-black dark:text-white">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </span>
                      </motion.div>
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFile(idx);
                        }}
                        className="p-2 sm:p-1 hover:bg-red-100 rounded-full text-red-500 flex-shrink-0 z-50"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 6L6 18M6 6l12 12"></path>
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="flex text-sm md:flex-row flex-col items-start md:items-center w-full mt-2 justify-between text-neutral-600 dark:text-neutral-400">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                      className="px-1 py-0.5 rounded-md bg-gray-100 dark:bg-neutral-800 "
                    >
                      {file.type || 'Desconocido'}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                    >
                      modificado{" "}
                      {new Date(file.lastModified).toLocaleDateString()}
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            {!files.length && (
              <motion.div
                layoutId="file-upload"
                variants={mainVariant}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
                className={cn(
                  "relative group-hover/file:shadow-2xl z-40 bg-white dark:bg-neutral-900 flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md",
                  "shadow-[0px_10px_50px_rgba(0,0,0,0.1)]"
                )}
              >
                {isDragActive ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-neutral-600 flex flex-col items-center"
                  >
                    Suelta aquí
                    <IconUpload className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                  </motion.div>
                ) : (
                  <IconUpload className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
                )}
              </motion.div>
            )}

            {!files.length && (
              <motion.div
                variants={secondaryVariant}
                className="absolute opacity-0 border border-dashed border-sky-400 inset-0 z-30 bg-transparent flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md"
              ></motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export function GridPattern() {
  const columns = 41;
  const rows = 11;
  return (
    <div className="flex bg-gray-100 dark:bg-neutral-900 flex-shrink-0 flex-wrap justify-center items-center gap-x-px gap-y-px scale-105">
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: columns }).map((_, col) => {
          const index = row * columns + col;
          return (
            <div
              key={`${col}-${row}`}
              className={`w-10 h-10 flex flex-shrink-0 rounded-[2px] ${
                index % 2 === 0
                  ? "bg-gray-50 dark:bg-neutral-950"
                  : "bg-gray-50 dark:bg-neutral-950 shadow-[0px_0px_1px_3px_rgba(255,255,255,1)_inset] dark:shadow-[0px_0px_1px_3px_rgba(0,0,0,1)_inset]"
              }`}
            />
          );
        })
      )}
    </div>
  );
}

export default FileUpload;
