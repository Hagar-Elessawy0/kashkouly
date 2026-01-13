import { z } from 'zod';
import { EducationStage } from '../../shared/enums/educationStage';

export const updateStudentProfileSchema = z.object({
  body: z.object({
    stage: z.nativeEnum(EducationStage).optional(),
    parentPhone:
      z.string()
        .regex(/^[0-9]{10,15}$/, {
          message: 'Phone number must be between 10 and 15 digits',
        })
        .optional(),
  }),
});

export const studentIdSchema = z.object({
  params: z.object({
    userId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format'),
  }),
});

export const getAllStudentsSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    stage: z.nativeEnum(EducationStage).optional(),
    search: z.string().trim().optional(),
  }).optional(),
});
