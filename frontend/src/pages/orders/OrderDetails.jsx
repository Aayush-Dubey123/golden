import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderApi } from '../../api/orderApi';
import { format } from 'date-fns';
import { ArrowLeft, Package, Star } from 'lucide-react';
import Loader from '../../components/Loader';
import RatingStars from '../../components/RatingStars';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = useCallback(async () => {
    try {
      const data = await orderApi.getOrderById(id);
      setOrder(data.data);
    } catch (error) {
      console.error('Failed to fetch order details');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  if (loading) return <Loader />;
  if (!order) return null;

  const canRate = order.status === 'COMPLETED' && order.rating === null;

  return (
    <div className="mx-auto max-w-3xl">
      <button 
        onClick={() => navigate('/orders')}
        className="mb-6 flex items-center text-sm font-medium text-[#b3a894] hover:text-[#f2d06b] transition-colors"
      >
        <ArrowLeft className="mr-1 h-4 w-4" /> Back to Orders
      </button>

      <div className="card">
        <div className="border-b border-[#d4af37]/25 bg-[#121212] p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#f2d06b]">
                <Package className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold font-serif text-[#f2d06b]">Order #{order.id.slice(-8).toUpperCase()}</h1>
                <p className="text-xs text-[#b3a894]">
                  Placed on {format(new Date(order.created_at), 'MMMM d, yyyy h:mm a')}
                </p>
              </div>
            </div>
            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
              order.status === 'COMPLETED' ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40' : 
              order.status === 'CANCELLED' ? 'bg-red-950/80 text-red-400 border border-red-500/40' :
              'bg-amber-950/80 text-amber-400 border border-amber-500/40'
            }`}>
              {order.status}
            </span>
          </div>
        </div>

        <div className="p-6">
          <h2 className="mb-4 text-lg font-bold font-serif text-[#f2d06b]">Order Items</h2>
          <div className="rounded-xl border border-[#d4af37]/25 bg-black/40 p-5 mb-8">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold text-[#f7f4ef] text-lg font-serif">{order.food_item}</p>
                <p className="text-xs text-[#b3a894] mt-1">Type: {order.food_type}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-[#b3a894]">Quantity</p>
                <p className="font-bold text-[#f2d06b] text-xl">x{order.quantity}</p>
              </div>
            </div>
          </div>

          {canRate && (
            <RatingStars orderId={order.id} onRated={fetchOrder} />
          )}

          {order.rating !== null && (
            <div>
              <h2 className="mb-4 text-lg font-bold font-serif text-[#f2d06b]">Your Rating</h2>
              <div className="rounded-xl border border-[#d4af37]/25 bg-[#141414] p-6">
                <div className="flex items-center gap-1 text-[#f2d06b] mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-6 w-6 ${i < order.rating ? 'fill-current' : 'text-gray-700'}`} />
                  ))}
                  <span className="ml-2 font-bold text-[#f7f4ef]">{order.rating}/5</span>
                </div>
                {order.review && (
                  <p className="text-[#f7f4ef]/90 mt-3 italic text-sm">"{order.review}"</p>
                )}
                {order.rated_at && (
                  <p className="text-xs text-[#b3a894] mt-4">
                    Rated on {format(new Date(order.rated_at), 'MMM d, yyyy')}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
