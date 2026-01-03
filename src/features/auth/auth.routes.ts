import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validate } from '../../core/middlewares/validate';
import { authenticate } from '../../core/middlewares/auth';
import { authLimiter, resendVerificationLimiter } from '../../core/middlewares/rateLimiter';
import {
  registerSchema,
  createStudent,
  createInstructor,
  createAdmin,
  loginSchema,
  refreshTokenSchema,
  verifyEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} from './auth.validation';

const router = Router();

router.post('/register/student', authLimiter, validate(registerSchema), validate(createStudent), AuthController.registerStudent);
router.post('/register/instructor', authLimiter, validate(registerSchema), validate(createInstructor), AuthController.registerInstructor);
router.post('/register/admin', authLimiter, validate(registerSchema), validate(createAdmin), AuthController.registerAdmin);
router.post('/login', authLimiter, validate(loginSchema), AuthController.login);
router.post('/refresh-token', validate(refreshTokenSchema), AuthController.refreshToken);
router.post('/verify-email', validate(verifyEmailSchema), AuthController.verifyEmail);
router.post('/resend-verification', authenticate, resendVerificationLimiter, AuthController.resendVerificationEmail);
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), AuthController.forgotPassword);
router.post('/reset-password', authLimiter, validate(resetPasswordSchema), AuthController.resetPassword);
router.post('/logout', authenticate, AuthController.logout);
router.patch('/change-password', authenticate, authLimiter, validate(changePasswordSchema), AuthController.changePassword);
router.get('/profile', authenticate, AuthController.getProfile);

export { router as authRoutes };
