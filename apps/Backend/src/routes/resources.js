  import express from "express";
  import multer from "multer";
  import resourcesController from "../controllers/ResourcesController.js";
  import { config } from "../config.js";

  const router = express.Router();

  // Configurar una carpeta en local que guarde los documentos
  const upload = multer({ dest: "public/" });

  router
    .route("/")
    .get(resourcesController.getResources)
    .post(upload.array("url", 10), resourcesController.insertResources); // Permitir hasta 10 archivos

  router
    .route("/:id")
    .put(upload.array("url", 10), resourcesController.updateResource) // Permitir hasta 10 archivos
    .delete(resourcesController.deleteResource);

  export default router;