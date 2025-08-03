import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import employeeRoute from './src/routes/employee.js'
import activityRoute from './src/routes/activity.js'
import mainAreaRoute from './src/routes/mainArea.js'
import mainAreaAreaRoute from './src/routes/mainAreaArea.js'
import areaRoute from './src/routes/area.js'
import proyectRoute from './src/routes/proyect.js'
import countryRoute from './src/routes/country.js'
import registerEmployeeRoute from './src/routes/registerEmployee.js'
import PermitRoute from './src/routes/permit.js'
import WorkTeamRoute from "./src/routes/workTeams.js";
import passwordRecoveryRoute from "./src/routes/passwordRecoveryRoute.js"
import loginRoute from './src/routes/login.js'
import logoutRoute from "./src/routes/logout.js";
import resourceRoute from "./src/routes/resources.js";
import aiRoute from "./src/routes/ai.js";
import loginController from "./src/controllers/LoginController.js";
import userRoute from './src/routes/user.js';
import globalRoute from './src/routes/global.js';

import cors from "cors";
import logger from "../../packages/logger/index.js";

// Importar middlewares de optimización
import setupCompression from "./src/middleware/compression.js";
import setupRequestLogger from "./src/middleware/requestLogger.js";
import { cacheMiddleware } from "./src/middleware/cacheMiddleware.js";
import { validateAuthToken } from "./src/middleware/validateAuthToken.js";

// Inicializar aplicación Express
const app = express();

// Registrar inicio de aplicación
logger.info('⚡ Iniciando servidor DayLog Backend');
const serverStartTime = Date.now();

// Configuración CORS completa para permitir todos los orígenes del frontend
app.use(
  cors({
    // Permitir tanto el puerto 5173 (dev) como 1234 (preview) para el frontend
    origin: ["http://localhost:5173", "http://localhost:1234"],
    credentials: true, // Permitir envío de cookies y credenciales
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"]
  })
);

// Seguridad con Helmet (configuración básica)
app.use(helmet({
  contentSecurityPolicy: false, // Ajustar si causa problemas con frontend
  crossOriginEmbedderPolicy: false // Para facilitar el desarrollo
}));

// Middleware para logging de peticiones
setupRequestLogger(app);

// Middlewares estándar
app.use(express.json({ limit: '1mb' })); // Limitar tamaño de JSON
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());

// Configurar la compresión para optimizar respuestas HTTP
setupCompression(app);

// Caché para rutas estáticas o que cambian poco
app.use('/api/country', cacheMiddleware(3600)); // 1 hora para países (raramente cambian)
app.use('/api/mainArea', cacheMiddleware(1800)); // 30 minutos para áreas principales
app.use('/api/areas', cacheMiddleware(1800)); // 30 minutos para áreas

// Rutas con caché específico o protección por token
app.use("/api/employee", employeeRoute)
app.use("/api/registerEmployee", registerEmployeeRoute)
app.use("/api/activity", activityRoute)
app.use("/api/country", countryRoute) // Ya tiene caché configurado arriba
app.use("/api/mainArea", mainAreaRoute) // Ya tiene caché configurado arriba
app.use("/api/areas", areaRoute) // Ya tiene caché configurado arriba
app.use("/api/mainAreaArea", mainAreaAreaRoute)
app.use("/api/proyect", proyectRoute)
app.use("/api/permit", PermitRoute)
app.use("/api/workteams", WorkTeamRoute)
app.use("/api/passwordRecovery", passwordRecoveryRoute)
app.use("/api/login", loginRoute)
app.use("/api/logout", logoutRoute)
app.use("/api/users", userRoute)
app.use("/api/resources", resourceRoute)
app.use("/api/ai", aiRoute)
app.use("/api/global", globalRoute);

// Endpoint directo para verificación de token (soluciona problema 404)
app.post("/api/verify-token", (req, res) => {
  logger.debug('✅ Recibida solicitud en /api/verify-token');
  return loginController.verifyToken(req, res);
});

// Middleware para manejo de errores
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  
  // Registrar error con toda la información relevante
  logger.error(`❌ Error: ${err.message}`, {
    statusCode,
    path: req.path,
    method: req.method,
    stack: err.stack,
    requestBody: req.body,
    requestParams: req.params,
    requestQuery: req.query
  });
  
  // Enviar respuesta al cliente
  res.status(statusCode).json({
    error: process.env.NODE_ENV === 'production' ? 'Error interno del servidor' : err.message
  });
});

// Registrar tiempo total de arranque
logger.info(`✅ Servidor DayLog Backend listo en ${Date.now() - serverStartTime}ms`);

// Manejar señales de apagado
process.on('SIGTERM', () => {
  logger.info('⛔ Señal SIGTERM recibida, cerrando servidor...');
  // Aquí podríamos cerrar conexiones de DB, etc.
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('⛔ Señal SIGINT recibida, cerrando servidor...');
  // Aquí podríamos cerrar conexiones de DB, etc.
  process.exit(0);
});

export default app;