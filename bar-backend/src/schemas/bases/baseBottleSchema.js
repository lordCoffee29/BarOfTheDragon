import { z } from 'zod';

export const baseBottleSchema = z.object({
    id: z.number(),
    base_id: z.number(),
    transaction_id: z.number(),
    date_opened: z.date().optional(),
    date_finished: z.date().optional(),
    quantity: z.number().min(0, 'Quantity must be a positive number').multipleOf(0.0001)
});

export const createBaseBottleSchema = transactionSchema.omit({
//   id: true
    id: true,
    base_id: true,
    transaction_id: true,
});

export const updateBaseBottleSchema = z.object({
    date_opened: z.date().optional(),
    date_finished: z.date().optional(),
    quantity: z.number().min(0, 'Quantity must be a positive number').multipleOf(0.0001)
});