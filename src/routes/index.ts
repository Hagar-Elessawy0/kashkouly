import { Router } from 'express';
import { HealthRoute } from '../features/health/health.routes';
import { authRoutes } from '../features/auth/auth.routes';

const router = Router();

router.use(HealthRoute);
router.use('/auth', authRoutes);

export { router as apiRoutes };