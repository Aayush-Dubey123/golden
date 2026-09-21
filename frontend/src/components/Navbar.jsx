import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../context/CartContext';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Store, ShieldCheck } from 'lucide-react';

const Navbar = () => {
  const { user } = useAuth();
  const { totalCount } = useCart();
  const location = useLocation();

  const isAdmin = user?.user_role === 'SUPERADMIN' || user?.user_role === 'ADMIN';

  return (
    <nav className="fixed left-0 right-0 top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[#d4af37]/25 bg-[#0c0c0c]/90 backdrop-blur-md px-4 sm:pl-72 pr-6">
      <div className="flex items-center gap-3">
        {isAdmin ? (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-emerald-500/40 bg-emerald-950/40 text-xs font-bold text-emerald-400">
            <Store className="w-4 h-4 text-emerald-400" />
            <span>Zomato Merchant Terminal</span>
          </div>
        ) : (
          <Link 
            to="/" 
            className="text-xs sm:text-sm font-semibold text-[#f2d06b] hover:text-white transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#d4af37]/30 bg-black/40"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Browse Public Menu</span>
          </Link>
        )}
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Customer Cart / Checkout Button */}
        {!isAdmin && (
          <Link
            to={totalCount > 0 ? "/create-order" : "/"}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-bold transition-all ${
              location.pathname === '/create-order'
                ? 'bg-[#f2d06b] text-black border-[#f2d06b]'
                : 'bg-[#d4af37]/20 border-[#d4af37]/40 text-[#f2d06b] hover:bg-[#d4af37]/30'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Checkout ({totalCount})</span>
          </Link>
        )}

        {/* User Badge */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-[#d4af37]/20">
          <div className={`flex h-9 w-9 items-center justify-center rounded-full text-black text-sm font-bold shadow-md ${
            isAdmin ? 'bg-gradient-to-br from-emerald-400 to-emerald-600' : 'bg-gradient-to-br from-[#d4af37] to-[#f2d06b]'
          }`}>
            {user?.first_name?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div className="hidden sm:block">
            <span className="block text-sm font-semibold text-[#f7f4ef]">
              {user?.first_name || 'Admin'}
            </span>
            {isAdmin && (
              <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold uppercase">
                <ShieldCheck className="w-3 h-3" /> {user?.user_role}
              </span>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
