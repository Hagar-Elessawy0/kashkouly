import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { sendSuccessResponse } from '../../core/utils/response';
import { HTTP_STATUS } from '../../shared/constants';
import { config } from '../../config';
import asyncHandler from 'express-async-handler';

const authService = new AuthService();

export class AuthController {
  static register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const result = await authService.register(req.body);

    res.setHeader('Authorization', result.accessToken);
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: config.env === 'production',
      sameSite: config.env === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    sendSuccessResponse(res, HTTP_STATUS.CREATED, result.message, { userId: result.userId });
  });

  static login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const result = await authService.login(req.body);

    res.setHeader('Authorization', result.accessToken);
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: config.env === 'production',
      sameSite: config.env === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    sendSuccessResponse(res, HTTP_STATUS.OK, 'Login successful', { user: result.user });
  });

  static refreshToken = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req.cookies.refreshToken;
    const result = await authService.refreshToken(refreshToken);
    res.setHeader('Authorization', `Bearer ${result.accessToken}`);
    sendSuccessResponse(res, HTTP_STATUS.OK, 'Token refreshed successfully and new access token sent in headers');
  });
  
  static verifyEmail = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { token } = req.query;
    const result = await authService.verifyEmail(token as string);
    sendSuccessResponse(res, HTTP_STATUS.OK, result.message);
  });

  static resendVerificationEmail = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const email = req.user!.email;
    const result = await authService.resendVerificationEmail(email);
    sendSuccessResponse(res, HTTP_STATUS.OK, result.message);
  });

  static forgotPassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;
    const result = await authService.forgotPassword(email);
    sendSuccessResponse(res, HTTP_STATUS.OK, result.message);
  });

  static resetPassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { newPassword } = req.body;
    const { token } = req.query;
    const result = await authService.resetPassword(token as string, newPassword);
    sendSuccessResponse(res, HTTP_STATUS.OK, result.message);
  });

  static logout = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;
    const result = await authService.logout(userId);
    sendSuccessResponse(res, HTTP_STATUS.OK, result.message);
  });

  static getProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    sendSuccessResponse(res, HTTP_STATUS.OK, 'Profile retrieved successfully', req.user);
  });
}
