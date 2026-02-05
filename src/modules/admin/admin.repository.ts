import prisma from '../../shared/config/database.config.js';

export class AdminRepository {
    async getStats() {
        const [
            totalBookings,
            pendingBookings,
            confirmedBookings,
            completedBookings,
            totalRevenueData,
            totalUsers,
        ] = await prisma.$transaction([
            prisma.booking.count(),
            prisma.booking.count({ where: { status: 'PENDING' } }),
            prisma.booking.count({ where: { status: 'CONFIRMED' } }),
            prisma.booking.count({ where: { status: 'COMPLETED' } }),
            prisma.payment.aggregate({
                _sum: { amount: true },
                where: { status: 'COMPLETED' },
            }),
            prisma.user.count(),
        ]);

        return {
            totalBookings,
            pendingBookings,
            confirmedBookings,
            completedBookings,
            totalRevenue: totalRevenueData._sum.amount || 0,
            totalUsers,
        };
    }

    async getRecentActivity() {
        return prisma.booking.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { name: true } }, service: { select: { name: true } } }
        });
    }

    async getAllUsers() {
        return prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                phone: true,
                createdAt: true,
            }
        });
    }

    async findUserByIdentifier(identifier: string) {
        return prisma.user.findFirst({
            where: {
                OR: [
                    { email: identifier },
                    { name: identifier }
                ]
            }
        });
    }

    async promoteToAdmin(userId: string) {
        return prisma.$transaction([
            prisma.user.update({
                where: { id: userId },
                data: { role: 'ADMIN' }
            }),
            prisma.admin.upsert({
                where: { userId },
                update: {},
                create: {
                    userId,
                    permissions: { all: true }
                }
            })
        ]);
    }
}

export default new AdminRepository();
