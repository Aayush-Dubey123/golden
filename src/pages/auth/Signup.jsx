import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { UserPlus } from 'lucide-react';
import { toast } from 'sonner';

const Signup = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const { signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const redirectTarget = searchParams.get('redirect') || '/';

  const onSubmit = async (data) => {
    try {
      await signup(data);
      toast.success('Account created successfully');
      navigate(redirectTarget);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to create account');
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
            <span>🛒 Create an account to place your order. Your cart is saved!</span>
          </div>
        )}

        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#f2d06b]">
            <UserPlus className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-bold font-serif text-[#f2d06b]">Create Golden Kulcha Account</h2>
          <p className="text-xs text-[#b3a894] mt-2">Get started to place your orders online</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#f7f4ef]">First Name</label>
              <input
                type="text"
                {...register('first_name', { required: 'First name is required' })}
                className={`input ${errors.first_name ? 'border-red-500' : ''}`}
                placeholder="John"
              />
              {errors.first_name && <p className="mt-1 text-xs text-red-400">{errors.first_name.message}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#f7f4ef]">Last Name</label>
              <input
                type="text"
                {...register('last_name', { required: 'Last name is required' })}
                className={`input ${errors.last_name ? 'border-red-500' : ''}`}
                placeholder="Doe"
              />
              {errors.last_name && <p className="mt-1 text-xs text-red-400">{errors.last_name.message}</p>}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#f7f4ef]">Mobile Number</label>
            <input
              type="tel"
              {...register('mobile_number', { 
                required: 'Mobile is required',
                pattern: { value: /^[0-9]{10}$/, message: 'Must be 10 digits' }
              })}
              className={`input ${errors.mobile_number ? 'border-red-500' : ''}`}
              placeholder="9876543210"
            />
            {errors.mobile_number && <p className="mt-1 text-xs text-red-400">{errors.mobile_number.message}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#f7f4ef]">Email Address</label>
            <input
              type="email"
              {...register('email', { 
                required: 'Email is required',
                pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' }
              })}
              className={`input ${errors.email ? 'border-red-500' : ''}`}
              placeholder="john@example.com"
            />
            {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#f7f4ef]">Password</label>
            <input
              type="password"
              {...register('password', { 
                required: 'Password is required',
                minLength: { value: 8, message: 'Min 8 characters' }
              })}
              className={`input ${errors.password ? 'border-red-500' : ''}`}
              placeholder="••••••••"
            />
            {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary w-full py-3 text-black font-bold mt-2 hover:scale-[1.02] transition-transform"
          >
            {isSubmitting ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-[#b3a894]">
          Already have an account?{' '}
          <Link 
            to={`/login${redirectTarget !== '/' ? `?redirect=${encodeURIComponent(redirectTarget)}` : ''}`}
            className="font-bold text-[#f2d06b] hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
