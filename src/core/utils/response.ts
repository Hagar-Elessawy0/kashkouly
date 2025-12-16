import { Response } from 'express';
import { config } from '../../config';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code?: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    environment?: string;
    requestId?: string;
    [key: string]: any;
  };
}

export const sendSuccessResponse = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T,
  meta?: Record<string, any>
): void => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      environment: config.env,
      ...meta,
    },
  };

  res.status(statusCode).json(response);
};

export const sendErrorResponse = (
  res: Response,
  statusCode: number,
  message: string,
  code?: string,
  details?: any
): void => {
  const response: ApiResponse = {
    success: false,
    message,
    error: {
      code,
      details,
    },
    meta: {
      timestamp: new Date().toISOString(),
      environment: config.env,
    },
  };

  res.status(statusCode).json(response);
};
