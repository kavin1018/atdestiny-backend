import inquiryRepository from './inquiry.repository.js';
import { NotFoundException } from '../../shared/exceptions/index.js';
import { Inquiry, InquiryStatus } from '@prisma/client';

export class InquiryService {
    async createInquiry(data: any, userId?: string): Promise<Inquiry> {
        return inquiryRepository.create({
            ...data,
            user: userId ? { connect: { id: userId } } : undefined,
        });
    }

    async getAllInquiries(query: any): Promise<any> {
        const page = parseInt(query.page as string) || 1;
        const limit = parseInt(query.limit as string) || 20;
        const skip = (page - 1) * limit;

        const where: any = {};
        if (query.status) where.status = query.status;

        const [inquiries, total] = await inquiryRepository.findAll({ skip, take: limit, where });
        return { inquiries, total, page, limit };
    }

    async getInquiryById(id: string): Promise<Inquiry> {
        const inquiry = await inquiryRepository.findById(id);
        if (!inquiry) throw new NotFoundException('Inquiry not found');
        return inquiry;
    }

    async updateInquiryStatus(id: string, status: InquiryStatus, response?: string): Promise<Inquiry> {
        await this.getInquiryById(id);
        return inquiryRepository.update(id, { status, response });
    }
}

export default new InquiryService();
