import { z } from 'zod';
import { UserRole } from '../../shared/enums/userRole';

export const updateUserSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(50).trim().optional(),
    email: z.string().email().trim().optional(),
  }),
});

export const userIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format'),
  }),
});

export const getAllUsersSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    role: z.nativeEnum(UserRole).optional(),
    isEmailVerified: z.string().transform(val => val === 'true').optional(),
    isBanned: z.string().transform(val => val === 'true').optional(),
    search: z.string().trim().optional(),
  }).optional(),
});
