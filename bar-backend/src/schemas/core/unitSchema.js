import { z } from 'zod';

export const transactionSchema = z.object({
    name: z.string().min(1, 'Name should be longer').max(255),
    type: z.string().min(1, 'Type should be longer').max(255),
    base_unit: z.string().min(1, 'Base unit should be longer').max(50),
    multiplier: z.number().min(0, 'Multiplier must be a positive number').multipleOf(0.0001),

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