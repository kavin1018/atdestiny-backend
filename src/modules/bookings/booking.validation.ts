import { z } from 'zod';

export const createBookingSchema = z.object({
    body: z.object({
        serviceId: z.string().uuid(),
        packageId: z.string().uuid().optional(),
        bookingDate: z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)), // ISO date or YYYY-MM-DD
        bookingTime: z.string(),
        location: z.string().optional(),
        notes: z.string().optional(),
    }),
});

export const updateBookingStatusSchema = z.object({
    body: z.object({
        status: z.enum(['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'REFUNDED']),
        adminNotes: z.string().optional(),
    }),
});
