import prisma from '../../shared/config/database.config.js';
import { Service, ServicePackage, Prisma } from '@prisma/client';

export class ServiceRepository {
    async create(data: Prisma.ServiceCreateInput): Promise<Service> {
        return prisma.service.create({
            data,
        });
    }

    async findAll(params: {
        skip?: number;
        take?: number;
        where?: Prisma.ServiceWhereInput;
    }): Promise<[Service[], number]> {
        const [services, count] = await prisma.$transaction([
            prisma.service.findMany({
                skip: params.skip,
                take: params.take,
                where: params.where,
                include: { packages: true },
                orderBy: { createdAt: 'desc' },
            }),
            prisma.service.count({ where: params.where }),
        ]);
        return [services, count];
    }

    async findById(id: string): Promise<Prisma.ServiceGetPayload<{ include: { packages: true; portfolios: true } }> | null> {
        return prisma.service.findUnique({
            where: { id },
            include: { packages: true, portfolios: true },
        });
    }

    async findBySlug(slug: string): Promise<Prisma.ServiceGetPayload<{ include: { packages: true; portfolios: true } }> | null> {
        return prisma.service.findUnique({
            where: { slug },
            include: { packages: true, portfolios: true },
        });
    }

    async update(id: string, data: Prisma.ServiceUpdateInput): Promise<Service> {
        return prisma.service.update({
            where: { id },
            data,
        });
    }

    async delete(id: string): Promise<Service> {
        // Soft delete usually, but here we can toggle isActive
        // Or hard delete if requested
        return prisma.service.delete({
            where: { id },
        });
    }

    // Packages via Service Repo or Separate Package Repo?
    // Let's keep it here for simplicity of the module
    async createPackage(data: Prisma.ServicePackageCreateInput): Promise<ServicePackage> {
        return prisma.servicePackage.create({
            data,
        });
    }
}

export default new ServiceRepository();
