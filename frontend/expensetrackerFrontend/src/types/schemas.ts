import { z } from 'zod';

// --- Auth Schemas ---

export const UserSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type User = z.infer<typeof UserSchema>;

// --- Expense Schemas ---

export const ExpenseRequestSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters').max(100),
    description: z.string().optional(),
    price: z.number().min(0, 'Price must be a positive number'),
    quantity: z.number().int().min(1, 'Quantity must be at least 1'),
    category: z.string().optional(),
});

export type ExpenseRequest = z.infer<typeof ExpenseRequestSchema>;

export interface ExpenseResponse {
    id: number;
    name: string;
    description?: string;
    price: number;
    quantity: number;
    category?: string;
}
