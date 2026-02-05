import { logger } from '../../../shared/utils/logger.util.js';

export class SMSChannel {
    async send(to: string, message: string): Promise<boolean> {
        // Stub implementation
        logger.info(`[SMS STUB] To: ${to} | Message: ${message}`);
        return true;
    }
}

export default new SMSChannel();
