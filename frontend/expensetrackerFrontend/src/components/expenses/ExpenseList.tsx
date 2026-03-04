import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { expenseService } from '../../services/expenseService';
import { ExpenseResponse } from '../../types/schemas';
import {
    Plus,
    Trash2,
    Edit2,
    Search,
    DollarSign,
    Package,
    Loader2,
    AlertCircle,
    LogOut
} from 'lucide-react';
import { authService } from '../../services/authService';
import ExpenseForm from './ExpenseForm';

const ExpenseList: React.FC = () => {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = React.useState('');
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [editingExpense, setEditingExpense] = React.useState<ExpenseResponse | null>(null);

    // Queries
    const { data: expenses, isLoading, isError } = useQuery({
        queryKey: ['expenses'],
        queryFn: expenseService.getExpenses,
    });

    // Mutations
    const deleteMutation = useMutation({
        mutationFn: expenseService.deleteExpense,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenses'] });
        },
    });

    const isDataArray = Array.isArray(expenses);

    const filteredExpenses = isDataArray
        ? expenses.filter(exp =>
            (exp.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (exp.category?.toLowerCase() || '').includes(searchTerm.toLowerCase())
        )
        : [];

    const totalSpent = isDataArray
        ? expenses.reduce((acc, curr) => acc + ((Number(curr.price) || 0) * (Number(curr.quantity) || 0)), 0)
        : 0;
    const username = authService.getUsername();

    const handleEdit = (expense: ExpenseResponse) => {
        setEditingExpense(expense);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this expense?')) {
            deleteMutation.mutate(id);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingExpense(null);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
                <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 pb-20">
            {/* Navbar */}
            <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10 transition-all">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-2">
                            <div className="bg-indigo-600 p-2 rounded-lg">
                                <DollarSign className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold tracking-tight">ExpenseTracker</span>
                        </div>
                        <div className="flex items-center gap-6">
                            <span className="hidden sm:block text-sm text-slate-400">
                                Welcome, <span className="text-indigo-400 font-semibold">{username}</span>
                            </span>
                            <button
                                onClick={() => authService.logout()}
                                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium"
                            >
                                <LogOut className="w-4 h-4" /> Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
                {/* Header Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                    <div className="lg:col-span-2 space-y-2">
                        <h1 className="text-3xl font-extrabold tracking-tight">Dashboard</h1>
                        <p className="text-slate-400">Keep track of your spending and stay within budget.</p>
                    </div>
                    <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 shadow-xl shadow-indigo-500/10 flex flex-col justify-center">
                        <p className="text-indigo-100 text-sm font-medium opacity-80 mb-1">Total Balance Spent</p>
                        <h2 className="text-4xl font-black text-white">${totalSpent.toFixed(2)}</h2>
                    </div>
                </div>

                {/* Actions Bar */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search by name or category..."
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-indigo-500/20"
                    >
                        <Plus className="w-5 h-5" /> Add New Expense
                    </button>
                </div>

                {/* Expenses Table/Grid */}
                {isError ? (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                        <h3 className="text-lg font-bold text-white mb-2">Error loading expenses</h3>
                        <p className="text-slate-400">Please make sure your server is running and try again.</p>
                    </div>
                ) : filteredExpenses?.length === 0 ? (
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-20 flex flex-col items-center justify-center text-center">
                        <Package className="w-16 h-16 text-slate-700 mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">No expenses found</h3>
                        <p className="text-slate-400">Start adding your first expense to see it here!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredExpenses?.map((expense) => {
                            const expenseId = expense.id || expense.expenseId || expense._id;
                            const expenseName = expense.name || expense.expenseName || expense.title || 'Unnamed Expense';
                            const expensePrice = Number(expense.price || expense.amount || expense.cost || 0);
                            const expenseQty = Number(expense.quantity || expense.qty || 1);

                            return (
                                <div
                                    key={expenseId}
                                    className="group bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 hover:bg-slate-800/80 transition-all duration-300 relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleEdit(expense)}
                                            className="p-2 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(expenseId)}
                                            className="p-2 bg-slate-800 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors border border-slate-700"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="flex items-start justify-between mb-4 mt-2">
                                        <div className="space-y-1">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">
                                                {expense.category || 'General'}
                                            </span>
                                            <h3 className="text-xl font-bold text-white">{expenseName}</h3>
                                        </div>
                                    </div>

                                    <p className="text-slate-400 text-sm mb-6 line-clamp-2 h-10">
                                        {expense.description || 'No description provided.'}
                                    </p>

                                    <div className="pt-4 border-t border-slate-800 flex justify-between items-end">
                                        <div className="space-y-0.5">
                                            <p className="text-slate-500 text-xs uppercase font-semibold">Price per unit</p>
                                            <p className="text-lg font-bold text-indigo-400">${expensePrice.toFixed(2)}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-slate-500 text-xs uppercase font-semibold">Qty</p>
                                            <p className="text-lg font-bold text-white">{expenseQty}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>

            {/* Modal */}
            {isModalOpen && (
                <ExpenseForm
                    expense={editingExpense}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};

export default ExpenseList;
