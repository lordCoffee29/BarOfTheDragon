import { z } from 'zod';

export const liquorTypeSchema = z.object({
    name: z.string().min(1, 'Brand should be longer').max(255)
});

export const createLiquorTypeSchema = transactionSchema.omit({

});

export const updateLiquorTypeSchema = z.object({
    name: z.string().min(1, 'Brand should be longer').max(255)
});