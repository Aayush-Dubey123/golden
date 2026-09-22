import React, { useEffect, useState, useCallback, useRef } from 'react';
import { orderApi } from '../../api/orderApi';
import { useAuth } from '../../hooks/useAuth';
import { format, formatDistanceToNow } from 'date-fns';
import { 
  CheckCircle2, 
  Clock, 
  XCircle, 
  ChefHat, 
  ShoppingBag, 
  BellRing, 
  RefreshCw, 
  Volume2, 
  VolumeX, 
  DollarSign, 
  MapPin, 
  Phone, 
  Store,
  Sparkles,
  Flame,
  Check
} from 'lucide-react';
import Loader from '../../components/Loader';
import { toast } from 'sonner';

const Dashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, IN_PROGRESS, ACCEPTED, COMPLETED, CANCELLED
  const [isStoreOnline, setIsStoreOnline] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [lastRefreshedAt, setLastRefreshedAt] = useState(new Date());

  const prevPendingCount = useRef(0);

  const fetchOrders = useCallback(async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);
      const data = await orderApi.getOrders();
      const list = Array.isArray(data?.data) ? data.data : (data?.data?.list || []);
      
      const newPendingCount = list.filter(o => o.status === 'IN_PROGRESS').length;

      // Audio notification if new orders land
      if (newPendingCount > prevPendingCount.current && soundEnabled) {
        toast.info('🔔 NEW INCOMING ORDER ARRIVED!', {
          description: 'Check Zomato Business Terminal to accept the order.',
          duration: 6000
        });
      }
      prevPendingCount.current = newPendingCount;

      setOrders(list);
      setLastRefreshedAt(new Date());
    } catch (error) {
      console.error('Failed to fetch merchant orders', error);
      if (!isSilent) toast.error('Failed to update live orders list');
    } finally {
      if (!isSilent) setLoading(false);
    }
  }, [soundEnabled]);

  // Live Auto-Refresh Polling every 5 seconds (Zomato Business Style)
  useEffect(() => {
    fetchOrders(false);
    const interval = setInterval(() => {
      fetchOrders(true);
    }, 5000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    setActionLoadingId(orderId);
    try {
      await orderApi.updateOrder(orderId, { status: newStatus });
      toast.success(
        newStatus === 'ACCEPTED' ? '✓ Order ACCEPTED! Sent to Kitchen' :
        newStatus === 'COMPLETED' ? '🎉 Order COMPLETED & Out for Delivery!' :
        'Order updated successfully'
      );
      fetchOrders(true);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to update order status');
    } finally {
      setActionLoadingId(null);
    }
  };

  if (loading && orders.length === 0) return <Loader />;

  // Filter calculations
  const pendingOrders = orders.filter(o => o.status === 'IN_PROGRESS');
  const acceptedOrders = orders.filter(o => o.status === 'ACCEPTED');
  const completedOrders = orders.filter(o => o.status === 'COMPLETED');
  const cancelledOrders = orders.filter(o => o.status === 'CANCELLED');

  const getPriceForOrder = (order) => {
    if (order.price) return parseFloat(order.price);
    if (order.food_item?.includes('Paneer')) return 160;
    if (order.food_item?.includes('Cheese')) return 180;
    if (order.food_item?.includes('Garlic')) return 140;
    if (order.food_item?.includes('Lassi')) return 60;
    if (order.food_item?.includes('Extra')) return 50;
    return 120;
  };

  const totalRevenue = completedOrders.reduce((sum, o) => sum + (o.quantity * getPriceForOrder(o)), 0);

  const filteredOrders = activeTab === 'ALL' ? orders :
    activeTab === 'IN_PROGRESS' ? pendingOrders :
    activeTab === 'ACCEPTED' ? acceptedOrders :
    activeTab === 'COMPLETED' ? completedOrders : cancelledOrders;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Zomato Business Header */}
      <div className="card p-6 border-[#d4af37]/35 bg-[#0b0b0b]/90 backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#d4af37]/20 pb-5">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#d4af37] via-[#f2d06b] to-[#d4af37] text-black font-bold shadow-lg shadow-[#d4af37]/30">
              <Store className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold font-serif text-[#f2d06b]">Zomato Business Merchant Terminal</h1>
                <span className="rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 px-2.5 py-0.5 text-[11px] font-bold text-[#f2d06b]">
                  Golden Kulcha Hub
                </span>
              </div>
              <p className="text-xs text-[#b3a894] mt-1 flex items-center gap-2">
                <span>Welcome back, <strong className="text-[#f7f4ef]">{user?.first_name || 'Restaurant Admin'}</strong></span>
                <span>•</span>
                <span className="flex items-center gap-1 text-[#f2d06b]">
                  <RefreshCw className="w-3 h-3 animate-spin" /> Live Sync (5s)
                </span>
              </p>
            </div>
          </div>

          {/* Operational Controls */}
          <div className="flex items-center gap-3">
            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2.5 rounded-xl border transition-colors ${
                soundEnabled 
                  ? 'border-[#d4af37]/40 bg-[#d4af37]/20 text-[#f2d06b]' 
                  : 'border-gray-800 bg-black/60 text-gray-400'
              }`}
              title={soundEnabled ? 'Order sound alert ON' : 'Order sound alert OFF'}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>

            {/* Manual Refresh */}
            <button
              onClick={() => fetchOrders(false)}
              className="p-2.5 rounded-xl border border-[#d4af37]/30 bg-black/50 text-[#f2d06b] hover:bg-[#d4af37]/20 transition-all"
              title="Force Refresh Orders"
            >
              <RefreshCw className="w-5 h-5" />
            </button>

            {/* Store Status Switch */}
            <button
              onClick={() => setIsStoreOnline(!isStoreOnline)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
                isStoreOnline
                  ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 shadow-lg shadow-emerald-950/50'
                  : 'bg-red-950/80 border border-red-500/50 text-red-400'
              }`}
            >
              <span className={`h-2.5 w-2.5 rounded-full ${isStoreOnline ? 'bg-emerald-400 animate-ping' : 'bg-red-400'}`} />
              <span>{isStoreOnline ? 'STORE ONLINE (Accepting Orders)' : 'STORE OFFLINE'}</span>
            </button>
          </div>
        </div>

        {/* Real-Time Operational Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {/* New Pending Orders Alert Card */}
          <div className={`p-4 rounded-2xl border transition-all ${
            pendingOrders.length > 0 
              ? 'border-red-500/60 bg-red-950/30 text-red-200 shadow-xl shadow-red-950/40 animate-pulse-subtle' 
              : 'border-[#d4af37]/20 bg-black/40 text-[#f7f4ef]'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#b3a894]">Pending Acceptance</span>
              <div className="p-2 rounded-xl bg-red-500/20 text-red-400">
                <BellRing className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-3xl font-bold font-serif text-red-400">{pendingOrders.length}</span>
              <span className="text-xs text-red-300 font-semibold">Requires Action</span>
            </div>
          </div>

          {/* Kitchen Preparing */}
          <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-950/20 text-[#f7f4ef]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#b3a894]">Kitchen Preparing</span>
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                <Flame className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-3xl font-bold font-serif text-amber-400">{acceptedOrders.length}</span>
              <span className="text-xs text-amber-300 font-semibold">In Cooking</span>
            </div>
          </div>

          {/* Completed Orders */}
          <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 text-[#f7f4ef]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#b3a894]">Fulfilled & Delivered</span>
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-3xl font-bold font-serif text-emerald-400">{completedOrders.length}</span>
              <span className="text-xs text-emerald-300 font-semibold">Orders Dispatched</span>
            </div>
          </div>

          {/* Estimated Revenue */}
          <div className="p-4 rounded-2xl border border-[#d4af37]/35 bg-[#d4af37]/10 text-[#f7f4ef]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#b3a894]">Total Revenue Today</span>
              <div className="p-2 rounded-xl bg-[#d4af37]/20 text-[#f2d06b]">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-3xl font-bold font-serif text-[#f2d06b]">₹{totalRevenue}</span>
              <span className="text-xs text-[#f2d06b] font-semibold">Verified Sales</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs Queue */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setActiveTab('ALL')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
            activeTab === 'ALL'
              ? 'bg-[#f2d06b] text-black border-[#f2d06b] shadow-md shadow-[#d4af37]/20'
              : 'bg-[#0a0a0a] text-[#b3a894] border-[#d4af37]/20 hover:bg-[#d4af37]/15'
          }`}
        >
          All Orders ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab('IN_PROGRESS')}
          className={`relative px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border flex items-center gap-1.5 ${
            activeTab === 'IN_PROGRESS'
              ? 'bg-red-500 text-white border-red-500 shadow-md shadow-red-500/20'
              : 'bg-[#0a0a0a] text-red-400 border-red-500/30 hover:bg-red-950/40'
          }`}
        >
          <BellRing className="w-3.5 h-3.5" />
          <span>New Orders ({pendingOrders.length})</span>
          {pendingOrders.length > 0 && (
            <span className="h-2 w-2 rounded-full bg-red-400 animate-ping" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('ACCEPTED')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border flex items-center gap-1.5 ${
            activeTab === 'ACCEPTED'
              ? 'bg-amber-500 text-black border-amber-500 shadow-md shadow-amber-500/20'
              : 'bg-[#0a0a0a] text-amber-400 border-amber-500/30 hover:bg-amber-950/40'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>Kitchen Preparing ({acceptedOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('COMPLETED')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border flex items-center gap-1.5 ${
            activeTab === 'COMPLETED'
              ? 'bg-emerald-500 text-black border-emerald-500 shadow-md shadow-emerald-500/20'
              : 'bg-[#0a0a0a] text-emerald-400 border-emerald-500/30 hover:bg-emerald-950/40'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Completed ({completedOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('CANCELLED')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
            activeTab === 'CANCELLED'
              ? 'bg-gray-700 text-white border-gray-600'
              : 'bg-[#0a0a0a] text-gray-400 border-gray-800 hover:bg-gray-900'
          }`}
        >
          Cancelled ({cancelledOrders.length})
        </button>
      </div>

      {/* Orders List Stream */}
      {filteredOrders.length === 0 ? (
        <div className="card p-12 text-center text-[#b3a894]">
          <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-[#d4af37]/40" />
          <p className="text-base font-serif font-bold text-[#f7f4ef]">No orders found in this queue.</p>
          <p className="text-xs text-[#b3a894] mt-1">Customer orders placed online will appear here live in real-time.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredOrders.map((order) => {
            const isPending = order.status === 'IN_PROGRESS';
            const isAccepted = order.status === 'ACCEPTED';
            const isCompleted = order.status === 'COMPLETED';
            const isCancelled = order.status === 'CANCELLED';

            return (
              <div 
                key={order.id} 
                className={`card p-6 flex flex-col justify-between transition-all ${
                  isPending 
                    ? 'border-2 border-red-500/80 bg-[#0f0a0a] shadow-2xl shadow-red-950/30 ring-1 ring-red-500/30' 
                    : isAccepted 
                    ? 'border-2 border-amber-500/70 bg-[#0f0e0a]' 
                    : 'border-[#d4af37]/25 bg-[#0a0a0a]/85'
                }`}
              >
                <div>
                  {/* Order Top Bar */}
                  <div className="flex items-center justify-between pb-3 border-b border-[#d4af37]/20 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#f2d06b] font-mono">
                        #ORD-{order.id.slice(-6).toUpperCase()}
                      </span>
                      <span className="text-[11px] text-[#b3a894]">
                        • {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
                      </span>
                    </div>

                    {/* Status Pill */}
                    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
                      isPending ? 'bg-red-500 text-white animate-bounce' :
                      isAccepted ? 'bg-amber-500 text-black' :
                      isCompleted ? 'bg-emerald-950 border border-emerald-500/40 text-emerald-400' :
                      'bg-gray-800 text-gray-400'
                    }`}>
                      {isPending && <BellRing className="w-3 h-3" />}
                      {isAccepted && <Flame className="w-3 h-3" />}
                      {isCompleted && <CheckCircle2 className="w-3 h-3" />}
                      <span>{isPending ? 'NEW ORDER (PENDING)' : isAccepted ? 'KITCHEN PREPARING' : order.status}</span>
                    </span>
                  </div>

                  {/* Customer Info */}
                  <div className="mb-4 rounded-xl bg-black/60 p-3.5 border border-[#d4af37]/20 space-y-1.5 text-xs text-[#b3a894]">
                    <div className="flex items-center justify-between text-[#f7f4ef]">
                      <span className="font-bold text-sm text-[#f2d06b]">{order.customer_name || user?.first_name || 'Customer'}</span>
                      <span className="flex items-center gap-1 text-[11px]">
                        <Phone className="w-3 h-3 text-[#d4af37]" /> {order.customer_phone || '+91 9876543210'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                      <span className="truncate">{order.customer_address || 'Main Street, Golden Kulcha Delivery Zone'}</span>
                    </div>
                  </div>

                  {/* Order Items Breakdown */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          order.food_type === 'VEG' ? 'border-emerald-500 text-emerald-400 bg-emerald-950/40' : 'border-red-500 text-red-400 bg-red-950/40'
                        }`}>
                          {order.food_type}
                        </span>
                        <span className="font-bold text-base text-[#f7f4ef] font-serif">{order.food_item}</span>
                      </div>
                      <span className="font-bold text-base text-[#f2d06b]">x{order.quantity}</span>
                    </div>
                  </div>
                </div>

                {/* Zomato Merchant Operational Actions */}
                <div className="pt-4 border-t border-[#d4af37]/20 flex flex-col gap-2">
                  {isPending && (
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'ACCEPTED')}
                        disabled={actionLoadingId === order.id}
                        className="btn bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3 text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 active:scale-95"
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>ACCEPT ORDER</span>
                      </button>

                      <button
                        onClick={() => handleUpdateStatus(order.id, 'CANCELLED')}
                        disabled={actionLoadingId === order.id}
                        className="btn bg-red-950/90 border border-red-500/50 hover:bg-red-900 text-red-300 font-bold py-3 text-xs flex items-center justify-center gap-1"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>REJECT</span>
                      </button>
                    </div>
                  )}

                  {isAccepted && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'COMPLETED')}
                      disabled={actionLoadingId === order.id}
                      className="btn btn-primary py-3 text-sm font-bold flex items-center justify-center gap-2 shadow-xl shadow-[#d4af37]/30"
                    >
                      <ChefHat className="w-4 h-4 text-black" />
                      <span>MARK ORDER READY & DELIVERED</span>
                    </button>
                  )}

                  {(isCompleted || isCancelled) && (
                    <div className="text-center py-1 text-xs text-[#b3a894] font-medium italic">
                      Order terminal state: <span className="text-[#f7f4ef] font-bold">{order.status}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
