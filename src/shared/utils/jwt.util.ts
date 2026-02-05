import jwt from 'jsonwebtoken';
import { config } from '../config/app.config.js';

export interface TokenPayload {
    userId: string;
    email: string;
    role: string;
}

export class JWTUtil {
    static generateAccessToken(payload: TokenPayload): string {
        return jwt.sign(payload, config.jwt.accessSecret, {
            expiresIn: config.jwt.accessExpiry as any,
        });
    }

    static generateRefreshToken(payload: TokenPayload): string {
        return jwt.sign(payload, config.jwt.refreshSecret, {
            expiresIn: config.jwt.refreshExpiry as any,
        });
    }

    static verifyAccessToken(token: string): TokenPayload {
        try {
            return jwt.verify(token, config.jwt.accessSecret) as TokenPayload;
        } catch (error) {
            throw new Error('Invalid or expired access token');
        }
    }

    static verifyRefreshToken(token: string): TokenPayload {
        try {
            return jwt.verify(token, config.jwt.refreshSecret) as TokenPayload;
        } catch (error) {
            throw new Error('Invalid or expired refresh token');
        }
    }

    static decodeToken(token: string): TokenPayload | null {
        try {
            return jwt.decode(token) as TokenPayload;
        } catch (error) {
            return null;
        }
    }
}

export default JWTUtil;
