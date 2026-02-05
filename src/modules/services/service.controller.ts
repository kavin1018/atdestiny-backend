import { Request, Response, NextFunction } from 'express';
import serviceService from './service.service.js';
import ResponseUtil from '../../shared/utils/response.util.js';

export class ServiceController {
    async createService(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await serviceService.createService(req.body);
            ResponseUtil.created(res, 'Service created successfully', result);
        } catch (error) {
            next(error);
        }
    }

    async getAllServices(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await serviceService.getAllServices(req.query);
            ResponseUtil.success(res, 'Services retrieved successfully', result);
        } catch (error) {
            next(error);
        }
    }

    async getServiceById(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await serviceService.getServiceById(req.params.id as string);
            ResponseUtil.success(res, 'Service details', result);
        } catch (error) {
            next(error);
        }
    }

    async getServiceBySlug(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await serviceService.getServiceBySlug(req.params.slug as string);
            ResponseUtil.success(res, 'Service details', result);
        } catch (error) {
            next(error);
        }
    }

    async updateService(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await serviceService.updateService(req.params.id as string, req.body);
            ResponseUtil.success(res, 'Service updated successfully', result);
        } catch (error) {
            next(error);
        }
    }

    async deleteService(req: Request, res: Response, next: NextFunction) {
        try {
            await serviceService.deleteService(req.params.id as string);
            ResponseUtil.success(res, 'Service deleted successfully');
        } catch (error) {
            next(error);
        }
    }

    async createPackage(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await serviceService.createPackage(req.params.id as string, req.body);
            ResponseUtil.created(res, 'Package created successfully', result);
        } catch (error) {
            next(error);
        }
    }
}

export default new ServiceController();
