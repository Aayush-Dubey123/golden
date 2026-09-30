import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LogIn, UserCheck, Store } from 'lucide-react';
import { toast } from 'sonner';

const Login = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [demoLoadingRole, setDemoLoadingRole] = useState(null);

  const searchParams = new URLSearchParams(location.search);
  const redirectTarget = searchParams.get('redirect') || '/';

  const onSubmit = async (data) => {
    try {
      const res = await login(data);
      const userRole = res?.data?.user_role;
      toast.success('Logged in successfully');

      if (userRole === 'SUPERADMIN' || userRole === 'ADMIN') {
        navigate('/dashboard');
      } else {
        navigate(redirectTarget);
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to login. Check credentials.');
    }
  };

  const handleDemoLogin = async (role) => {
    setDemoLoadingRole(role);
    try {
      const res = await demoLogin(role);
      const userRole = res?.data?.user_role;
      toast.success(
        role === 'MERCHANT'
          ? '⚡ Signed in as Demo Merchant (Zomato Business Terminal)'
          : '⚡ Signed in as Demo Customer'
      );

      if (userRole === 'SUPERADMIN' || userRole === 'ADMIN' || role === 'MERCHANT') {
        navigate('/dashboard');
      } else {
        navigate(redirectTarget);
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to initialize demo login.');
    } finally {
      setDemoLoadingRole(null);
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

      <div className="relative z-10 w-full max-w-md rounded-2xl bg-[#0a0a0a]/90 border border-[#d4af37]/40 backdrop-blur-md p-8 shadow-2xl">
        {redirectTarget.includes('create-order') && (
          <div className="mb-6 rounded-xl border border-[#d4af37]/40 bg-[#d4af37]/15 p-3 text-center text-xs text-[#f2d06b] font-semibold flex items-center justify-center gap-2">
            <span>🛒 Sign in to complete your order. Your cart is saved!</span>
          </div>
        )}

        <div className="mb-6 flex flex-col items-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#f2d06b]">
            <LogIn className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-bold font-serif text-[#f2d06b]">Golden Kulcha Sign In</h2>
          <p className="text-xs text-[#b3a894] mt-1">Sign in to complete your food order or access terminal</p>
        </div>

        {/* Portfolio Demo Login Buttons */}
        <div className="mb-6 rounded-xl border border-[#d4af37]/40 bg-[#d4af37]/10 p-4">
          <p className="text-[11px] font-bold text-[#f2d06b] mb-2.5 text-center uppercase tracking-wider">
            ⚡ One-Click Portfolio Demo Access
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => handleDemoLogin('CUSTOMER')}
              disabled={demoLoadingRole !== null || isSubmitting}
              className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-[#d4af37]/40 bg-black/70 py-3 px-3 text-xs font-bold text-[#f7f4ef] hover:bg-[#d4af37]/25 hover:border-[#f2d06b] transition-all disabled:opacity-50 active:scale-95 shadow-md"
            >
              <UserCheck className="w-5 h-5 text-[#f2d06b]" />
              <span>{demoLoadingRole === 'CUSTOMER' ? 'Signing in...' : 'Demo Customer'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('MERCHANT')}
              disabled={demoLoadingRole !== null || isSubmitting}
              className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-[#d4af37]/40 bg-black/70 py-3 px-3 text-xs font-bold text-[#f7f4ef] hover:bg-[#d4af37]/25 hover:border-[#f2d06b] transition-all disabled:opacity-50 active:scale-95 shadow-md"
            >
              <Store className="w-5 h-5 text-[#f2d06b]" />
              <span>{demoLoadingRole === 'MERCHANT' ? 'Signing in...' : 'Demo Merchant'}</span>
            </button>
          </div>
        </div>

        <div className="relative mb-6 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#d4af37]/20" />
          </div>
          <span className="relative bg-[#0a0a0a] px-3 text-[10px] uppercase tracking-widest text-[#b3a894]">
            Or sign in with standard account
          </span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#f7f4ef]">
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
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#f7f4ef]">
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
            disabled={isSubmitting || demoLoadingRole !== null}
            className="btn btn-primary w-full py-3 text-black font-bold hover:scale-[1.02] transition-transform"
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-[#b3a894]">
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

