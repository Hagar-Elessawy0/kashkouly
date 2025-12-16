import { Application } from 'express';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import cors from 'cors';
import { apiLimiter } from './rateLimiter';
import { config } from '../../config';

export const applySecurity = (app: Application) => {
  // 1) Allow Express to trust proxies
  app.set('trust proxy', 1);

  // 2) Security HTTP headers
  app.use(helmet());

  // 3) CORS configuration
  app.use(
    cors({
      origin: [config.cors.origin],
      credentials: true,
      optionsSuccessStatus: 200,
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin',
        'Access-Control-Request-Method',
        'Access-Control-Request-Headers',
        'X-CSRF-Token',
        'X-API-Key',
        'X-Request-ID',
      ],
      exposedHeaders: [
        'Authorization',
        'X-Total-Count',
        'X-Page-Count',
        'X-Current-Page',
        'X-Per-Page',
        'X-API-Version',
        'X-Request-ID',
        'Content-Range',
        'Content-Disposition',
        'X-Request-ID',
        'X-Correlation-ID',
        'Request-ID',
      ],
    })
  );

  // 4) Prevent DOS / Brute Force attacks
  app.use(`${config.apiVersion}/*`, apiLimiter);

  // 5) Prevent NoSQL Injection
  app.use(mongoSanitize());

  // 6) Prevent HTTP Parameter Pollution
  app.use(hpp());

};