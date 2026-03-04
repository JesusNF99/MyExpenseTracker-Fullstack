import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { UserSchema, User } from '../../types/schemas';
import { authService } from '../../services/authService';
import { LogIn, Loader2 } from 'lucide-react';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [error, setError] = React.useState<string | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<User>({
        resolver: zodResolver(UserSchema),
    });

    const onSubmit = async (data: User) => {
        setIsLoading(true);
        setError(null);
        try {
            await authService.login(data);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-indigo-600 p-3 rounded-xl mb-4">
                        <LogIn className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
                    <p className="text-slate-400 mt-2 text-center text-balance">
                        Track your expenses and save money effortlessly.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Username</label>
                        <input
                            {...register('username')}
                            type="text"
                            placeholder="Enter your username"
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                        {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                        <input
                            {...register('password')}
                            type="password"
                            placeholder="••••••••"
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                    </div>

                    {error && <div className="bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl p-3 text-sm text-center">{error}</div>}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/50 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 group"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Sign In <LogIn className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
                    </button>
                </form>

                <p className="text-center text-slate-400 mt-8 text-sm">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-indigo-500 hover:text-indigo-400 font-medium hover:underline">
                        Register now
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
