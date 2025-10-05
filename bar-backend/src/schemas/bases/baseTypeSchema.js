import { z } from 'zod';

export const baseTypeSchema = z.object({
    name: z.string().min(1, 'Brand should be longer').max(255)
});

export const createBaseTypeSchema = transactionSchema.omit({

});

export const updateBaseTypeSchema = z.object({
    name: z.string().min(1, 'Brand should be longer').max(255)
});