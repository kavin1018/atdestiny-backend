import { Router } from 'express';
import authController from './auth.controller.js';
import { validate } from '../../shared/middleware/validation.middleware.js';
import { authenticate } from '../../shared/middleware/auth.middleware.js';
import { registerSchema, loginSchema, refreshTokenSchema } from './auth.validation.js';

const router = Router();

router.post(
    '/register',
    validate(registerSchema),
    authController.register
);

router.post(
    '/login',
    validate(loginSchema),
    authController.login
);

router.post(
    '/refresh',
    validate(refreshTokenSchema),
    authController.refreshToken
);

router.post(
    '/logout',
    authenticate,
    authController.logout
);

router.get(
    '/me',
    authenticate,
    authController.getProfile
);

export default router;
