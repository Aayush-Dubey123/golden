import React, { useEffect, useState } from 'react';
import { orderApi } from '../../api/orderApi';
import { Package, CheckCircle2, Clock, Star } from 'lucide-react';
import Loader from '../../components/Loader';

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderApi.getOrders();
        setOrders(data?.data?.list || []);
      } catch (error) {
        console.error('Failed to fetch orders for dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <Loader />;

  const completed = orders.filter(o => o.status === 'COMPLETED').length;
  const pending = orders.filter(o => o.status !== 'COMPLETED').length;
  const rated = orders.filter(o => o.rating !== null).length;

  const stats = [
    { label: 'Total Orders', value: orders.length, icon: Package, color: 'text-[#f2d06b]', bg: 'bg-[#d4af37]/20 border border-[#d4af37]/40' },
    { label: 'Completed', value: completed, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-950/40 border border-emerald-500/30' },
    { label: 'Pending', value: pending, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-950/40 border border-amber-500/30' },
    { label: 'Rated', value: rated, icon: Star, color: 'text-purple-400', bg: 'bg-purple-950/40 border border-purple-500/30' },
  ];

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold font-serif text-[#f2d06b]">Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="card p-5 hover:border-[#f2d06b] transition-all">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#b3a894]">{stat.label}</p>
                <p className="text-2xl font-bold font-serif text-[#f7f4ef]">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="mb-4 text-xl font-bold font-serif text-[#f2d06b]">Recent Orders</h2>
      <div className="card">
        {orders.length === 0 ? (
          <div className="p-8 text-center text-[#b3a894]">No orders found yet. Create your first order!</div>
        ) : (
          <div className="divide-y divide-[#d4af37]/20">
            {orders.slice(0, 5).map(order => (
              <div key={order.id} className="flex items-center justify-between p-4 hover:bg-[#d4af37]/10 transition-colors">
                <div>
                  <p className="font-semibold text-[#f7f4ef]">{order.food_item}</p>
                  <p className="text-xs text-[#b3a894]">Qty: {order.quantity} • Type: {order.food_type}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${
                    order.status === 'COMPLETED' ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30' : 'bg-amber-950/60 text-amber-400 border border-amber-500/30'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
