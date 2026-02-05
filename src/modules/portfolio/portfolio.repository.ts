import prisma from '../../shared/config/database.config.js';
import { Portfolio, Media, Prisma } from '@prisma/client';

export class PortfolioRepository {
    async create(data: Prisma.PortfolioCreateInput): Promise<Portfolio> {
        return prisma.portfolio.create({
            data,
        });
    }

    async findAll(params: {
        skip?: number;
        take?: number;
        where?: Prisma.PortfolioWhereInput;
    }): Promise<[Portfolio[], number]> {
        const [portfolios, count] = await prisma.$transaction([
            prisma.portfolio.findMany({
                skip: params.skip,
                take: params.take,
                where: params.where,
                include: { media: { take: 1, orderBy: { order: 'asc' } }, service: { select: { name: true, category: true } } },
                orderBy: { order: 'asc' },
            }),
            prisma.portfolio.count({ where: params.where }),
        ]);
        return [portfolios, count];
    }

    async findById(id: string): Promise<Portfolio | null> {
        return prisma.portfolio.findUnique({
            where: { id },
            include: {
                media: { orderBy: { order: 'asc' } },
                service: true
            },
        });
    }

    async update(id: string, data: Prisma.PortfolioUpdateInput): Promise<Portfolio> {
        return prisma.portfolio.update({
            where: { id },
            data,
        });
    }

    async delete(id: string): Promise<Portfolio> {
        return prisma.portfolio.delete({
            where: { id },
        });
    }

    async addMedia(data: Prisma.MediaCreateInput): Promise<Media> {
        return prisma.media.create({
            data,
        });
    }

    async deleteMedia(id: string): Promise<Media> {
        return prisma.media.delete({
            where: { id }
        });
    }
}

export default new PortfolioRepository();
