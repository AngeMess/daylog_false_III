// Middleware de compresión para optimizar las respuestas HTTP
import compression from 'compression';
import zlib from 'zlib';
import logger from '../../../../packages/logger/index.js';

/**
 * Configura la compresión para el servidor Express
 * @param {import('express').Application} app - Instancia de la aplicación Express
 */
export default function setupCompression(app) {
  // Monitoreo de inicio de la compresión
  const startTime = Date.now();

  const compressionOptions = {
    // Nivel de compresión (0-9)
    level: zlib.constants.Z_BEST_COMPRESSION,
    // Umbral de tamaño mínimo para comprimir (en bytes)
    threshold: 512, // Reducido para comprimir más respuestas
    // Filtrar qué respuestas comprimir
    filter: (req, res) => {
      // No comprimir si el cliente lo solicita explícitamente
      if (req.headers['x-no-compression']) {
        return false;
      }
      // No comprimir contenido ya comprimido
      const type = res.getHeader('Content-Type') || '';
      if (type.match(/^image/) || type.match(/^audio/) || type.match(/^video/)) {
        return false;
      }
      return compression.filter(req, res);
    },
    // Cache control para mejorar rendimiento
    cacheSize: 128 * 1024, // Tamaño de caché para la compresión
    // Especificar los métodos HTTP a comprimir
    method: (req) => {
      return ['GET', 'POST', 'PUT', 'DELETE'].includes(req.method);
    }
  };

  app.use(compression(compressionOptions));

  // Registrar estadísticas de la configuración
  logger.info('✅ Middleware de compresión configurado', {
    compressionLevel: compressionOptions.level,
    threshold: compressionOptions.threshold,
    setupTime: `${Date.now() - startTime}ms`
  });

  // Middleware para registrar estadísticas de compresión
  app.use((req, res, next) => {
    // Tamaño original antes de la respuesta
    const originalSend = res.send;
    
    res.send = function(body) {
      const originalSize = Buffer.isBuffer(body) ? body.length : Buffer.byteLength(body);
      
      // Llamar al método original
      originalSend.call(this, body);
      
      // Tamaño después de la compresión (si se aplicó)
      const compressedSize = parseInt(res.getHeader('content-length') || '0');
      
      if (originalSize > 0 && compressedSize > 0 && originalSize > compressedSize) {
        const ratio = ((originalSize - compressedSize) / originalSize * 100).toFixed(2);
        logger.debug(`Compresión: ${ratio}% de reducción`, {
          path: req.path,
          originalSize,
          compressedSize,
          method: req.method
        });
      }
    };
    
    next();
  });
}
