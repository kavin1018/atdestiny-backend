import prisma from '../../shared/config/database.config.js';
import { Inquiry, Prisma } from '@prisma/client';

export class InquiryRepository {
    async create(data: Prisma.InquiryCreateInput): Promise<Inquiry> {
        return prisma.inquiry.create({
            data,
        });
    }

    async findAll(params: {
        skip?: number;
        take?: number;
        where?: Prisma.InquiryWhereInput;
    }): Promise<[Inquiry[], number]> {
        const [inquiries, count] = await prisma.$transaction([
            prisma.inquiry.findMany({
                skip: params.skip,
                take: params.take,
                where: params.where,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.inquiry.count({ where: params.where }),
        ]);
        return [inquiries, count];
    }

    async findById(id: string): Promise<Inquiry | null> {
        return prisma.inquiry.findUnique({
            where: { id },
        });
    }

    async update(id: string, data: Prisma.InquiryUpdateInput): Promise<Inquiry> {
        return prisma.inquiry.update({
            where: { id },
            data,
        });
    }
}

export default new InquiryRepository();
