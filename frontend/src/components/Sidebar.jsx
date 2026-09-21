import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, PlusCircle, LogOut, Home, Store } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../context/CartContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { totalCount } = useCart();

  const isAdmin = user?.user_role === 'SUPERADMIN' || user?.user_role === 'ADMIN';

  const customerNavItems = [
    { name: 'Public Menu', path: '/', icon: Home },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Checkout / Order', path: '/create-order', icon: PlusCircle, badge: totalCount > 0 ? totalCount : null },
    { name: 'My Orders', path: '/orders', icon: ShoppingBag },
  ];

  const adminNavItems = [
    { name: 'Zomato Merchant Terminal', path: '/dashboard', icon: Store, badge: 'LIVE' },
  ];

  const navItems = isAdmin ? adminNavItems : customerNavItems;

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 -translate-x-full border-r border-[#d4af37]/25 bg-[#0c0c0c]/95 backdrop-blur-md transition-transform sm:translate-x-0">
      <div className="flex h-full flex-col overflow-y-auto px-4 py-6">
        {/* Brand Header */}
        <div className="mb-8 px-2 flex items-center gap-3">
          <img src="/IMAGE/gold.jpeg" alt="Golden Kulcha" className="w-9 h-9 rounded-full border border-[#d4af37]/50 object-cover" />
          <div>
            <span className="text-xl font-bold font-serif tracking-tight text-[#f2d06b]">
              Golden Kulcha
            </span>
            {isAdmin && (
              <span className="block text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                Merchant Admin
              </span>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <ul className="space-y-2 font-medium">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#d4af37]/25 to-transparent text-[#f2d06b] border border-[#d4af37]/40 shadow-md shadow-[#d4af37]/10'
                      : 'text-[#f7f4ef]/80 hover:bg-[#d4af37]/10 hover:text-[#f2d06b]'
                  }`
                }
              >
                <div className="flex items-center">
                  <item.icon className="h-5 w-5 text-[#d4af37]" />
                  <span className="ml-3">{item.name}</span>
                </div>
                {item.badge && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold shadow ${
                    isAdmin ? 'bg-emerald-500 text-black' : 'bg-[#f2d06b] text-black'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Footer / Logout */}
        <div className="mt-auto pt-6 border-t border-[#d4af37]/20">
          <div className="mb-3 px-3 py-2 rounded-xl bg-black/60 border border-[#d4af37]/20 text-xs text-[#b3a894]">
            <p className="font-bold text-[#f7f4ef] truncate">{user?.first_name || 'User'}</p>
            <p className="text-[10px] text-[#f2d06b] uppercase font-semibold mt-0.5">{user?.user_role || 'USER'}</p>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center rounded-xl px-3.5 py-2.5 text-sm font-semibold text-red-400 transition-colors hover:bg-red-950/40 hover:text-red-300 border border-red-500/20"
          >
            <LogOut className="h-5 w-5" />
            <span className="ml-3">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
