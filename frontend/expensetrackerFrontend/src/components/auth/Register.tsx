import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { UserSchema, User } from '../../types/schemas';
import { authService } from '../../services/authService';
import { UserPlus, Loader2 } from 'lucide-react';

const Register: React.FC = () => {
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
            await authService.signup(data);
            alert('Account created successfully! Please login.');
            navigate('/login');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed. Try a different username.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-emerald-600 p-3 rounded-xl mb-4">
                        <UserPlus className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">Create Account</h1>
                    <p className="text-slate-400 mt-2 text-center"> Join the smart way to manage your expenses.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Username</label>
                        <input
                            {...register('username')}
                            type="text"
                            placeholder="Choose a username"
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        />
                        {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                        <input
                            {...register('password')}
                            type="password"
                            placeholder="••••••••"
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                    </div>

                    {error && <div className="bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl p-3 text-sm text-center">{error}</div>}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-600/50 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 group"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Register <UserPlus className="w-4 h-4 group-hover:scale-110 transition-transform" /></>}
                    </button>
                </form>

                <p className="text-center text-slate-400 mt-8 text-sm">
                    Already have an account?{' '}
                    <Link to="/login" className="text-emerald-500 hover:text-emerald-400 font-medium hover:underline">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
