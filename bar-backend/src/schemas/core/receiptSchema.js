import { z } from 'zod';

export const receiptSchema = z.object({
    id: z.number(),
    date: z.string(),
    store_loc: z.string().min(1, 'Store location should be longer').max(255),
    created_at: z.string(),
});

export const createReceiptSchema = z.object({
    date: z.coerce.date(),
    store_loc: z.string(),
});

export const updateReceiptSchema = z.object({
    date: z.coerce.date().optional(),
    store_loc: z.string().optional(),
});