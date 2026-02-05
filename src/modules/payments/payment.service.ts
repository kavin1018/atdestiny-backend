import paymentRepository from './payment.repository.js';
import bookingRepository from '../bookings/booking.repository.js';
import { NotFoundException, BadRequestException } from '../../shared/exceptions/index.js';
import { Payment } from '@prisma/client';
import { config } from '../../shared/config/app.config.js';
// import { stripe } from './gateways/stripe.gateway.js'; // Future implementation
// import { razorpay } from './gateways/razorpay.gateway.js'; // Future implementation

export class PaymentService {
    async initiatePayment(userId: string, data: any): Promise<any> {
        const booking = await bookingRepository.findById(data.bookingId);
        if (!booking) {
            throw new NotFoundException('Booking not found');
        }

        if (booking.userId !== userId) {
            throw new NotFoundException('Booking not found');
        }

        // Create pending payment record
        const payment = await paymentRepository.create({
            booking: { connect: { id: data.bookingId } },
            amount: data.amount,
            gateway: data.gateway,
            status: 'PENDING',
            currency: 'INR',
        });

        // Mock Gateway Logic for MVP
        let gatewayData = {};
        if (data.gateway === 'RAZORPAY') {
            // In real app, call Razorpay API to create order
            gatewayData = {
                orderId: `order_${Date.now()}`,
                key: config.env === 'development' ? 'rzp_test_123' : process.env.RAZORPAY_KEY_ID,
            };
        } else if (data.gateway === 'STRIPE') {
            // Stripe logic
            gatewayData = {
                clientSecret: `pi_${Date.now()}_secret`,
            };
        }

        return {
            paymentId: payment.id,
            ...gatewayData
        };
    }

    async verifyPayment(data: any): Promise<Payment> {
        const payment = await paymentRepository.findById(data.paymentId);
        if (!payment) {
            throw new NotFoundException('Payment not found');
        }

        // Mock Verification Logic
        // In real app, verify signature (HMAC)
        const isVerified = true;

        if (!isVerified) {
            await paymentRepository.update(payment.id, { status: 'FAILED' });
            throw new BadRequestException('Payment verification failed');
        }

        const updatedPayment = await paymentRepository.update(payment.id, {
            status: 'COMPLETED',
            transactionId: data.gatewayPaymentId,
            completedAt: new Date(),
            gatewayResponse: data,
        });

        // Update booking Status if fully paid?
        // For now, let's just ensure booking knows about it.
        // Logic to check total amount vs paid amount could go here.

        return updatedPayment;
    }

    async getAllPayments(query: any): Promise<any> {
        const page = parseInt(query.page as string) || 1;
        const limit = parseInt(query.limit as string) || 20;
        const skip = (page - 1) * limit;

        const where: any = {};
        if (query.status) where.status = query.status;

        const [payments, total] = await paymentRepository.findAll({ skip, take: limit, where });
        return { payments, total, page, limit };
    }
}

export default new PaymentService();
