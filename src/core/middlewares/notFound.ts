import { Request, Response } from 'express';
import { sendErrorResponse } from '../utils/response';
import { HTTP_STATUS } from '../../shared/constants';
import { ErrorCodes } from '../errors/errorCodes';

export const notFound = (req: Request, res: Response): void => {
  sendErrorResponse(
    res,
    HTTP_STATUS.NOT_FOUND,
    `Route ${req.originalUrl} not found`,
    ErrorCodes.NOT_FOUND
  );
};
