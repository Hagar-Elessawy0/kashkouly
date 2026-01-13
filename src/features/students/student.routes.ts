import { Router } from 'express';
import { StudentController } from './student.controller';
import { authenticate, authorize } from '../../core/middlewares/auth';
import { UserRole } from '../../shared/enums/userRole';
import { PERMISSIONS } from '../../shared/constants';
import { validate } from '../../core/middlewares/validate';
import {
  studentIdSchema,
  updateStudentProfileSchema,
  getAllStudentsSchema,
} from './student.validation';

const router = Router();

// Student-only endpoints
router.get('/me', authenticate, authorize([UserRole.STUDENT]), StudentController.getMyProfile);
router.patch('/me', authenticate, authorize([UserRole.STUDENT]), validate(updateStudentProfileSchema), StudentController.updateMyProfile);

// Admin-only endpoints
router.get('/:id', authenticate, authorize([UserRole.ADMIN], [PERMISSIONS.MANAGE_USERS]), validate(studentIdSchema), StudentController.getStudentById);
router.get('/', authenticate, authorize([UserRole.ADMIN], [PERMISSIONS.MANAGE_USERS]), validate(getAllStudentsSchema), StudentController.getAllStudents);

export { router as studentRoutes };
