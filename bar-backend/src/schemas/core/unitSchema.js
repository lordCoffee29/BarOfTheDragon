import { z } from 'zod';

export const unitSchema = z.object({
    name: z.string().min(1, 'Name should be longer').max(255),
    type: z.string().min(1, 'Type should be longer').max(255),
    base_unit: z.string().min(1, 'Base unit should be longer').max(50),
    multiplier: z.number().min(0, 'Multiplier must be a positive number').multipleOf(0.0001),

});

export const createUnitSchema = transactionSchema.omit({
    multiplier: true
});

export const updateUnitSchema = z.object({
    name: z.string().min(1, 'Name should be longer').max(255),
    type: z.string().min(1, 'Type should be longer').max(255),
    base_unit: z.string().min(1, 'Base unit should be longer').max(50)
});