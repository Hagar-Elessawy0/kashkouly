import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { sendSuccessResponse } from '../../core/utils/response';
import { HTTP_STATUS } from '../../shared/constants';

export const healthCheck = asyncHandler(async (req: Request, res: Response) => {
  sendSuccessResponse(res, HTTP_STATUS.OK, 'Server is healthy');
});