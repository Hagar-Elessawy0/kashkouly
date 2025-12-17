import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/appError';
import { logger } from '../utils/logger';
import { sendErrorResponse } from '../utils/response';
import { ErrorCodes } from '../errors/errorCodes';
import { HTTP_STATUS } from '../../shared/constants';
import { config } from '../../config';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const isProduction = config.env === 'production';

  logger.error('Error occurred:', {
    message: err.message,
    stack: isProduction ? undefined : err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    requestId: req.requestId,
  });

  // Handle operational errors (AppError)
  if (err instanceof AppError) {
    sendErrorResponse(res, err.statusCode, err.message, err.code);
    return;
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    sendErrorResponse(res, HTTP_STATUS.BAD_REQUEST, err.message, ErrorCodes.VALIDATION_ERROR);
    return;
  }

  // Handle Mongoose cast errors
  if (err.name === 'CastError') {
    sendErrorResponse(res, HTTP_STATUS.BAD_REQUEST, 'Invalid ID format', ErrorCodes.INVALID_INPUT);
    return;
  }

  // Handle Mongoose duplicate key errors
  if (err.name === 'MongoServerError' && (err as any).code === 11000) {
    const field = Object.keys((err as any).keyPattern)[0];
    sendErrorResponse(res, HTTP_STATUS.CONFLICT, `${field} already exists`, ErrorCodes.DUPLICATE_ENTRY);
    return;
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    sendErrorResponse(res, HTTP_STATUS.UNAUTHORIZED, 'Invalid token', ErrorCodes.TOKEN_INVALID);
    return;
  }

  if (err.name === 'TokenExpiredError') {
    sendErrorResponse(res, HTTP_STATUS.UNAUTHORIZED, 'Token expired', ErrorCodes.TOKEN_EXPIRED);
    return;
  }

  // Default to 500 server error
  sendErrorResponse(
    res,
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
    config.env === 'production' ? 'Internal server error' : err.message,
    ErrorCodes.INTERNAL_SERVER_ERROR
  );
};
