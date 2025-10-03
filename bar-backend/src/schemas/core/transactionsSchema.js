import { z } from 'zod';

export const transactionSchema = z.object({
  id: z.number(),
  item: z.string().min(1, 'Item should be longer').max(255),
  brand: z.string().min(1, 'Brand should be longer').max(255),
  category: z.string().min(1, 'Category should be longer').max(255),
  date: z.date().optional(),
  price: z.number().min(0, 'Price must be a positive number').multipleOf(0.01),
});

export const createTransactionSchema = transactionSchema.omit({
  id: true
});

export const updateTransactionSchema = z.object({
  item: z.string().min(1, 'Item should be longer').max(255).optional(),
  brand: z.string().min(1, 'Brand should be longer').max(255).optional(),
  category: z.string().min(1, 'Category should be longer').max(255).optional(),
  date: z.date().optional(),
  price: z.number().min(0, 'Price must be a positive number').multipleOf(0.01).optional(),
});