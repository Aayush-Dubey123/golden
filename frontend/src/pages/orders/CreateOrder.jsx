import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { orderApi } from '../../api/orderApi';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'sonner';
import { 
  ShoppingBag, 
  ArrowLeft, 
  CheckCircle2, 
  Plus, 
  Minus, 
  Trash2, 
  MapPin, 
  Phone, 
  Truck, 
  CreditCard,
  ChefHat,
  Sparkles
} from 'lucide-react';

const CreateOrder = () => {
  const { items, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('COD');

  React.useEffect(() => {
    if (user?.user_role === 'SUPERADMIN' || user?.user_role === 'ADMIN') {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      food_item: items.length > 0 ? items.map(i => `${i.name} (x${i.quantity})`).join(', ') : 'Amritsari Chole Kulcha',
      food_type: 'VEG',
      quantity: items.length > 0 ? items.reduce((acc, i) => acc + i.quantity, 0) : 1,
      delivery_address: user?.address?.[0]?.address_line_1 || 'Main Street, City Center',
      contact_phone: user?.mobile_number || '',
      notes: ''
    }
  });

  const onSubmit = async (data) => {
    setIsPlacingOrder(true);
    try {
      let createdOrders = [];
      if (items.length > 0) {
        // Place an order record for each cart item
        for (const item of items) {
          const res = await orderApi.createOrder({
            food_item: item.name,
            food_type: item.type || 'VEG',
            quantity: parseInt(item.quantity, 10),
            price: item.price ? parseFloat(item.price) : 160
          });
          if (res?.data) createdOrders.push(res.data);
        }
        clearCart();
      } else {
        const res = await orderApi.createOrder({
          food_item: data.food_item,
          food_type: data.food_type,
          quantity: parseInt(data.quantity, 10),
          price: 160
        });
        if (res?.data) createdOrders.push(res.data);
      }

      const firstOrderId = createdOrders[0]?.id || createdOrders[0]?._id;
      setOrderSuccess(firstOrderId || 'SUCCESS');
      toast.success('🎉 Order placed successfully with Golden Kulcha!');

      // Smooth delay before navigating to order summary
      setTimeout(() => {
        if (firstOrderId) {
          navigate(`/orders/${firstOrderId}`);
        } else {
          navigate('/orders');
        }
      }, 1800);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to place order. Please try again.');
      setIsPlacingOrder(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center animate-page-entry">
        <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#d4af37] via-[#f2d06b] to-[#d4af37] p-1 shadow-2xl shadow-[#d4af37]/40">
          <div className="flex h-full w-full items-center justify-center rounded-full bg-black">
            <CheckCircle2 className="h-12 w-12 text-[#f2d06b] animate-bounce" />
          </div>
        </div>
        <h2 className="text-3xl font-bold font-serif text-[#f2d06b] mb-2">Order Confirmed!</h2>
        <p className="text-base text-[#f7f4ef]/90 max-w-md">
          Thank you, <span className="text-[#f2d06b] font-semibold">{user?.first_name || 'Valued Customer'}</span>! Your fresh, golden kulcha order is being prepared by our chefs.
        </p>
        <div className="mt-6 flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-[#d4af37]/10 px-5 py-2 text-xs font-semibold text-[#f2d06b]">
          <ChefHat className="h-4 w-4" />
          <span>Redirecting to Order Tracking...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl py-4 px-2 sm:px-4">
      {/* Navigation & Stepper Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center text-sm font-semibold text-[#b3a894] hover:text-[#f2d06b] transition-colors"
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to Menu
        </button>

        {/* 3-Step Checkout Stepper */}
        <div className="flex items-center gap-2 sm:gap-3 bg-[#0e0e0e] border border-[#d4af37]/30 px-4 py-2 rounded-full text-xs font-semibold">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>1. Select Menu</span>
          </div>
          <span className="text-[#d4af37]/40">→</span>
          <div className="flex items-center gap-1.5 text-[#f2d06b] font-bold">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#f2d06b] text-black text-[10px]">2</span>
            <span>2. Checkout</span>
          </div>
          <span className="text-[#d4af37]/40">→</span>
          <div className="flex items-center gap-1.5 text-[#b3a894]/60">
            <span className="flex h-4 w-4 items-center justify-center rounded-full border border-[#b3a894]/40 text-[10px]">3</span>
            <span>3. Enjoy</span>
          </div>
        </div>
      </div>

      {/* Main Checkout Card */}
      <div className="card border-[#d4af37]/35 bg-[#0a0a0a]/90 backdrop-blur-md p-6 sm:p-8 shadow-2xl">
        {/* Title Banner */}
        <div className="mb-8 flex items-center justify-between border-b border-[#d4af37]/25 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#d4af37]/30 to-[#f2d06b]/10 border border-[#d4af37]/40 text-[#f2d06b] shadow-inner">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-serif text-[#f2d06b]">Review & Complete Order</h1>
              <p className="text-xs text-[#b3a894] mt-0.5">Confirm your items and delivery destination</p>
            </div>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30 px-3 py-1 text-xs font-medium text-[#f2d06b]">
            <Sparkles className="w-3.5 h-3.5" /> Express Kitchen
          </span>
        </div>

        {/* Selected Items Breakdown */}
        {items.length > 0 ? (
          <div className="mb-8 rounded-2xl border border-[#d4af37]/30 bg-[#121212]/90 p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#d4af37]/20">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#f2d06b]">Selected Kulcha Items</h2>
              <Link to="/" className="text-xs text-[#f2d06b] hover:underline font-semibold flex items-center gap-1">
                + Add More Items
              </Link>
            </div>

            <div className="divide-y divide-[#d4af37]/15 mb-4">
              {items.map((item) => (
                <div key={item.id} className="py-3.5 flex items-center justify-between text-sm">
                  <div>
                    <p className="font-serif font-bold text-[#f7f4ef]">{item.name}</p>
                    <p className="text-xs text-[#b3a894]">₹{item.price} per item</p>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 bg-black/70 border border-[#d4af37]/30 rounded-xl px-2.5 py-1">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="text-[#f2d06b] hover:text-white transition-colors p-0.5"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-bold text-[#f7f4ef] px-1">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="text-[#f2d06b] hover:text-white transition-colors p-0.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="font-bold text-[#f2d06b] text-base w-16 text-right">
                      ₹{item.price * item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-400/80 hover:text-red-400 transition-colors p-1"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#d4af37]/25 font-bold text-base">
              <span className="text-[#f7f4ef]">Total Amount Payable:</span>
              <span className="text-2xl font-serif text-[#f2d06b]">₹{totalPrice}</span>
            </div>
          </div>
        ) : (
          <div className="mb-8 rounded-2xl border border-[#d4af37]/25 bg-[#121212] p-5 text-center">
            <p className="text-sm text-[#b3a894]">Your cart is currently empty. You can specify a custom order below or return to the menu.</p>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="mt-3 btn btn-outline text-xs py-1.5"
            >
              Browse Full Menu
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {items.length === 0 && (
            <div className="space-y-4 rounded-xl border border-[#d4af37]/20 bg-black/50 p-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#f7f4ef]">
                  Food Item
                </label>
                <input
                  type="text"
                  {...register('food_item', { required: 'Food item name is required' })}
                  className={`input ${errors.food_item ? 'border-red-500' : ''}`}
                  placeholder="e.g., Amritsari Chole Kulcha"
                />
                {errors.food_item && <p className="mt-1 text-xs text-red-400">{errors.food_item.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#f7f4ef]">
                    Dietary Preference
                  </label>
                  <select {...register('food_type')} className="input">
                    <option value="VEG">Vegetarian (VEG)</option>
                    <option value="NON_VEG">Non-Vegetarian (NON-VEG)</option>
                  </select>
                </div>
                
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#f7f4ef]">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    {...register('quantity', { 
                      required: 'Quantity is required',
                      min: { value: 1, message: 'Minimum 1' }
                    })}
                    className={`input ${errors.quantity ? 'border-red-500' : ''}`}
                  />
                  {errors.quantity && <p className="mt-1 text-xs text-red-400">{errors.quantity.message}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Delivery Information Section */}
          <div className="space-y-4 pt-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#f2d06b] flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#d4af37]" /> Delivery & Contact Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#f7f4ef] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#d4af37]" /> Delivery Address
                </label>
                <input
                  type="text"
                  {...register('delivery_address', { required: 'Address is required' })}
                  className={`input ${errors.delivery_address ? 'border-red-500' : ''}`}
                  placeholder="Enter full street address"
                />
                {errors.delivery_address && <p className="mt-1 text-xs text-red-400">{errors.delivery_address.message}</p>}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#f7f4ef] flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-[#d4af37]" /> Contact Mobile Number
                </label>
                <input
                  type="text"
                  {...register('contact_phone', { required: 'Contact phone is required' })}
                  className={`input ${errors.contact_phone ? 'border-red-500' : ''}`}
                  placeholder="+91 9876543210"
                />
                {errors.contact_phone && <p className="mt-1 text-xs text-red-400">{errors.contact_phone.message}</p>}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#f7f4ef]">
                Special Instructions (Optional)
              </label>
              <input
                type="text"
                {...register('notes')}
                className="input"
                placeholder="e.g., Extra butter, spicy chole, ring doorbell"
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="pt-2">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#f2d06b] flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#d4af37]" /> Select Payment Method
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('COD')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  paymentMethod === 'COD'
                    ? 'border-[#f2d06b] bg-[#d4af37]/20 text-[#f7f4ef] shadow-md shadow-[#d4af37]/10'
                    : 'border-[#d4af37]/25 bg-black/40 text-[#b3a894] hover:bg-black/80'
                }`}
              >
                <p className="font-bold text-sm text-[#f2d06b]">💵 Cash on Delivery</p>
                <p className="text-xs text-[#b3a894] mt-0.5">Pay upon hot food arrival</p>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  paymentMethod === 'UPI'
                    ? 'border-[#f2d06b] bg-[#d4af37]/20 text-[#f7f4ef] shadow-md shadow-[#d4af37]/10'
                    : 'border-[#d4af37]/25 bg-black/40 text-[#b3a894] hover:bg-black/80'
                }`}
              >
                <p className="font-bold text-sm text-[#f2d06b]">📱 UPI / Online Pay</p>
                <p className="text-xs text-[#b3a894] mt-0.5">GPay, PhonePe, Paytm on delivery</p>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#d4af37]/25">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn btn-outline w-full sm:w-auto"
            >
              Cancel & Return
            </button>

            <button
              type="submit"
              disabled={isPlacingOrder || (items.length === 0 && !items)}
              className="btn btn-primary w-full sm:w-auto py-3.5 px-8 text-black font-bold text-base flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-xl shadow-[#d4af37]/30"
            >
              {isPlacingOrder ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent" />
                  <span>Placing Order...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 text-black" />
                  <span>Confirm & Place Order ({items.length > 0 ? `₹${totalPrice}` : 'Submit'})</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateOrder;
