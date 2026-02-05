import { Request, Response, NextFunction } from 'express';
import adminService from './admin.service.js';
import ResponseUtil from '../../shared/utils/response.util.js';

export class AdminController {
    async getDashboardStats(_req: Request, res: Response, next: NextFunction) {
        try {
            const result = await adminService.getDashboardStats();
            ResponseUtil.success(res, 'Dashboard stats retrieved', result);
        } catch (error) {
            next(error);
        }
    }

    async getAllUsers(_req: Request, res: Response, next: NextFunction) {
        try {
            const users = await adminService.getAllUsers();
            ResponseUtil.success(res, 'Users fetched successfully', users);
        } catch (error) {
            next(error);
        }
    }

    async promoteUser(req: Request, res: Response, _next: NextFunction) {
        try {
            const { identifier } = req.body;
            if (!identifier) {
                return ResponseUtil.error(res, 'Identifier (email or name) is required', 400);
            }

            const result = await adminService.promoteUser(identifier);
            ResponseUtil.success(res, 'User promoted to Admin successfully', result);
        } catch (error: any) {
            ResponseUtil.error(res, error.message || 'Failed to promote user', 400);
        }
    }
}

export default new AdminController();
