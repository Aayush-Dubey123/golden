import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderApi } from '../../api/orderApi';
import { format } from 'date-fns';
import { ChevronRight, Star } from 'lucide-react';
import Loader from '../../components/Loader';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderApi.getOrders();
        setOrders(data?.data?.list || []);
      } catch (error) {
        console.error('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold font-serif text-[#f2d06b]">My Orders</h1>
      
      <div className="card">
        {orders.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-lg font-serif font-semibold text-[#f7f4ef]">No orders yet</p>
            <p className="mt-1 text-sm text-[#b3a894]">Browse our menu to place your first delicious order.</p>
            <button onClick={() => navigate('/')} className="btn btn-primary mt-6">
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#f7f4ef]">
              <thead className="bg-[#141414] text-xs uppercase font-semibold text-[#f2d06b] border-b border-[#d4af37]/25">
                <tr>
                  <th className="px-6 py-4 font-bold">Order Item</th>
                  <th className="px-6 py-4 font-bold">Date</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold">Rating</th>
                  <th className="px-6 py-4 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d4af37]/15">
                {orders.map((order) => (
                  <tr 
                    key={order.id} 
                    onClick={() => navigate(`/orders/${order.id}`)}
                    className="cursor-pointer hover:bg-[#d4af37]/10 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="font-semibold text-[#f7f4ef]">{order.food_item}</p>
                      <p className="text-xs text-[#b3a894]">Qty: {order.quantity} • {order.food_type}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-[#b3a894]">
                      {format(new Date(order.created_at), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        order.status === 'COMPLETED' ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40' : 
                        order.status === 'CANCELLED' ? 'bg-red-950/80 text-red-400 border border-red-500/40' :
                        'bg-amber-950/80 text-amber-400 border border-amber-500/40'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.rating ? (
                        <div className="flex items-center text-[#f2d06b]">
                          <span className="font-bold mr-1">{order.rating}</span>
                          <Star className="h-4 w-4 fill-current" />
                        </div>
                      ) : (
                        <span className="text-[#b3a894]">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <ChevronRight className="inline-block h-5 w-5 text-[#d4af37]" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
