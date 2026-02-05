import serviceRepository from './service.repository.js';
import { NotFoundException, ConflictException } from '../../shared/exceptions/index.js';
import { Service, ServicePackage, Prisma, ServiceCategory } from '@prisma/client';

export class ServiceService {
    async createService(data: any): Promise<Service> {
        const existing = await serviceRepository.findBySlug(data.slug);
        if (existing) {
            throw new ConflictException('Service with this slug already exists');
        }
        return serviceRepository.create(data);
    }

    async getAllServices(query: any): Promise<{ services: Service[]; total: number; page: number; limit: number }> {
        const page = parseInt(query.page as string) || 1;
        const limit = parseInt(query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const where: Prisma.ServiceWhereInput = {
            isActive: true,
        };

        if (query.category) {
            where.category = query.category as ServiceCategory;
        }

        const [services, total] = await serviceRepository.findAll({
            skip,
            take: limit,
            where,
        });

        return { services, total, page, limit };
    }

    async getServiceById(id: string): Promise<Service> {
        const service = await serviceRepository.findById(id);
        if (!service) {
            throw new NotFoundException('Service not found');
        }
        return service;
    }

    async getServiceBySlug(slug: string): Promise<Service> {
        const service = await serviceRepository.findBySlug(slug);
        if (!service) {
            throw new NotFoundException('Service not found');
        }
        return service;
    }

    async updateService(id: string, data: any): Promise<Service> {
        await this.getServiceById(id);
        return serviceRepository.update(id, data);
    }

    async deleteService(id: string): Promise<void> {
        await this.getServiceById(id);
        await serviceRepository.delete(id);
    }

    async createPackage(serviceId: string, data: any): Promise<ServicePackage> {
        await this.getServiceById(serviceId);
        return serviceRepository.createPackage({
            ...data,
            service: { connect: { id: serviceId } },
        });
    }
}

export default new ServiceService();
