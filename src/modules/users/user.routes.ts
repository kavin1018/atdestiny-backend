import { Router } from 'express';
import userController from './user.controller.js';
import { validate } from '../../shared/middleware/validation.middleware.js';
import { authenticate, authorize } from '../../shared/middleware/auth.middleware.js';
import { updateProfileSchema } from './user.validation.js';

const router = Router();

router.get(
    '/profile',
    authenticate,
    userController.getProfile
);

router.put(
    '/profile',
    authenticate,
    validate(updateProfileSchema),
    userController.updateProfile
);

// Admin Routes
router.get(
    '/',
    authenticate,
    authorize('ADMIN'),
    userController.getAllUsers
);

router.get(
    '/:id',
    authenticate,
    authorize('ADMIN'),
    userController.getUserById
);

export default router;
