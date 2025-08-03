/**
 * Middleware para registrar todas las peticiones HTTP
 * Captura información detallada para monitoreo y diagnóstico
 */
import logger from '../../../../packages/logger/index.js';

export default function setupRequestLogger(app) {
  app.use((req, res, next) => {
    // Capturar tiempo de inicio
    req.startTime = Date.now();
    
    // Capturar método original para interceptar la finalización
    const originalEnd = res.end;
    
    // Log al inicio de la petición
    logger.info(`➡️ ${req.method} ${req.originalUrl}`, {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.get('user-agent') || 'desconocido'
    });
    
    // Interceptar el final de la respuesta
    res.end = function(...args) {
      // Cálculo de tiempo
      const responseTime = Date.now() - req.startTime;
      
      // Determinar nivel de log basado en código de estado
      const statusCode = res.statusCode;
      const logLevel = statusCode >= 500 ? 'error' : 
                      statusCode >= 400 ? 'warn' : 'info';
      
      // Log con detalles de la respuesta
      logger[logLevel](`⬅️ ${req.method} ${req.originalUrl} ${statusCode} ${responseTime}ms`, {
        method: req.method,
        url: req.originalUrl,
        statusCode: statusCode,
        responseTime: `${responseTime}ms`,
        contentLength: res.get('content-length') || 'desconocido'
      });
      
      // Llamar al método original
      return originalEnd.apply(this, args);
    };
    
    next();
  });
  
  logger.info('✅ Middleware de registro de peticiones configurado');
}
