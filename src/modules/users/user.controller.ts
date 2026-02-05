import { Request, Response, NextFunction } from 'express';
import userService from './user.service.js';
import ResponseUtil from '../../shared/utils/response.util.js';

export class UserController {
    async getProfile(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                throw new Error('User context missing');
            }
            const result = await userService.getProfile(req.user.userId);
            ResponseUtil.success(res, 'User profile retrieved', result);
        } catch (error) {
            next(error);
        }
    }

    async updateProfile(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                throw new Error('User context missing');
            }
            const result = await userService.updateProfile(req.user.userId, req.body);
            ResponseUtil.success(res, 'Profile updated successfully', result);
        } catch (error) {
            next(error);
        }
    }

    async getAllUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await userService.getAllUsers(req.query);
            ResponseUtil.success(res, 'Users retrieved successfully', result);
        } catch (error) {
            next(error);
        }
    }

    async getUserById(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await userService.getUserById(req.params.id as string);
            ResponseUtil.success(res, 'User details retrieved', result);
        } catch (error) {
            next(error);
        }
    }
}

export default new UserController();
