import { Request, Response, NextFunction } from 'express';
import bookingService from './booking.service.js';
import ResponseUtil from '../../shared/utils/response.util.js';
import { BookingStatus } from '@prisma/client';

export class BookingController {
    async createBooking(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.user) throw new Error('User not found');
            const result = await bookingService.createBooking(req.user.userId, req.body);
            ResponseUtil.created(res, 'Booking created successfully', result);
        } catch (error) {
            next(error);
        }
    }

    async getMyBookings(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.user) throw new Error('User not found');
            // Inject userId into query for security
            const query = { ...req.query, userId: req.user.userId };
            const result = await bookingService.getAllBookings(query);
            ResponseUtil.success(res, 'My bookings retrieved', result);
        } catch (error) {
            next(error);
        }
    }

    async getAllBookings(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await bookingService.getAllBookings(req.query);
            ResponseUtil.success(res, 'All bookings retrieved', result);
        } catch (error) {
            next(error);
        }
    }

    async getBookingById(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.user) throw new Error('User not found');
            const userId = req.user.role === 'ADMIN' ? undefined : req.user.userId;
            const result = await bookingService.getBookingById(req.params.id as string, userId);
            ResponseUtil.success(res, 'Booking details', result);
        } catch (error) {
            next(error);
        }
    }

    async updateBookingStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const { status, adminNotes } = req.body;
            const result = await bookingService.updateBookingStatus(req.params.id as string, status as BookingStatus, adminNotes);
            ResponseUtil.success(res, 'Booking status updated', result);
        } catch (error) {
            next(error);
        }
    }
}

export default new BookingController();
