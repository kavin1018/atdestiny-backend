import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './shared/config/app.config.js';
import { errorHandler } from './shared/middleware/error.middleware.js';
import { logger } from './shared/utils/logger.util.js';
import ResponseUtil from './shared/utils/response.util.js';

// Import Routes (will be added as we create modules)
import authRoutes from './modules/auth/auth.routes.js';
import userRoutes from './modules/users/user.routes.js';
import serviceRoutes from './modules/services/service.routes.js';
import portfolioRoutes from './modules/portfolio/portfolio.routes.js';
import bookingRoutes from './modules/bookings/booking.routes.js';
import paymentRoutes from './modules/payments/payment.routes.js';
import inquiryRoutes from './modules/inquiries/inquiry.routes.js';
import adminRoutes from './modules/admin/admin.routes.js';

const app: Express = express();

// Security Middlewares
// Security Middlewares
app.use(helmet());
app.use(
    cors({
        origin: true,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    })
);

// Rate Limiting
const limiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.maxRequests,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging Middleware (Process Request)
app.use((req, _res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
});

// Health Check
app.get('/health', (_req, res) => {
    ResponseUtil.success(res, 'Server is healthy', {
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
    });
});

// Serve Static Files (Uploads)
app.use('/uploads', express.static(config.upload.uploadDir));

// API Routes
const apiPrefix = `/api/${config.apiVersion}`;
app.use(`${apiPrefix}/auth`, authRoutes);
app.use(`${apiPrefix}/users`, userRoutes);
app.use(`${apiPrefix}/services`, serviceRoutes);
app.use(`${apiPrefix}/portfolios`, portfolioRoutes);
app.use(`${apiPrefix}/bookings`, bookingRoutes);
app.use(`${apiPrefix}/payments`, paymentRoutes);
app.use(`${apiPrefix}/inquiries`, inquiryRoutes);
app.use(`${apiPrefix}/admin`, adminRoutes);

app.use((_req, res) => {
    ResponseUtil.error(res, 'Route not found', 404);
});

// Global Error Handler
app.use(errorHandler);

export default app;
