import prisma from '../../shared/config/database.config.js';
import { Booking, Prisma } from '@prisma/client';

export class BookingRepository {
    async create(data: Prisma.BookingCreateInput): Promise<Booking> {
        return prisma.booking.create({
            data,
        });
    }

    async findAll(params: {
        skip?: number;
        take?: number;
        where?: Prisma.BookingWhereInput;
    }): Promise<[Booking[], number]> {
        const [bookings, count] = await prisma.$transaction([
            prisma.booking.findMany({
                skip: params.skip,
                take: params.take,
                where: params.where,
                include: {
                    user: { select: { id: true, name: true, email: true, phone: true } },
                    service: { select: { id: true, name: true, category: true } },
                    package: { select: { id: true, name: true, price: true } },
                },
                orderBy: { createdAt: 'desc' },
            }),
            prisma.booking.count({ where: params.where }),
        ]);
        return [bookings, count];
    }

    async findById(id: string): Promise<Booking | null> {
        return prisma.booking.findUnique({
            where: { id },
            include: {
                user: { select: { id: true, name: true, email: true, phone: true } },
                service: true,
                package: true,
                payments: true,
            },
        });
    }

    async update(id: string, data: Prisma.BookingUpdateInput): Promise<Booking> {
        return prisma.booking.update({
            where: { id },
            data,
        });
    }
}

export default new BookingRepository();
