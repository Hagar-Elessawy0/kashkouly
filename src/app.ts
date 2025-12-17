import express, { Application } from 'express';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { config } from './config';
import { requestIdMiddleware } from './core/middlewares/requestId';
import { requestLogger } from './core/middlewares/requestLogger';
import { errorHandler } from './core/middlewares/errorHandler';
import { applySecurity } from './core/middlewares/security';
import { apiRoutes } from './routes';
import morgan from 'morgan';
import { morganStream } from './core/utils/logger';
import { notFound } from './core/middlewares/notFound';

export const createApp = (): Application => {
  const app = express();

  // Security middleware
  applySecurity(app);

  // Disable 'X-Powered-By' header
  app.disable('x-powered-by');

  // Body parsers
  app.use(express.json({ limit: config.bodyLimit.json }));
  app.use(express.urlencoded({ extended: true, limit: config.bodyLimit.urlencoded }));

  // Cookie parser
  app.use(cookieParser());

  // Compression
  app.use(compression());

  // Request ID tracking
  app.use(requestIdMiddleware({
    headerName: 'X-Request-ID',
    trustIncomingId: true,
    includeInResponse: config.env !== 'production',
  }));

  // HTTP request logging
  app.use(morgan('combined', { stream: morganStream }));

  // Request logging
  app.use(requestLogger);

  // API routes
  app.use(config.apiVersion, apiRoutes);

  // 404 handler
  app.use(notFound);

  // Global error handler
  app.use(errorHandler);

  return app;
};