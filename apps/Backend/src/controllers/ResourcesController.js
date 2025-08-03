import resourcesModel from "../models/Resources.js";
import { v2 as cloudinary } from "cloudinary";
import { config } from "../config.js";
import fs from "fs/promises";

// 1- Configurar Cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.cloudinary_name,
  api_key: config.cloudinary.cloudinary_api_key,
  api_secret: config.cloudinary.cloudinary_api_secret,
});

// 2- Array de funciones vacio
const resourcesController = {};

// Función para validar tipos de archivo permitidos
const isValidFileType = (mimetype) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];
  return allowedTypes.includes(mimetype);
};

// Obtener todos los posts del resources
resourcesController.getResources = async (req, res) => {
  try {
    const { proyect } = req.query;
    let query = {};
    
    // Si se proporciona un ID de proyecto, filtramos por ese proyecto
    if (proyect) {
      query.proyect = proyect;
    }
    
    console.log('Buscando recursos con query:', query);
    
    const posts = await resourcesModel.find(query).populate("proyect");
    console.log(`Se encontraron ${posts.length} recursos${proyect ? ' para el proyecto ' + proyect : ''}`);
    
    res.json(posts);
  } catch (error) {
    console.log("Error getting resources:", error);
    res.status(500).json({ message: "Error getting resources" });
  }
};

// Subir recursos al proyecto
resourcesController.insertResources = async (req, res) => {
  try {
    const { proyect, name } = req.body;
    let documentUrls = [];
    let cloudinaryIds = [];

    // Comprobar si hay un archivo simple o múltiples archivos
    const files = req.files || (req.file && [req.file]);
    
    if (files) {
      for (const file of files) {
        // Validar tipo de archivo
        if (!isValidFileType(file.mimetype)) {
          // Eliminar archivo temporal
          await fs.unlink(file.path).catch(console.error);
          return res.status(400).json({ 
            message: "Tipo de archivo no permitido. Solo se permiten PDF, DOC, DOCX, XLS, XLSX, JPG, JPEG, PNG" 
          });
        }

        try {
          // Para archivos, usar resource_type "auto" para mejor manejo
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "documents",
            resource_type: "auto",
            use_filename: true,
            unique_filename: false,
            format: file.originalname.split('.').pop() // Preservar extensión original
          });
          
          documentUrls.push(result.secure_url);
          cloudinaryIds.push(result.public_id);

          console.log("Archivo subido exitosamente:");
          console.log("- URL:", result.secure_url);
          console.log("- Public ID:", result.public_id);
          console.log("- Resource Type:", result.resource_type);
          console.log("- Format:", result.format);

          // Eliminar archivo temporal después de subirlo a Cloudinary
          await fs.unlink(file.path).catch(console.error);
        } catch (uploadError) {
          // Eliminar archivo temporal si falla la subida
          await fs.unlink(file.path).catch(console.error);
          throw uploadError;
        }
      }
    }

    // Si es un solo archivo, usamos el nombre original del archivo
    // Si son múltiples archivos, guardamos un recurso para cada archivo subido
    if (files && files.length > 0) {
      // Para cada archivo creamos un registro en la base de datos
      for (let i = 0; i < files.length; i++) {
        const fileName = files[i].originalname || 'Sin nombre';
        const fileUrl = documentUrls[i] || '';
        const cloudinaryId = cloudinaryIds[i] || '';
        
        console.log(`Guardando recurso ${i + 1}/${files.length}:`, {
          proyect,
          name: fileName,
          url: fileUrl,
          cloudinaryId
        });
        
        const newResource = new resourcesModel({ 
          proyect,
          name: fileName,
          url: fileUrl, // Guardamos también en el campo url individual para compatibilidad
          urls: [fileUrl], // Y en el array urls para soporte de múltiples URLs
          cloudinaryId, // Igual con cloudinaryId
          cloudinaryIds: [cloudinaryId]
        });
        
        await newResource.save();
      }
      
      // Para la respuesta, solo creamos un objeto para devolver al cliente
      const responseObject = {
        proyect,
        name: files.length > 1 ? `${files.length} archivos subidos` : files[0].originalname,
        urls: documentUrls,
        cloudinaryIds: cloudinaryIds
      };
    
      // Ya hemos guardado cada recurso individualmente en el bucle anterior
      // así que no necesitamos guardar más
    
      res.json({ 
        message: "resources saved",
        count: files.length,
        resource: responseObject
      });
    } else {
      // Caso de seguridad en caso de que no haya archivos (no debería ocurrir)
      res.status(400).json({ message: "No se recibieron archivos para guardar" });
    }
  } catch (error) {
    console.log("Error inserting resource:", error);
    res.status(500).json({ 
      message: "Error saving resource",
      error: error.message 
    });
  }
};

