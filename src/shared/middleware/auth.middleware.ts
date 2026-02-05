import { Request, Response, NextFunction } from 'express';
import JWTUtil, { TokenPayload } from '../utils/jwt.util.js';
import { UnauthorizedException, ForbiddenException } from '../exceptions/index.js';
import { UserRole } from '@prisma/client';

// Extend Express Request
declare global {
    namespace Express {
        interface Request {
            user?: TokenPayload;
        }
    }
}

export const authenticate = async (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('Missing or invalid authentication token');
        }

        const token = authHeader.split(' ')[1];
        const payload = JWTUtil.verifyAccessToken(token);

        // Optional: Check if user exists and is active (can be cached in Redis)
        // For now, we trust the token payload for performance, 
        // but in a stricter system, checking the DB/Cache is recommended.

        req.user = payload;
        next();
    } catch (error) {
        next(new UnauthorizedException('Invalid or expired authentication token'));
    }
};

export const authorize = (...roles: UserRole[]) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        if (!req.user) {
            return next(new UnauthorizedException('User not authenticated'));
        }

        // Since we store role as string in token, cast it checking validity
        // In our schema UserRole enum is 'ADMIN' | 'USER'
        if (!roles.includes(req.user.role as UserRole)) {
            return next(new ForbiddenException('You do not have permission to access this resource'));
        }

        next();
    };
};
