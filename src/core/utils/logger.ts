import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';
import { config } from '../../config';
import { getRequestId } from './context/asyncContext';

const requestIdFormat = winston.format((info) => {
  const requestId = getRequestId();
  if (requestId && requestId !== 'unknown') {
    info.requestId = requestId;
  }
  return info;
});

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  requestIdFormat(),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  requestIdFormat(),
  winston.format.printf(({ timestamp, level, message, requestId, ...meta }) => {
    let msg = `${timestamp} [${level}]`;
    
    if (requestId) {
      msg += ` [${requestId}]`;
    }
    
    msg += `: ${message}`;
    
    const metaKeys = Object.keys(meta);
    if (metaKeys.length > 0) {
      const filteredMeta = { ...meta };
      delete filteredMeta.timestamp;
      delete filteredMeta.level;
      delete filteredMeta.message;
      
      if (Object.keys(filteredMeta).length > 0) {
        msg += ` ${JSON.stringify(filteredMeta)}`;
      }
    }
    
    return msg;
  })
);

// Transport for all logs
const allLogsTransport = new DailyRotateFile({
  filename: path.join('logs', 'application-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '14d',
  format: logFormat,
});

// Transport for error logs
const errorLogsTransport = new DailyRotateFile({
  level: 'error',
  filename: path.join('logs', 'error-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '30d',
  format: logFormat,
});

export const logger = winston.createLogger({
  level: config.logging.level || 'info',
  format: logFormat,
  transports: [
    allLogsTransport,
    errorLogsTransport,
    // Console transport for development
    new winston.transports.Console({
      format: consoleFormat,
      level: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
    }),
  ],
});

export const createChildLogger = (defaultMeta: Record<string, any>) => {
  return logger.child(defaultMeta);
};

export const morganStream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

/**
 * Log with explicit request ID (for edge cases outside normal request flow)
 * 
 * @param level - Log level
 * @param message - Log message
 * @param requestId - Request ID to include
 * @param meta - Additional metadata
 */
export const logWithRequestId = (
  level: string,
  message: string,
  requestId: string,
  meta?: Record<string, any>
) => {
  logger.log(level, message, { ...meta, requestId });
};

export default logger;
