import { z } from 'zod';
import { PaymentGateway } from '@prisma/client';

export const initiatePaymentSchema = z.object({
    body: z.object({
        bookingId: z.string().uuid(),
        amount: z.number().positive(),
        gateway: z.nativeEnum(PaymentGateway),
    }),
});

export const verifyPaymentSchema = z.object({
    body: z.object({
        paymentId: z.string().uuid(),
        gatewayPaymentId: z.string(),
        gatewayOrderId: z.string().optional(),
        gatewaySignature: z.string().optional(),
    }),
});
