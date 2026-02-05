import { Request, Response, NextFunction } from 'express';
import inquiryService from './inquiry.service.js';
import ResponseUtil from '../../shared/utils/response.util.js';
import { InquiryStatus } from '@prisma/client';

export class InquiryController {
    async createInquiry(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.userId; // Optional
            const result = await inquiryService.createInquiry(req.body, userId);
            ResponseUtil.created(res, 'Inquiry submitted successfully', result);
        } catch (error) {
            next(error);
        }
    }

    async getAllInquiries(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await inquiryService.getAllInquiries(req.query);
            ResponseUtil.success(res, 'Inquiries retrieved', result);
        } catch (error) {
            next(error);
        }
    }

    async getInquiryById(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await inquiryService.getInquiryById(req.params.id as string);
            ResponseUtil.success(res, 'Inquiry details', result);
        } catch (error) {
            next(error);
        }
    }

    async updateInquiryStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const { status, response } = req.body;
            const result = await inquiryService.updateInquiryStatus(req.params.id as string, status as InquiryStatus, response);
            ResponseUtil.success(res, 'Inquiry status updated', result);
        } catch (error) {
            next(error);
        }
    }
}

export default new InquiryController();
