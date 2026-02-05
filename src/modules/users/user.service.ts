import userRepository from './user.repository.js';
import { NotFoundException } from '../../shared/exceptions/index.js';
import { User } from '@prisma/client';

export class UserService {
    async getProfile(userId: string): Promise<Partial<User>> {
        const user = await userRepository.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async updateProfile(userId: string, data: { name?: string; phone?: string }): Promise<Partial<User>> {
        const user = await userRepository.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Check if phone is being updated and if it's already taken (if unique constraint exists)
        // Assuming handling that via Prisma P2002 error or explicit check

        const updatedUser = await userRepository.update(userId, data);
        const { password, ...userWithoutPassword } = updatedUser;
        return userWithoutPassword;
    }

    async getAllUsers(query: any): Promise<{ users: Partial<User>[]; total: number; page: number; limit: number }> {
        const page = parseInt(query.page as string) || 1;
        const limit = parseInt(query.limit as string) || 20;
        const skip = (page - 1) * limit;

        const where: any = {};
        if (query.role) where.role = query.role;

        const [users, total] = await userRepository.findAll({ skip, take: limit, where });

        // Sanitize users
        const sanitizedUsers = users.map(user => {
            const { password, ...u } = user;
            return u;
        });

        return { users: sanitizedUsers, total, page, limit };
    }

    async getUserById(id: string): Promise<Partial<User>> {
        const user = await userRepository.findById(id);
        if (!user) throw new NotFoundException('User not found');
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
}

export default new UserService();
