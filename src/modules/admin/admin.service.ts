import adminRepository from './admin.repository.js';

export class AdminService {
    async getDashboardStats() {
        const stats = await adminRepository.getStats();
        const recentActivity = await adminRepository.getRecentActivity();

        return {
            overview: stats,
            recentActivity
        };
    }

    async getAllUsers() {
        return adminRepository.getAllUsers();
    }

    async promoteUser(identifier: string) {
        const user = await adminRepository.findUserByIdentifier(identifier);

        if (!user) {
            throw new Error('User not found with the provided email or name');
        }

        await adminRepository.promoteToAdmin(user.id);
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: 'ADMIN'
        };
    }
}

export default new AdminService();
