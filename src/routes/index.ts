import { Router } from 'express';
import { HealthRoute } from '../features/health/health.routes';

const router = Router();

router.use(HealthRoute);

export { router as apiRoutes };
