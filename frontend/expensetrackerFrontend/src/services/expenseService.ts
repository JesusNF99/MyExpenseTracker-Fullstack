import api from './apiClient';
import { ExpenseRequest, ExpenseResponse } from '../types/schemas';

export const expenseService = {
    async getExpenses(): Promise<ExpenseResponse[]> {
        const response = await api.get('/api/expenses');
        return response.data;
    },

    async addExpense(expense: ExpenseRequest): Promise<ExpenseResponse> {
        const response = await api.post('/api/expenses', expense);
        return response.data;
    },

    async updateExpense(id: number, expense: ExpenseRequest): Promise<ExpenseResponse> {
        const response = await api.put(`/api/expenses/${id}`, expense);
        return response.data;
    },

    async deleteExpense(id: number): Promise<void> {
        await api.delete(`/api/expenses/${id}`);
    }
};
