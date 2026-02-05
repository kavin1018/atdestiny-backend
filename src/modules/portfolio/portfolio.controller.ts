import { Request, Response, NextFunction } from 'express';
import portfolioService from './portfolio.service.js';
import ResponseUtil from '../../shared/utils/response.util.js';

export class PortfolioController {
    async createPortfolio(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await portfolioService.createPortfolio(req.body);
            ResponseUtil.created(res, 'Portfolio created successfully', result);
        } catch (error) {
            next(error);
        }
    }

    async getAllPortfolios(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await portfolioService.getAllPortfolios(req.query);
            ResponseUtil.success(res, 'Portfolios retrieved successfully', result);
        } catch (error) {
            next(error);
        }
    }

    async getPortfolioById(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await portfolioService.getPortfolioById(req.params.id as string);
            ResponseUtil.success(res, 'Portfolio details', result);
        } catch (error) {
            next(error);
        }
    }

    async updatePortfolio(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await portfolioService.updatePortfolio(req.params.id as string, req.body);
            ResponseUtil.success(res, 'Portfolio updated successfully', result);
        } catch (error) {
            next(error);
        }
    }

    async deletePortfolio(req: Request, res: Response, next: NextFunction) {
        try {
            await portfolioService.deletePortfolio(req.params.id as string);
            ResponseUtil.success(res, 'Portfolio deleted successfully');
        } catch (error) {
            next(error);
        }
    }

    async uploadMedia(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.file) {
                throw new Error('No file uploaded');
            }
            const result = await portfolioService.addMedia(req.params.id as string, req.file);
            ResponseUtil.created(res, 'Media uploaded successfully', result);
        } catch (error) {
            next(error);
        }
    }
}

export default new PortfolioController();
