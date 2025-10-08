import { z } from 'zod';

export const liquorSchema = z.object({
    liquor_id: z.number(),
    brand: z.string().min(1, 'Brand should be longer').max(255),
    name: z.string().min(1, 'Name should be longer').max(255),
    ml: z.number().min(0, 'ML must be a positive number').multipleOf(0.0001),
    abv: z.number().min(0, 'ABV must be a positive number').max(100).multipleOf(0.01),
    img_path: z.string().optional(),
    type: z.string().min(1, 'Type should be longer').max(255),
    present: z.boolean().optional()
});

export const createLiquorSchema = transactionSchema.omit({
    liquor_id: true,
    img_path: true,
    presesnt: true
});

export const updateLiquorSchema = z.object({
    brand: z.string().min(1, 'Brand should be longer').max(255),
    name: z.string().min(1, 'Name should be longer').max(255),
    ml: z.number().min(0, 'ML must be a positive number').multipleOf(0.0001),
    abv: z.number().min(0, 'ABV must be a positive number').max(100).multipleOf(0.01),
    type: z.string().min(1, 'Type should be longer').max(255)
});