// Actualizar recurso
resourcesController.updateResource = async (req, res) => {
  try {
    const { proyect, name } = req.body;
    let updateData = { proyect, name };

    if (req.file) {
      // Validar tipo de archivo
      if (!isValidFileType(req.file.mimetype)) {
        await fs.unlink(req.file.path).catch(console.error);
        return res.status(400).json({ 
          message: "Tipo de archivo no permitido. Solo se permiten PDF, DOC, DOCX, XLS, XLSX" 
        });
      }

      const currentResource = await resourcesModel.findById(req.params.id);
      
      // Eliminar archivo anterior de Cloudinary
      if (currentResource && currentResource.cloudinaryId) {
        try {
          await cloudinary.uploader.destroy(currentResource.cloudinaryId, {
            resource_type: "raw"
          });
          console.log("Archivo anterior eliminado de Cloudinary");
        } catch (error) {
          // Fallback: intentar sin especificar resource_type
          try {
            await cloudinary.uploader.destroy(currentResource.cloudinaryId);
            console.log("Archivo anterior eliminado con resource_type por defecto");
          } catch (fallbackError) {
            console.log("Error eliminando archivo anterior:", fallbackError.message);
          }
        }
      }

      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "documents",
          resource_type: "auto", // Cambiar de "raw" a "auto"
          use_filename: true,
          unique_filename: false,
          format: req.file.originalname.split('.').pop()
        });
        
        updateData.url = result.secure_url;
        updateData.cloudinaryId = result.public_id;

        // Eliminar archivo temporal
        await fs.unlink(req.file.path).catch(console.error);
      } catch (uploadError) {
        await fs.unlink(req.file.path).catch(console.error);
        throw uploadError;
      }
    }

    const updatedResource = await resourcesModel.findByIdAndUpdate(
      req.params.id, 
      updateData,
      { new: true }
    );

    if (!updatedResource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    res.json({ 
      message: "resource updated", 
      resource: updatedResource 
    });
  } catch (error) {
    console.log("Error updating resource:", error);
    res.status(500).json({ 
      message: "Error updating resource",
      error: error.message 
    });
  }
};

// Eliminar recurso
resourcesController.deleteResource = async (req, res) => {
  try {
    const resource = await resourcesModel.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    if (resource.cloudinaryId) {
      try {
        // Según los logs, los archivos se eliminan correctamente con 'raw'
        await cloudinary.uploader.destroy(resource.cloudinaryId, {
          resource_type: "raw"
        });
        console.log("Archivo eliminado de Cloudinary con resource_type: raw");
      } catch (error) {
        // Si falla con 'raw', intentar sin especificar (por defecto 'image')
        try {
          await cloudinary.uploader.destroy(resource.cloudinaryId);
          console.log("Archivo eliminado de Cloudinary con resource_type por defecto");
        } catch (fallbackError) {
          console.log("Error eliminando de Cloudinary:", fallbackError.message);
        }
      }
    }

    await resourcesModel.findByIdAndDelete(req.params.id);
    
    res.json({ message: "Resource and file deleted successfully" });
  } catch (error) {
    console.log("Error deleting resource:", error);
    res.status(500).json({ 
      message: "Error deleting resource",
      error: error.message 
    });
  }
};

export default resourcesController;