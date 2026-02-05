import { Request, Response, NextFunction } from 'express';
import { BaseException, ValidationException } from '../exceptions/index.js';
import { logger } from '../utils/logger.util.js';
import ResponseUtil from '../utils/response.util.js';

export const errorHandler = (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    logger.error(err);

    if (err instanceof BaseException && err.isOperational) {
        return ResponseUtil.error(
            res,
            err.message,
            err.statusCode,
            err instanceof ValidationException ? err.errors : undefined
        );
    }

    // Handle SyntaxError (mostly JSON parsing errors)
    if (err instanceof SyntaxError && 'status' in err && err.message.includes('JSON')) {
        return ResponseUtil.error(res, 'Invalid JSON payload', 400);
    }

    // Fallback for unhandled errors
    return ResponseUtil.error(
        res,
        'Internal Server Error',
        500,
        process.env.NODE_ENV === 'development' ? err.stack : undefined
    );
};
