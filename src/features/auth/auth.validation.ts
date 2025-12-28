import { z } from 'zod';
import { UserRole } from '../../shared/enums/userRole';
import { EducationStage } from '../../shared/enums/educationStage';
import { Subject } from '../../shared/enums/subjects';
import { PERMISSIONS} from '../../shared/constants';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(50).trim(),
    email: z.string().email().trim(),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
    role: z.nativeEnum(UserRole).optional(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords don\'t match',
    path: ['confirmPassword'],
  }),
});

export const createStudent = z.object({
  body: z.object({
    stage: z.nativeEnum(EducationStage),
    parentPhone:
      z.string()
      .regex(/^[0-9]{10,15}$/, { 
        message: 'Invalid phone number format' 
      })
      .optional(),
  })
});

export const createInstructor = z.object({
  body: z.object({
    bio: z.string().trim(),
    subjects: z.array(z.nativeEnum(Subject)).min(1, 'Instructor must have at least one subject'),
  })
});

export const createAdmin = z.object({
  body: z.object({
    permissions: z.array(z.nativeEnum(PERMISSIONS)).min(1, 'Admin must have at least one permission'),
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email().trim(),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const refreshTokenSchema = z.object({
  cookies: z.object({
    refreshToken: z.string().nonempty('Refresh token is required'),
  }),
});

export const verifyEmailSchema = z.object({
  query: z.object({
    token: z.string().min(1, 'Verification token is required'),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email().trim(),
  }),
});

export const resetPasswordSchema = z.object({
  query: z.object({
    token: z.string().min(1, 'Reset token is required'),
  }),
  body: z.object({
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmNewPassword: z.string(),
  }).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Passwords don\'t match',
  }),
});
