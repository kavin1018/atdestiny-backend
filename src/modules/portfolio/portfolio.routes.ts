import { Router } from 'express';
import portfolioController from './portfolio.controller.js';
import { validate } from '../../shared/middleware/validation.middleware.js';
import { authenticate, authorize } from '../../shared/middleware/auth.middleware.js';
import { createPortfolioSchema, updatePortfolioSchema } from './portfolio.validation.js';
import { cloudinaryUpload } from '../../shared/config/cloudinary.config.js';

const router = Router();

// Public Routes
router.get('/', portfolioController.getAllPortfolios);
router.get('/:id', portfolioController.getPortfolioById);

// Admin Routes
router.post(
    '/',
    authenticate,
    authorize('ADMIN'),
    validate(createPortfolioSchema),
    portfolioController.createPortfolio
);

router.put(
    '/:id',
    authenticate,
    authorize('ADMIN'),
    validate(updatePortfolioSchema),
    portfolioController.updatePortfolio
);

router.delete(
    '/:id',
    authenticate,
    authorize('ADMIN'),
    portfolioController.deletePortfolio
);

router.post(
    '/:id/media',
    authenticate,
    authorize('ADMIN'),
    cloudinaryUpload.single('file'),
    portfolioController.uploadMedia
);

export default router;
