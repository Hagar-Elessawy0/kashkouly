import { Request, Response, NextFunction } from 'express';
import { runWithContext } from '../utils/context/asyncContext';
import { generateRequestId, validateRequestId } from '../utils/requestIdGenerator';
import { RequestIdOptions, REQUEST_ID_HEADERS } from '../../types/requestId.types';
import { config } from '../../config';
import logger from '../utils/logger';

const DEFAULT_OPTIONS: Required<RequestIdOptions> = {
  headerName: 'X-Request-ID',
  includeInResponse: config.env !== 'production',
  generator: generateRequestId,
  trustIncomingId: true,
  maxIdLength: 128,
};

const extractRequestIdFromHeaders = (
  req: Request,
  options: Required<RequestIdOptions>
): string | null => {
  if (!options.trustIncomingId) {
    return null;
  }

  for (const headerName of REQUEST_ID_HEADERS) {
    const value = req.get(headerName);
    if (value) {
      const validated = validateRequestId(value, options.maxIdLength);
      if (validated) {
        return validated;
      }
    }
  }

  return null;
};

export const requestIdMiddleware = (options: RequestIdOptions = {}) => {
  const config: Required<RequestIdOptions> = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      let requestId = extractRequestIdFromHeaders(req, config);

      if (!requestId) {
        requestId = config.generator();
      }

      req.requestId = requestId;

      res.setHeader(config.headerName, requestId);

      runWithContext(requestId, () => {
        if (config.includeInResponse) {
          injectRequestIdIntoResponse(res, requestId);
        }

        next();
      });
    } catch (error) {
      const fallbackId = generateRequestId();
      req.requestId = fallbackId;
      res.setHeader(config.headerName, fallbackId);
      
      logger.error('Request ID middleware error:', error);
      
      runWithContext(fallbackId, () => next());
    }
  };
};

/**
 * Inject request ID into JSON responses
 * Intercepts res.json to add requestId to meta field
 * 
 * @param res - Express response object
 * @param requestId - The request ID to inject
 */
const injectRequestIdIntoResponse = (res: Response, requestId: string): void => {
  const originalJson = res.json.bind(res);

  res.json = function (body: any): Response {
    if (body && typeof body === 'object' && !Array.isArray(body)) {
      if ('meta' in body && typeof body.meta === 'object') {
        body.meta.requestId = requestId;
      } else if ('success' in body) {
        body.meta = {
          ...(body.meta || {}),
          requestId,
        };
      }
    }

    return originalJson(body);
  };
};

/**
 * Create a simple request ID middleware with defaults
 * Use this for quick setup without custom configuration
 * 
 * @example
 * ```typescript
 * app.use(requestId());
 * ```
 */
export const requestId = requestIdMiddleware;

export default requestIdMiddleware();
