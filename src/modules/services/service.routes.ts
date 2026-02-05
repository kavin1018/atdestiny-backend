import { Router } from 'express';
import serviceController from './service.controller.js';
import { validate } from '../../shared/middleware/validation.middleware.js';
import { authenticate, authorize } from '../../shared/middleware/auth.middleware.js';
import { createServiceSchema, updateServiceSchema, createPackageSchema } from './service.validation.js';

const router = Router();

// Public Routes
router.get('/', serviceController.getAllServices);
router.get('/:id', serviceController.getServiceById);
router.get('/slug/:slug', serviceController.getServiceBySlug);

// Admin Routes
router.post(
    '/',
    authenticate,
    authorize('ADMIN'),
    validate(createServiceSchema),
    serviceController.createService
);

router.put(
    '/:id',
    authenticate,
    authorize('ADMIN'),
    validate(updateServiceSchema),
    serviceController.updateService
);

router.delete(
    '/:id',
    authenticate,
    authorize('ADMIN'),
    serviceController.deleteService
);

router.post(
    '/:id/packages',
    authenticate,
    authorize('ADMIN'),
    validate(createPackageSchema),
    serviceController.createPackage
);

export default router;
