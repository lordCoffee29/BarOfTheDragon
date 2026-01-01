import { z } from 'zod';

// TO-DO: more detailed error handling, can cross-check tables???
export const transactionSchema = z.object({
  id: z.number(),
  receipt_id: z.number(),
  line_num: z.number(),
  item: z.string().min(1, 'Item should be longer').max(255),
  brand: z.string().min(1, 'Brand should be longer').max(255),
  category: z.string().min(1, 'Category should be longer').max(255),
  date: z.string(), // Accept date as string, convert in service
  price: z.number().min(0, 'Price must be a positive number').multipleOf(0.01),
  note: z.string().max(1000).nullable(),
  created_at: z.string(),
  updated_at: z.string().optional(),
});

export const createTransactionSchema = z.object({
  item: z.string().min(1, 'Item should be longer').max(255),
  brand: z.string().min(1, 'Brand should be longer').max(255),
  category: z.string().min(1, 'Category should be longer').max(255),
  date: z.string().optional(),
  price: z.number().min(0, 'Price must be a positive number').multipleOf(0.01),
  note: z.string().max(1000).nullable(),
});

export const updateTransactionSchema = z.object({
  item: z.string().min(1, 'Item should be longer').max(255).optional(),
  brand: z.string().min(1, 'Brand should be longer').max(255).optional(),
  category: z.string().min(1, 'Category should be longer').max(255).optional(),
  date: z.date().optional(),
  price: z.number().min(0, 'Price must be a positive number').multipleOf(0.01).optional(),
});