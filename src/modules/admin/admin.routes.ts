import { Router } from 'express';
import adminController from './admin.controller.js';
import { authenticate, authorize } from '../../shared/middleware/auth.middleware.js';

const router = Router();

router.get(
    '/dashboard',
    authenticate,
    authorize('ADMIN'),
    adminController.getDashboardStats
);

router.get(
    '/users',
    authenticate,
    authorize('ADMIN'),
    adminController.getAllUsers
);

router.post(
    '/promote',
    authenticate,
    authorize('ADMIN'),
    adminController.promoteUser
);

export default router;
