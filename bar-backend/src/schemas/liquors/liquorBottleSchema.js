import { z } from 'zod';

export const liquorBottleSchema = z.object({
    id: z.number(),
    liquor_id: z.number(),
    transaction_id: z.number(),
    date_opened: z.date().optional(),
    date_finished: z.date().optional(),
    quantity: z.number().min(0, 'Quantity must be a positive number').multipleOf(0.0001)
});

export const createLiquorBottleSchema = transactionSchema.omit({
//   id: true
    id: true,
    liquor_id: true,
    transaction_id: true,
});

export const updateLiquorBottleSchema = z.object({
    date_opened: z.date().optional(),
    date_finished: z.date().optional(),
    quantity: z.number().min(0, 'Quantity must be a positive number').multipleOf(0.0001)
});