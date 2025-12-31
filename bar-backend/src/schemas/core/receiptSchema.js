import { z } from 'zod';

export const createReceiptSchema = z.object({
    date: z.coerce.date().optional(), // Date purchased, defaults to now if not provided
});