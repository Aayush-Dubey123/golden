import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LogIn } from 'lucide-react';
import { toast } from 'sonner';

const Login = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const redirectTarget = searchParams.get('redirect') || '/';

  const onSubmit = async (data) => {
    try {
      await login(data);
      toast.success('Logged in successfully');
      navigate(redirectTarget);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to login. Check credentials.');
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-[#f7f4ef] flex items-center justify-center px-4 py-8">
      {/* Fixed Background Image Overlay */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40 pointer-events-none" 
        style={{ backgroundImage: `url('/IMAGE/BACK.jpeg')` }}
      />
      <div className="fixed inset-0 z-0 bg-[#0b0b0b]/85 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md rounded-2xl bg-[#0a0a0a]/85 border border-[#d4af37]/30 backdrop-blur-md p-8 shadow-2xl">
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#f2d06b]">
            <LogIn className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-bold font-serif text-[#f2d06b]">Golden Kulcha Sign In</h2>
          <p className="text-xs text-[#b3a894] mt-2">Sign in to complete your food order</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#f7f4ef]">
              Username / First Name
            </label>
            <input
              type="text"
              {...register('username', { required: 'Username is required' })}
              className={`input ${errors.username ? 'border-red-500' : ''}`}
              placeholder="e.g., ayush"
            />
            {errors.username && (
              <p className="mt-1 text-xs text-red-400">{errors.username.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#f7f4ef]">
              Password
            </label>
            <input
              type="password"
              {...register('password', { required: 'Password is required' })}
              className={`input ${errors.password ? 'border-red-500' : ''}`}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary w-full py-3 text-black font-bold hover:scale-[1.02] transition-transform"
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-[#b3a894]">
          Don't have an account?{' '}
          <Link 
            to={`/signup${redirectTarget !== '/' ? `?redirect=${encodeURIComponent(redirectTarget)}` : ''}`}
            className="font-bold text-[#f2d06b] hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
