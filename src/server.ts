import app from './app.js';
import { config } from './shared/config/app.config.js';
import { logger } from './shared/utils/logger.util.js';
import prisma from './shared/config/database.config.js';

const startServer = async () => {
    try {
        // Database check
        await prisma.$connect();
        logger.info('Database connected successfully');

        // Redis check implies it's connected via the client instantiation logic

        app.listen(config.port, () => {
            logger.info(`Server running in ${config.env} mode on port ${config.port}`);
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
    logger.error('UNHANDLED REJECTION! Shutting down...', err);
    process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    logger.error('UNCAUGHT EXCEPTION! Shutting down...', err);
    process.exit(1);
});
