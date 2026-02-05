import { Router } from 'express';
import inquiryController from './inquiry.controller.js';
import { validate } from '../../shared/middleware/validation.middleware.js';
import { authenticate, authorize } from '../../shared/middleware/auth.middleware.js';
import { createInquirySchema, updateInquiryStatusSchema } from './inquiry.validation.js';

const router = Router();

// Public (with optional auth handled in controller logic if token present, 
// but here we might want to allow anyone. 
// Note: Middleware 'authenticate' throws if no token. 
// So for optional auth, we'd need a different middleware or check headers manually in controller.
// For now, let's make it public.

router.post(
    '/',
    validate(createInquirySchema),
    inquiryController.createInquiry
);

// Admin Routes
router.get(
    '/',
    authenticate,
    authorize('ADMIN'),
    inquiryController.getAllInquiries
);

router.get(
    '/:id',
    authenticate,
    authorize('ADMIN'),
    inquiryController.getInquiryById
);

router.patch(
    '/:id',
    authenticate,
    authorize('ADMIN'),
    validate(updateInquiryStatusSchema),
    inquiryController.updateInquiryStatus
);

export default router;
