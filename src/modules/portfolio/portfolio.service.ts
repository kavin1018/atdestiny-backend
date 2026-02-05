import portfolioRepository from './portfolio.repository.js';
import { NotFoundException } from '../../shared/exceptions/index.js';
import { Portfolio, Media } from '@prisma/client';

export class PortfolioService {
    async createPortfolio(data: any): Promise<Portfolio> {
        const { serviceId, ...rest } = data;
        return portfolioRepository.create({
            ...rest,
            service: serviceId ? { connect: { id: serviceId } } : undefined,
        });
    }

    async getAllPortfolios(query: any): Promise<{ portfolios: Portfolio[]; total: number; page: number; limit: number }> {
        const page = parseInt(query.page as string) || 1;
        const limit = parseInt(query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const where: any = {
            isActive: true,
        };

        if (query.serviceId) {
            where.serviceId = query.serviceId;
        }

        const [portfolios, total] = await portfolioRepository.findAll({
            skip,
            take: limit,
            where,
        });

        return { portfolios, total, page, limit };
    }

    async getPortfolioById(id: string): Promise<Portfolio> {
        const portfolio = await portfolioRepository.findById(id);
        if (!portfolio) {
            throw new NotFoundException('Portfolio not found');
        }
        return portfolio;
    }

    async updatePortfolio(id: string, data: any): Promise<Portfolio> {
        await this.getPortfolioById(id);
        const { serviceId, ...rest } = data;
        return portfolioRepository.update(id, {
            ...rest,
            service: serviceId ? { connect: { id: serviceId } } : undefined,
        });
    }

    async deletePortfolio(id: string): Promise<void> {
        await this.getPortfolioById(id);
        await portfolioRepository.delete(id);
    }

    async addMedia(portfolioId: string, file: any): Promise<Media> {
        await this.getPortfolioById(portfolioId);

        // When using multer-storage-cloudinary, 'file.path' is the Cloudinary URL
        const url = file.path;

        // Determine media type based on mimetype
        const type = file.mimetype.startsWith('video') ? 'VIDEO' : 'IMAGE';

        return portfolioRepository.addMedia({
            portfolio: { connect: { id: portfolioId } },
            url: url,
            type: type,
            fileName: file.filename, // This is the public_id in Cloudinary
            fileSize: file.size,
            mimeType: file.mimetype,
        });
    }
}

export default new PortfolioService();
