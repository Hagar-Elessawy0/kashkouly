import { Router } from 'express';
import { UserController } from './user.controller';
import { validate } from '../../core/middlewares/validate';
import { authenticate, authorize } from '../../core/middlewares/auth';
import { uploadImage } from '../../core/middlewares/upload';
import { updateUserSchema, userIdSchema, getAllUsersSchema } from './user.validation';
import { UserRole } from '../../shared/enums/userRole';
import { PERMISSIONS } from '../../shared/constants';

const router = Router();

router.patch('/me', authenticate, uploadImage, validate(updateUserSchema), UserController.updateMyProfile);
router.get('/:id', authenticate, authorize([UserRole.ADMIN], [PERMISSIONS.MANAGE_USERS]), validate(userIdSchema), UserController.getUserById);
router.patch('/:id', authenticate, authorize([UserRole.ADMIN], [PERMISSIONS.MANAGE_USERS]), validate(userIdSchema), UserController.changeStatus);
router.get('/', authenticate, authorize([UserRole.ADMIN], [PERMISSIONS.MANAGE_USERS]), validate(getAllUsersSchema), UserController.getAllUsers);

export { router as userRoutes };
