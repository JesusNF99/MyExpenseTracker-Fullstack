import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ExpenseRequestSchema, ExpenseRequest, ExpenseResponse } from '../../types/schemas';
import { expenseService } from '../../services/expenseService';
import { X, Save, Loader2 } from 'lucide-react';

interface ExpenseFormProps {
    expense: ExpenseResponse | null;
    onClose: () => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ expense, onClose }) => {
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ExpenseRequest>({
        resolver: zodResolver(ExpenseRequestSchema),
        defaultValues: expense ? {
            name: expense.name,
            description: expense.description,
            price: expense.price,
            quantity: expense.quantity,
            category: expense.category,
        } : {
            quantity: 1,
            price: 0,
        },
    });

    const mutation = useMutation({
        mutationFn: (data: ExpenseRequest) =>
            expense
                ? expenseService.updateExpense(expense.id, data)
                : expenseService.addExpense(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenses'] });
            onClose();
        },
    });

    const onSubmit = (data: ExpenseRequest) => {
        mutation.mutate(data);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-6 border-b border-slate-800">
                    <h2 className="text-xl font-bold text-white">
                        {expense ? 'Edit Expense' : 'Add New Expense'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-300 mb-2">Item Name</label>
                            <input
                                {...register('name')}
                                placeholder="e.g., MacBook Air"
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Price ($)</label>
                            <input
                                {...register('price', { valueAsNumber: true })}
                                type="number"
                                step="0.01"
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            />
                            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Quantity</label>
                            <input
                                {...register('quantity', { valueAsNumber: true })}
                                type="number"
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            />
                            {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity.message}</p>}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                            <select
                                {...register('category')}
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
                            >
                                <option value="General">General</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Food">Food & Grocery</option>
                                <option value="Health">Health</option>
                                <option value="Transport">Transport</option>
                                <option value="Leisure">Leisure</option>
                            </select>
                            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                            <textarea
                                {...register('description')}
                                rows={3}
                                placeholder="Optional details..."
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            />
                        </div>
                    </div>

                    <div className="pt-6 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 border border-slate-700 rounded-xl text-slate-300 font-semibold hover:bg-slate-800 hover:text-white transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={mutation.isPending}
                            className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/50 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                            {mutation.isPending
                                ? <Loader2 className="w-5 h-5 animate-spin" />
                                : <><Save className="w-5 h-5" /> {expense ? 'Update' : 'Save'} Expense</>
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ExpenseForm;
