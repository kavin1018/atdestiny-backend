import { logger } from '../../../shared/utils/logger.util.js';

export class EmailChannel {
    async send(to: string, subject: string, body: string): Promise<boolean> {
        // Stub implementation
        logger.info(`[EMAIL STUB] To: ${to} | Subject: ${subject} | Body: ${body}`);
        return true;
    }
}

export default new EmailChannel();
