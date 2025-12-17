import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { sendErrorResponse } from '../utils/response';
import { ErrorCodes } from '../errors/errorCodes';
import { HTTP_STATUS } from '../../shared/constants';

export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
        headers: req.headers,
        cookies: req.cookies,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        sendErrorResponse(res, HTTP_STATUS.BAD_REQUEST, 'Validation failed', ErrorCodes.VALIDATION_ERROR , errors);
      } else {
        next(error);
      }
    }
  };
};
