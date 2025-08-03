// @daylog/logger
import winston from 'winston';
const { combine, timestamp, printf, colorize, json } = winston.format;

// Formato personalizado para logs en desarrollo
const logFormat = printf(({ level, message, timestamp, ...meta }) => {
  return `${timestamp} [${level.toUpperCase()}] ${message} ${
    Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
  }`;
});

// Configuración del logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    process.env.NODE_ENV === 'production' ? json() : combine(colorize(), logFormat)
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log' 
    })
  ],
  exceptionHandlers: [
    new winston.transports.File({ 
      filename: 'logs/exceptions.log' 
    })
  ]
});

// Capturar promesas no manejadas
process.on('unhandledRejection', (reason) => {
  logger.error('Promesa no manejada rechazada', { reason });
  // En producción, quizás no queremos arrojar el error para evitar caídas
  if (process.env.NODE_ENV !== 'production') {
    throw reason;
  }
});

// Métodos disponibles
// logger.error, logger.warn, logger.info, logger.verbose, logger.debug

export default logger;
