import prisma from '../../shared/config/database.config.js';
import { User, Prisma } from '@prisma/client';

export class UserRepository {
    async findById(id: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { id },
        });
    }

    async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
        return prisma.user.update({
            where: { id },
            data,
        });
    }

    // Admin features
    async findAll(params: {
        skip?: number;
        take?: number;
        where?: Prisma.UserWhereInput;
    }): Promise<[User[], number]> {
        const [users, count] = await prisma.$transaction([
            prisma.user.findMany({
                skip: params.skip,
                take: params.take,
                where: params.where,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.user.count({ where: params.where }),
        ]);
        return [users, count];
    }
}

export default new UserRepository();
