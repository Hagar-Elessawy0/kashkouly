import rateLimit from 'express-rate-limit';
import { sendErrorResponse } from '../utils/response';
import { HTTP_STATUS } from '../../shared/constants/index';
import { config } from '../../config';

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    sendErrorResponse(
      res,
      HTTP_STATUS.TOO_MANY_REQUESTS,
      'Too many requests from this IP, please try again later',
      'RATE_LIMIT_EXCEEDED'
    );
  },
  skip: (req) => {
    return (
          req.path === '/health' || 
          req.path === '/favicon.ico' ||
          req.method === 'OPTIONS'
        );
  }
});

// Strict rate limiter for auth routes
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: 'Too many authentication attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  handler: (req, res) => {
    sendErrorResponse(
      res,
      HTTP_STATUS.TOO_MANY_REQUESTS,
      'Too many authentication attempts, please try again later',
      'RATE_LIMIT_EXCEEDED'
    );
  },
});

// Upload rate limiter
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  message: 'Too many upload requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    sendErrorResponse(
      res,
      HTTP_STATUS.TOO_MANY_REQUESTS,
      'Too many upload requests, please try again later',
      'RATE_LIMIT_EXCEEDED'
    );
  },
});
