import prisma from '../../shared/config/database.config.js';
import { Payment, Prisma } from '@prisma/client';

export class PaymentRepository {
    async create(data: Prisma.PaymentCreateInput): Promise<Payment> {
        return prisma.payment.create({
            data,
        });
    }

    async findById(id: string): Promise<Payment | null> {
        return prisma.payment.findUnique({
            where: { id },
            include: { booking: true },
        });
    }

    async update(id: string, data: Prisma.PaymentUpdateInput): Promise<Payment> {
        return prisma.payment.update({
            where: { id },
            data,
        });
    }

    async findAll(params: {
        skip?: number;
        take?: number;
        where?: Prisma.PaymentWhereInput;
    }): Promise<[Payment[], number]> {
        const [payments, count] = await prisma.$transaction([
            prisma.payment.findMany({
                skip: params.skip,
                take: params.take,
                where: params.where,
                include: { booking: { include: { user: true } } },
                orderBy: { createdAt: 'desc' },
            }),
            prisma.payment.count({ where: params.where }),
        ]);
        return [payments, count];
    }
}

export default new PaymentRepository();
