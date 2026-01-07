import { Router } from 'express';
import { HealthRoute } from '../features/health/health.routes';
import { authRoutes } from '../features/auth/auth.routes';
import { userRoutes } from '../features/users/user.routes';

const router = Router();

router.use(HealthRoute);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);

export { router as apiRoutes };