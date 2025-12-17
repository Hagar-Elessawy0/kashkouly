import { Router } from 'express';
import { healthCheck } from '../health/health.controller';

const router = Router();

router.get('/health', healthCheck);

export { router as HealthRoute };
