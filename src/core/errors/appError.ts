import { getRequestId } from '../utils/context/asyncContext';


export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly code?: string;
  public readonly timestamp: string;

  constructor( message: string, statusCode: number, code: string, isOperational?: boolean) {
    super(message);
    
    this.statusCode = statusCode;
    this.isOperational = isOperational ?? true;
    this.code = code ?? 'INTERNAL_ERROR';
    this.timestamp = new Date().toISOString();
    
    Object.setPrototypeOf(this, AppError.prototype);
    
    Error.captureStackTrace(this, this.constructor);
    
  }

  toJSON() {
    return {
      error: {
        message: this.message,
        code: this.code,
        statusCode: this.statusCode,
        isOperational: this.isOperational,
        timestamp: this.timestamp,
        requestId: getRequestId(), 
      }
    };
  }

  static isAppError(error: any): error is AppError {
    return error instanceof AppError;
  }
}