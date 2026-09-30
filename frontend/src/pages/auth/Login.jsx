import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LogIn, User, Store, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const Login = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const { login, demoLogin } = useAuth();
  const [demoLoadingRole, setDemoLoadingRole] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

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
          ? '✓ Demo Merchant session active — Terminal loaded'
          : '✓ Demo Customer session active'
      );

      if (userRole === 'SUPERADMIN' || userRole === 'ADMIN') {
        navigate('/dashboard');
      } else {
        navigate(redirectTarget);
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Demo login failed. Please try again.');
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
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#f2d06b]">
            <LogIn className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-bold font-serif text-[#f2d06b]">Golden Kulcha Sign In</h2>
          <p className="text-xs text-[#b3a894] mt-2">Sign in to complete your food order</p>
        </div>

        {/* Portfolio Demo Login Area */}
        <div className="mb-6 rounded-xl border border-[#d4af37]/35 bg-[#141414]/90 p-4 shadow-inner">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#d4af37] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#f2d06b]" />
              Portfolio Quick Demo Access
            </span>
            <span className="text-[10px] text-[#b3a894] font-medium">1-Click Login</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              id="demo-customer-btn"
              onClick={() => handleDemoLogin('CUSTOMER')}
              disabled={Boolean(demoLoadingRole) || isSubmitting}
              className="flex flex-col items-center justify-center p-3 rounded-xl border border-[#d4af37]/40 bg-[#0a0a0a] hover:bg-[#d4af37]/15 hover:border-[#f2d06b] transition-all text-center group cursor-pointer disabled:opacity-50"
            >
              <div className="w-8 h-8 rounded-full bg-[#d4af37]/15 flex items-center justify-center mb-1.5 text-[#f2d06b] group-hover:scale-110 transition-transform">
                <User className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-[#f7f4ef]">
                {demoLoadingRole === 'CUSTOMER' ? 'Signing in...' : 'Demo Customer'}
              </span>
              <span className="text-[10px] text-[#b3a894] mt-0.5">Browse, Cart & Order</span>
            </button>

            <button
              type="button"
              id="demo-merchant-btn"
              onClick={() => handleDemoLogin('MERCHANT')}
              disabled={Boolean(demoLoadingRole) || isSubmitting}
              className="flex flex-col items-center justify-center p-3 rounded-xl border border-[#d4af37]/40 bg-[#0a0a0a] hover:bg-[#d4af37]/15 hover:border-[#f2d06b] transition-all text-center group cursor-pointer disabled:opacity-50"
            >
              <div className="w-8 h-8 rounded-full bg-[#d4af37]/15 flex items-center justify-center mb-1.5 text-[#f2d06b] group-hover:scale-110 transition-transform">
                <Store className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-[#f7f4ef]">
                {demoLoadingRole === 'MERCHANT' ? 'Signing in...' : 'Demo Merchant'}
              </span>
              <span className="text-[10px] text-[#b3a894] mt-0.5">Live Terminal & Orders</span>
            </button>
          </div>
        </div>

        <div className="relative my-6 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#d4af37]/20" />
          </div>
          <span className="relative bg-[#0a0a0a] px-3 text-[11px] uppercase tracking-wider text-[#b3a894]">
            Or Sign In With Account
          </span>
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
