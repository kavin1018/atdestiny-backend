import { Router } from 'express';
import paymentController from './payment.controller.js';
import { validate } from '../../shared/middleware/validation.middleware.js';
import { authenticate, authorize } from '../../shared/middleware/auth.middleware.js';
import { initiatePaymentSchema, verifyPaymentSchema } from './payment.validation.js';

const router = Router();

router.post(
    '/initiate',
    authenticate,
    validate(initiatePaymentSchema),
    paymentController.initiatePayment
);

router.post(
    '/verify',
    authenticate,
    validate(verifyPaymentSchema),
    paymentController.verifyPayment
);

router.get(
    '/',
    authenticate,
    authorize('ADMIN'),
    paymentController.getAllPayments
);

export default router;
