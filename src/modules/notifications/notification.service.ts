import emailChannel from './channels/email.channel.js';


export class NotificationService {
    async sendWelcomeEmail(email: string, name: string) {
        const subject = 'Welcome to AtDestiny!';
        const body = `Hi ${name},\n\nWelcome to AtDestiny. We are excited to have you on board.`;
        await emailChannel.send(email, subject, body);
    }

    async sendBookingConfirmation(email: string, name: string, bookingId: string) {
        const subject = 'Booking Confirmed';
        const body = `Hi ${name},\n\nYour booking (ID: ${bookingId}) has been confirmed.`;
        await emailChannel.send(email, subject, body);
    }

    async sendPaymentReceipt(email: string, name: string, amount: number) {
        const subject = 'Payment Receipt';
        const body = `Hi ${name},\n\nWe received your payment of ${amount}.`;
        await emailChannel.send(email, subject, body);
    }
}

export default new NotificationService();
