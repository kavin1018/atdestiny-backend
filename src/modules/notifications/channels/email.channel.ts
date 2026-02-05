import nodemailer from 'nodemailer';
import { config } from '../../../shared/config/app.config.js';
import { logger } from '../../../shared/utils/logger.util.js';

export class EmailChannel {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: config.email.host,
            port: config.email.port,
            secure: false, // true for 465, false for other ports
            auth: {
                user: config.email.user,
                pass: config.email.pass,
            },
        });
    }

    async send(to: string, subject: string, body: string): Promise<boolean> {
        try {
            const info = await this.transporter.sendMail({
                from: `"AtDestiny" <${config.email.user}>`,
                to: to,
                subject: subject,
                text: body,
            });
            logger.info(`[EMAIL SENT] MessageId: ${info.messageId} | To: ${to}`);
            return true;
        } catch (error) {
            logger.error(`[EMAIL FAILED] To: ${to} | Error: ${error}`);
            return false;
        }
    }
}

export default new EmailChannel();
