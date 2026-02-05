import { z } from 'zod';

export const createPortfolioSchema = z.object({
    body: z.object({
        title: z.string().min(2),
        description: z.string().optional(),
        serviceId: z.string().uuid().optional(),
        coverImage: z.string().url().optional(),
        isActive: z.boolean().optional(),
    }),
});

export const updatePortfolioSchema = z.object({
    body: z.object({
        title: z.string().min(2).optional(),
        description: z.string().optional(),
        serviceId: z.string().uuid().optional(),
        coverImage: z.string().url().optional(),
        isActive: z.boolean().optional(),
    }),
});
