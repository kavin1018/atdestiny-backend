import { Request, Response, NextFunction } from 'express';
import paymentService from './payment.service.js';
import ResponseUtil from '../../shared/utils/response.util.js';

export class PaymentController {
    async initiatePayment(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.user) throw new Error('User not found');
            const result = await paymentService.initiatePayment(req.user.userId, req.body);
            ResponseUtil.created(res, 'Payment initiated', result);
        } catch (error) {
            next(error);
        }
    }

    async verifyPayment(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await paymentService.verifyPayment(req.body);
            ResponseUtil.success(res, 'Payment verified successfully', result);
        } catch (error) {
            next(error);
        }
    }

    async getAllPayments(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await paymentService.getAllPayments(req.query);
            ResponseUtil.success(res, 'Payments retrieved', result);
        } catch (error) {
            next(error);
        }
    }
}

export default new PaymentController();
