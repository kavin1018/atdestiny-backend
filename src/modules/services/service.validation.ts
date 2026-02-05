import { z } from 'zod';
import { ServiceCategory } from '@prisma/client';

export const createServiceSchema = z.object({
    body: z.object({
        name: z.string().min(2),
        category: z.nativeEnum(ServiceCategory),
        description: z.string().min(10),
        basePrice: z.number().positive(),
        isActive: z.boolean().optional(),
        slug: z.string().min(2),
    }),
});

export const updateServiceSchema = z.object({
    body: z.object({
        name: z.string().min(2).optional(),
        category: z.nativeEnum(ServiceCategory).optional(),
        description: z.string().min(10).optional(),
        basePrice: z.number().positive().optional(),
        isActive: z.boolean().optional(),
    }),
});

export const createPackageSchema = z.object({
    body: z.object({
        name: z.string().min(2),
        description: z.string().min(10),
        price: z.number().positive(),
        features: z.array(z.string()),
        duration: z.number().int().positive().optional(),
        isActive: z.boolean().optional(),
    }),
});
