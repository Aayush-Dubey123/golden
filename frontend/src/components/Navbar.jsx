import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

const Navbar = () => {
  const { user } = useAuth();
  const { totalCount } = useCart();

  return (
    <nav className="fixed left-0 right-0 top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[#d4af37]/25 bg-[#0c0c0c]/90 backdrop-blur-md px-4 sm:pl-72">
      <div className="flex items-center">
        <Link to="/" className="text-sm font-semibold text-[#f2d06b] hover:underline flex items-center gap-2">
          <span>← Public Menu</span>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <Link
          to="/"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#f2d06b] text-xs font-bold"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Cart ({totalCount})</span>
        </Link>

        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#d4af37] to-[#f2d06b] text-black text-sm font-bold shadow-md">
            {user?.first_name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <span className="hidden text-sm font-medium text-[#f7f4ef] sm:block">
            {user?.first_name || 'User'}
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
