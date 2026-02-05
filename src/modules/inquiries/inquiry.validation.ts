import { z } from 'zod';

export const createInquirySchema = z.object({
    body: z.object({
        name: z.string().min(2),
        email: z.string().email(),
        phone: z.string().optional(),
        message: z.string().min(10),
    }),
});

export const updateInquiryStatusSchema = z.object({
    body: z.object({
        status: z.enum(['NEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']),
        response: z.string().optional(),
    }),
});
