import { Router } from 'express';
import bookingController from './booking.controller.js';
import { validate } from '../../shared/middleware/validation.middleware.js';
import { authenticate, authorize } from '../../shared/middleware/auth.middleware.js';
import { createBookingSchema, updateBookingStatusSchema } from './booking.validation.js';

const router = Router();

// User Routes
router.post(
    '/',
    authenticate,
    validate(createBookingSchema),
    bookingController.createBooking
);

router.get(
    '/me',
    authenticate,
    bookingController.getMyBookings
);

router.get(
    '/:id',
    authenticate,
    bookingController.getBookingById
);

// Admin Routes
router.get(
    '/',
    authenticate,
    authorize('ADMIN'),
    bookingController.getAllBookings
);

router.patch(
    '/:id/status',
    authenticate,
    authorize('ADMIN'),
    validate(updateBookingStatusSchema),
    bookingController.updateBookingStatus
);

export default router;
