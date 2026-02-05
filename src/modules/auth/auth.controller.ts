import { Request, Response, NextFunction } from 'express';
import authService from './auth.service.js';
import ResponseUtil from '../../shared/utils/response.util.js';

export class AuthController {
    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await authService.register(req.body);
            ResponseUtil.created(res, 'Registration successful', result);
        } catch (error) {
            next(error);
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await authService.login(req.body);
            ResponseUtil.success(res, 'Login successful', result);
        } catch (error) {
            next(error);
        }
    }

    async refreshToken(req: Request, res: Response, next: NextFunction) {
        try {
            const { refreshToken } = req.body;
            const result = await authService.refreshToken(refreshToken);
            ResponseUtil.success(res, 'Token refreshed successfully', result);
        } catch (error) {
            next(error);
        }
    }

    async logout(req: Request, res: Response, next: NextFunction) {
        try {
            // Expecting refresh token in body to revoke it specifically
            // Or we could revoke all tokens for user from req.user
            const { refreshToken } = req.body;
            if (refreshToken) {
                await authService.logout(refreshToken);
            }
            ResponseUtil.success(res, 'Logout successful');
        } catch (error) {
            next(error);
        }
    }

    async getProfile(req: Request, res: Response, next: NextFunction) {
        try {
            // req.user is populated by authenticate middleware
            ResponseUtil.success(res, 'User profile', req.user);
        } catch (error) {
            next(error);
        }
    }
}

export default new AuthController();
