import { Redis } from 'ioredis';
import { config } from '../../shared/config/app.config.js';
import { logger } from '../../shared/utils/logger.util.js';

class RedisClient {
    private static instance: Redis | null = null;

    static getInstance(): Redis {
        if (!RedisClient.instance) {
            RedisClient.instance = new Redis({
                host: config.redis.host,
                port: config.redis.port,
                password: config.redis.password,
                retryStrategy: (times) => {
                    const delay = Math.min(times * 50, 2000);
                    return delay;
                },
            });

            RedisClient.instance.on('connect', () => {
                logger.info('Redis connected successfully');
            });

            RedisClient.instance.on('error', (error) => {
                logger.error('Redis connection error:', error);
            });
        }

        return RedisClient.instance;
    }

    static async disconnect(): Promise<void> {
        if (RedisClient.instance) {
            await RedisClient.instance.quit();
            RedisClient.instance = null;
            logger.info('Redis disconnected');
        }
    }
}

export const redis = RedisClient.getInstance();
export default redis;
