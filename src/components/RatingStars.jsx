import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { orderApi } from '../api/orderApi';
import { toast } from 'sonner';

const RatingStars = ({ orderId, onRated }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    
    setSubmitting(true);
    try {
      const payload = { rating, review: review || null };
      await orderApi.rateOrder(orderId, payload);
      toast.success('Order rated successfully!');
      onRated();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to submit rating');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-[#d4af37]/30 bg-[#141414] p-6 shadow-xl">
      <h3 className="mb-4 text-lg font-bold font-serif text-[#f2d06b]">Rate this Order</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6 flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              className={`transition-all hover:scale-110 ${
                star <= (hover || rating) ? 'text-[#f2d06b]' : 'text-gray-700'
              }`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(rating)}
            >
              <Star className={`h-8 w-8 ${star <= (hover || rating) ? 'fill-current' : ''}`} />
            </button>
          ))}
        </div>

        <div className="mb-4">
          <label className="mb-1.5 block text-sm font-medium text-[#f7f4ef]">Review (Optional)</label>
          <textarea
            rows={3}
            className="input py-2 h-auto resize-none"
            placeholder="Tell us about your experience..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={submitting || rating === 0}
          className="btn btn-primary"
        >
          {submitting ? 'Submitting...' : 'Submit Rating'}
        </button>
      </form>
    </div>
  );
};

export default RatingStars;
