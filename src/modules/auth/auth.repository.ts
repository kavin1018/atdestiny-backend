import prisma from '../../shared/config/database.config.js';
import { User, RefreshToken, Prisma } from '@prisma/client';

export class AuthRepository {
    async createUser(data: Prisma.UserCreateInput): Promise<User> {
        return prisma.user.create({
            data,
        });
    }

    async findUserByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { email },
        });
    }

    async findUserById(id: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { id },
        });
    }

    async saveRefreshToken(
        userId: string,
        token: string,
        expiresAt: Date
    ): Promise<RefreshToken> {
        return prisma.refreshToken.create({
            data: {
                userId,
                token,
                expiresAt,
            },
        });
    }

    async findRefreshToken(token: string): Promise<RefreshToken | null> {
        return prisma.refreshToken.findUnique({
            where: { token },
            include: { user: true },
        });
    }

    async revokeRefreshToken(token: string): Promise<RefreshToken> {
        return prisma.refreshToken.update({
            where: { token },
            data: { isRevoked: true },
        });
    }

    async revokeAllUserRefreshTokens(userId: string): Promise<Prisma.BatchPayload> {
        return prisma.refreshToken.updateMany({
            where: { userId, isRevoked: false },
            data: { isRevoked: true },
        });
    }
}

export default new AuthRepository();
