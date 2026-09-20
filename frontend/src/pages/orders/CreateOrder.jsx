import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { orderApi } from '../../api/orderApi';
import { useCart } from '../../context/CartContext';
import { toast } from 'sonner';
import { ShoppingBag, ArrowLeft, CheckCircle2 } from 'lucide-react';

const CreateOrder = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      food_item: items.length > 0 ? items.map(i => `${i.name} (x${i.quantity})`).join(', ') : 'Amritsari Chole Kulcha',
      food_type: 'VEG',
      quantity: items.length > 0 ? items.reduce((acc, i) => acc + i.quantity, 0) : 1
    }
  });

  const onSubmit = async (data) => {
    setIsPlacingOrder(true);
    try {
      if (items.length > 0) {
        // Place an order record for each cart item or combined order
        for (const item of items) {
          await orderApi.createOrder({
            food_item: item.name,
            food_type: item.type || 'VEG',
            quantity: parseInt(item.quantity, 10),
          });
        }
        clearCart();
      } else {
        await orderApi.createOrder({
          food_item: data.food_item,
          food_type: data.food_type,
          quantity: parseInt(data.quantity, 10),
        });
      }

      toast.success('Order placed successfully with Golden Kulcha!');
      navigate('/orders');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to place order');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl py-6 px-4">
      <button 
        onClick={() => navigate('/')}
        className="mb-6 flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="mr-1 h-4 w-4" /> Back to Menu
      </button>

      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#d4af37]/20 text-[#d4af37]">
          <ShoppingBag className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-serif">Checkout & Place Order</h1>
          <p className="text-sm text-slate-500">Confirm your delicious Golden Kulcha selection</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100">
        {/* Selected Cart Items Summary */}
        {items.length > 0 ? (
          <div className="mb-6 rounded-xl bg-slate-50 p-4 border border-slate-200">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-3">Order Summary</h2>
            <div className="divide-y divide-slate-200 mb-4">
              {items.map((item) => (
                <div key={item.id} className="py-2.5 flex justify-between items-center text-sm">
                  <div>
                    <span className="font-semibold text-slate-900">{item.name}</span>
                    <span className="text-xs text-slate-500 ml-2">x{item.quantity}</span>
                  </div>
                  <span className="font-bold text-slate-900">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-300 font-bold text-base">
              <span>Total Payable:</span>
              <span className="text-[#d4af37] text-xl">₹{totalPrice}</span>
            </div>
          </div>
        ) : null}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {items.length === 0 && (
            <>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Food Item</label>
                <input
                  type="text"
                  {...register('food_item', { required: 'Food item is required' })}
                  className={`input ${errors.food_item ? 'border-red-500' : ''}`}
                  placeholder="e.g., Amritsari Chole Kulcha"
                />
                {errors.food_item && <p className="mt-1 text-sm text-red-500">{errors.food_item.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Food Type</label>
                  <select {...register('food_type')} className="input">
                    <option value="VEG">Vegetarian</option>
                    <option value="NON_VEG">Non-Vegetarian</option>
                  </select>
                </div>
                
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    {...register('quantity', { 
                      required: 'Quantity is required',
                      min: { value: 1, message: 'Minimum 1' }
                    })}
                    className={`input ${errors.quantity ? 'border-red-500' : ''}`}
                  />
                  {errors.quantity && <p className="mt-1 text-sm text-red-500">{errors.quantity.message}</p>}
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPlacingOrder}
              className="btn btn-primary bg-gradient-to-r from-[#d4af37] via-[#f2d06b] to-[#d4af37] text-black border-none font-bold py-2.5 px-6 flex items-center gap-2 hover:scale-102 transition-transform"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>{isPlacingOrder ? 'Confirming Order...' : 'Confirm & Place Order'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateOrder;
