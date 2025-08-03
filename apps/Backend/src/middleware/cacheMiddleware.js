/**
 * Middleware para implementar caché de respuestas HTTP
 * Mejora significativamente los tiempos de respuesta para peticiones repetitivas
 */
import NodeCache from 'node-cache';
import logger from '../../../../packages/logger/index.js';

// Crear instancia de caché con TTL de 5 minutos por defecto
const cache = new NodeCache({ 
  stdTTL: 300,  // 5 minutos por defecto
  checkperiod: 120, // Verificar expiración cada 2 minutos
  useClones: false  // Mejor rendimiento
});

/**
 * Crea un middleware de caché para rutas específicas
 * @param {number} ttl - Tiempo de vida en segundos (0 = sin expiración)
 * @param {function} keyGenerator - Función para generar la clave de caché
 * @returns {function} Middleware de Express
 */
export function cacheMiddleware(ttl = 300, keyGenerator = null) {
  return (req, res, next) => {
    // Saltarse caché para métodos no-GET o si hay cabecera específica
    if (req.method !== 'GET' || req.headers['x-skip-cache']) {
      return next();
    }

    // Generar clave de caché (personalizable)
    const key = keyGenerator ? 
      keyGenerator(req) : 
      `${req.originalUrl || req.url}`;
    
    // Intentar recuperar de caché
    const cachedResponse = cache.get(key);
    
    if (cachedResponse) {
      // Enviar respuesta desde caché
      logger.debug(`🚀 Respuesta cacheada: ${req.originalUrl}`, { 
        cacheKey: key,
        method: req.method 
      });
      
      // Establecer cabecera para indicar que es una respuesta cacheada
      res.set('X-Cache', 'HIT');
      
      // Enviar directamente el cuerpo cacheado con el mismo tipo de contenido
      res.contentType(cachedResponse.contentType);
      return res.status(200).send(cachedResponse.body);
    }

    // Guardar respuesta original
    const originalSend = res.send;
    
    // Interceptar res.send() para guardar en caché
    res.send = function(body) {
      // Solo cachear respuestas exitosas
      if (res.statusCode === 200) {
        // Guardar en caché con TTL
        cache.set(key, { 
          body: body, 
          contentType: res.get('Content-Type') || 'application/json'
        }, ttl);
        
        // Establecer cabecera para indicar que es una respuesta no cacheada
        res.set('X-Cache', 'MISS');
        
        logger.debug(`💾 Guardado en caché: ${req.originalUrl}`, { 
          cacheKey: key,
          ttl: `${ttl} segundos`,
          contentLength: Buffer.byteLength(body, 'utf8')
        });
      }
      
      // Enviar respuesta normalmente
      return originalSend.call(this, body);
    };
    
    next();
  };
}

/**
 * Limpia entradas específicas de caché
 * @param {string|RegExp} pattern - Patrón para limpiar (string o expresión regular)
 * @returns {number} Número de entradas eliminadas
 */
export function clearCache(pattern) {
  if (!pattern) return 0;
  
  const keys = cache.keys();
  let deleted = 0;
  
  keys.forEach(key => {
    if (typeof pattern === 'string' && key.includes(pattern) || 
        pattern instanceof RegExp && pattern.test(key)) {
      cache.del(key);
      deleted++;
    }
  });
  
  logger.info(`🗑️ Caché limpiada: ${deleted} entradas eliminadas`, { pattern: String(pattern) });
  return deleted;
}

/**
 * Devuelve estadísticas de la caché
 * @returns {Object} Estadísticas de la caché
 */
export function getCacheStats() {
  const stats = cache.getStats();
  logger.info(`📊 Estadísticas de caché`, stats);
  return stats;
}

export default {
  cacheMiddleware,
  clearCache,
  getCacheStats,
  cache
};
