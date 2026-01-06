import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { sendSuccessResponse } from '../../core/utils/response';
import { HTTP_STATUS } from '../../shared/constants';
import { config } from '../../config';
import asyncHandler from 'express-async-handler';
import { CreateInstructorDTO, CreateStudentDTO, CreateAdminDTO } from './auth.types';
import { UserRole } from '../../shared/enums/userRole';

const authService = new AuthService();

export class AuthController {
  static registerStudent = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const studentData: CreateStudentDTO = {
      stage: req.body.stage,
      parentPhone: req.body.parentPhone
    };

    const userData = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: UserRole.STUDENT
    };
    const result = await authService.registerStudent(studentData, userData);

    res.setHeader('Authorization', result.accessToken as string);
    res.cookie('refreshToken', result.refreshToken as string, {
      httpOnly: true,
      secure: config.env === 'production',
      sameSite: config.env === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    sendSuccessResponse(res, HTTP_STATUS.CREATED, result.message, { userId: result.userId, studentId: result.studentId });
  });

  static registerInstructor = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const instructorData: CreateInstructorDTO = {
      bio: req.body.bio,
      subjects: req.body.subjects,
    };

    const userData = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: UserRole.INSTRUCTOR
    };
    const result = await authService.registerInstructor(instructorData, userData);
    sendSuccessResponse(res, HTTP_STATUS.CREATED, result.message, { userId: result.userId, instructorId: result.instructorId });
  });

  static registerAdmin = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const adminData: CreateAdminDTO = {
      permissions: req.body.permissions
    };

    const userData = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: UserRole.ADMIN
    };
    const result = await authService.registerAdmin(adminData, userData);
    sendSuccessResponse(res, HTTP_STATUS.CREATED, result.message, { userId: result.userId, adminId: result.adminId });
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
    res.setHeader('Authorization', result.accessToken);
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

  static changePassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;
    const result = await authService.changePassword(userId, req.body);

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: config.env === 'production',
      sameSite: config.env === 'production' ? 'none' : 'lax',
    });

    sendSuccessResponse(res, HTTP_STATUS.OK, result.message);
  });
}
