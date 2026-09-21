import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../hooks/useAuth';
import { ShoppingBag, Star, Plus, Minus, Trash2, X, MessageSquare, LogIn, User, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const MENU_ITEMS = [
  {
    id: 'amritsari-kulcha',
    name: 'Amritsari Chole Kulcha',
    type: 'VEG',
    category: 'Classic',
    price: 120,
    description: 'Crispy tandoori kulcha stuffed with spiced potatoes & onions, served with authentic spicy chole & tangy chutney.',
    image: 'IMAGE/gold.jpeg'
  },
  {
    id: 'paneer-special-kulcha',
    name: 'Paneer Special Kulcha',
    type: 'VEG',
    category: 'Special',
    price: 160,
    description: 'Rich stuffed paneer kulcha brushed with fresh desi ghee, served with slow-cooked chole & pickled onions.',
    image: 'IMAGE/gold.jpeg'
  },
  {
    id: 'cheese-burst-kulcha',
    name: 'Cheese Burst Kulcha',
    type: 'VEG',
    category: 'Special',
    price: 180,
    description: 'Loaded with molten mozzarella & cottage cheese stuffing, cooked golden in tandoor.',
    image: 'IMAGE/gold.jpeg'
  },
  {
    id: 'butter-garlic-kulcha',
    name: 'Butter Garlic Kulcha',
    type: 'VEG',
    category: 'Classic',
    price: 140,
    description: 'Infused with roasted garlic, fresh cilantro & creamery butter, served with signature chole.',
    image: 'IMAGE/gold.jpeg'
  },
  {
    id: 'sweet-lassi',
    name: 'Special Kulhad Lassi',
    type: 'VEG',
    category: 'Sides & Drinks',
    price: 60,
    description: 'Thick, creamy sweet lassi served in traditional earthenware with thick rabri malai top layer.',
    image: 'IMAGE/gold.jpeg'
  },
  {
    id: 'extra-chole',
    name: 'Extra Signature Chole',
    type: 'VEG',
    category: 'Sides & Drinks',
    price: 50,
    description: 'Extra portion of our famous Punjabi style spiced chickpeas cooked with aromatic secret spices.',
    image: 'IMAGE/gold.jpeg'
  }
];

const REVIEWS = [
  {
    name: "Arjun Singh ★ ★ ★ ★ ★",
    text: "One of the best place for chola kulcha! It's must to try, chefs hospitality and passion makes his chola kulcha so delightful and wonderful taste."
  },
  {
    name: "RAHUL KHADSE ★ ★ ★ ★ ★",
    text: "GREAT TASTE!! KEEP UP..!! COMPLIMENTARY CHOLE IS AWESOME "
  },
  {
    name: "Srushti Borkar ★ ★ ★ ★ ★",
    text: "Taste is very good very nicee 🥺"
  }
];

const GoldenLandingPage = () => {
  const { items, addToCart, removeFromCart, updateQuantity, totalPrice, totalCount } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [userRating, setUserRating] = useState(5);

  // Review Bubble State
  const [reviewIndex, setReviewIndex] = useState(0);
  const [showReviewBubble, setShowReviewBubble] = useState(true);

  useEffect(() => {
    if (isAuthenticated && (user?.user_role === 'SUPERADMIN' || user?.user_role === 'ADMIN')) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowReviewBubble(false);
      setTimeout(() => {
        setReviewIndex((prev) => (prev + 1) % REVIEWS.length);
        setShowReviewBubble(true);
      }, 1500);
    }, 4300);
    return () => clearInterval(interval);
  }, []);

  const handleCheckoutClick = () => {
    if (items.length === 0) {
      toast.error('Your cart is empty. Select items to order!');
      return;
    }
    if (isAuthenticated) {
      navigate('/create-order');
    } else {
      toast.info('Please sign in or register to complete your order.');
      navigate('/login?redirect=/create-order');
    }
  };

  const handleSendFeedback = () => {
    const starsStr = "★".repeat(userRating);
    const message = encodeURIComponent(`Golden Kulcha Feedback (${starsStr})\nMessage: ${feedbackText.trim() || 'Great food!'}`);
    window.open(`https://wa.me/8459299447?text=${message}`, '_blank');
  };

  const categories = ['All', 'Classic', 'Special', 'Sides & Drinks'];
  const filteredMenu = activeCategory === 'All' 
    ? MENU_ITEMS 
    : MENU_ITEMS.filter(item => item.category === activeCategory);

  return (
    <div className="relative min-h-screen bg-black text-[#f7f4ef] font-sans overflow-x-hidden">
      {/* Background Texture & Overlay */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40 pointer-events-none" 
        style={{ backgroundImage: `url('IMAGE/BACK.jpeg')` }}
      />
      <div className="fixed inset-0 z-0 bg-[#0b0b0b]/85 pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Navigation Bar */}
        <header className="sticky top-0 z-40 bg-[#0b0b0b]/90 backdrop-blur-md border-b border-[#d4af37]/30 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold font-serif tracking-wide text-[#f2d06b]">
              Golden Kulcha
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* View Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#d4af37] via-[#f2d06b] to-[#d4af37] text-black font-semibold text-sm hover:scale-105 transition-transform shadow-lg shadow-[#d4af37]/20"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Cart ({totalCount})</span>
              {totalCount > 0 && (
                <span className="ml-1 px-2 py-0.5 rounded-full bg-black text-[#f2d06b] text-xs font-bold">
                  ₹{totalPrice}
                </span>
              )}
            </button>

            {/* User Auth Info */}
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/dashboard"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#d4af37]/30 bg-black/50 text-xs font-semibold text-[#f2d06b] hover:bg-[#d4af37]/20 transition-all"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/orders"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#d4af37]/30 bg-black/50 text-xs font-semibold text-[#f7f4ef] hover:bg-[#d4af37]/20 transition-all"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>My Orders</span>
                </Link>
                <button
                  onClick={logout}
                  className="text-xs text-red-400 hover:text-red-300 border border-red-500/30 px-2.5 py-1.5 rounded-xl bg-red-950/30 hover:bg-red-950/60 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border border-[#d4af37]/40 rounded-full text-[#f2d06b] hover:bg-[#d4af37]/10 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </header>

        {/* Hero Section */}
        <section className="text-center pt-10 pb-8 px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-serif font-bold text-[#f2d06b] tracking-tight mb-3">
            Golden Kulcha
          </h1>
          <p className="text-base sm:text-lg text-[#f3eddc]/90 max-w-2xl mx-auto leading-relaxed">
            Minimal. Golden. Freshly baked. Follow us, find us, and leave a quick note.
          </p>
        </section>

        {/* Action Cards Grid */}
        <section className="px-4 sm:px-8 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {/* Review Us */}
          <div className="bg-[#0a0a0a]/70 border border-[#d4af37]/25 backdrop-blur-md rounded-2xl p-6 shadow-xl flex flex-col justify-between hover:border-[#d4af37]/50 transition-colors">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#f2d06b] mb-2">Review Us ⭐</h2>
              <p className="text-sm text-[#efe8d6] mb-6">Find us fast. Warm kulchas await.</p>
            </div>
            <a
              href="https://g.page/r/CWx13L0xz2NREBM/review"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full font-semibold text-sm text-black bg-gradient-to-r from-[#d4af37] via-[#f2d06b] to-[#d4af37] hover:scale-102 transition-transform shadow-md"
            >
              Open Google
            </a>
          </div>

          {/* Follow Instagram */}
          <div className="bg-[#0a0a0a]/70 border border-[#d4af37]/25 backdrop-blur-md rounded-2xl p-6 shadow-xl flex flex-col justify-between hover:border-[#d4af37]/50 transition-colors">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#f2d06b] mb-2">Follow Us On Instagram 📸</h2>
              <p className="text-sm text-[#efe8d6] mb-6">New drops, stories, and golden moments.</p>
            </div>
            <a
              href="https://www.instagram.com/golden_kulchaco?igsh=cXY4YjQyN2Zscm53"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full font-semibold text-sm text-black bg-gradient-to-r from-[#d4af37] via-[#f2d06b] to-[#d4af37] hover:scale-102 transition-transform shadow-md"
            >
              Visit Instagram
            </a>
          </div>

          {/* Suggestions WhatsApp */}
          <div className="bg-[#0a0a0a]/70 border border-[#d4af37]/25 backdrop-blur-md rounded-2xl p-6 shadow-xl flex flex-col justify-between hover:border-[#d4af37]/50 transition-colors">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#f2d06b] mb-2">Any Suggestions? 💬</h2>
              <p className="text-sm text-[#efe8d6] mb-4">Got ideas to make us better? Unlock The Feedback Section</p>
            </div>
            <div>
              <button
                onClick={() => setFeedbackOpen(!feedbackOpen)}
                className="w-full px-4 py-2.5 rounded-xl font-semibold text-sm text-black bg-gradient-to-r from-[#d4af37] via-[#f2d06b] to-[#d4af37] hover:scale-102 transition-transform"
              >
                {feedbackOpen ? '✖ Close Feedback' : '💡 Click to Open'}
              </button>
              {feedbackOpen && (
                <div className="mt-4 space-y-3">
                  <div className="flex gap-1 justify-center text-xl text-[#f2d06b]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setUserRating(star)}
                        className={`hover:scale-110 transition-transform ${star <= userRating ? 'text-[#f2d06b]' : 'text-[#d4af37]/30'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Drop your suggestions on WhatsApp. We are happy to serve you."
                    className="w-full h-20 p-3 rounded-lg border border-[#d4af37]/40 bg-black/60 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#f2d06b]"
                  />
                  <button
                    onClick={handleSendFeedback}
                    className="w-full py-2 rounded-lg bg-[#d4af37] text-black font-semibold text-xs uppercase tracking-wider hover:bg-[#f2d06b]"
                  >
                    Send on WhatsApp
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Ordering Menu Section */}
        <section className="px-4 sm:px-8 max-w-6xl mx-auto w-full mb-16">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 border-b border-[#d4af37]/20 pb-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#f2d06b]">
                Freshly Baked Menu
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">
                Select products & order directly online
              </p>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                    activeCategory === cat
                      ? 'bg-[#f2d06b] text-black shadow-md shadow-[#d4af37]/30'
                      : 'bg-[#0a0a0a]/80 text-[#f3eddc] border border-[#d4af37]/30 hover:border-[#f2d06b]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMenu.map((product) => {
              const inCartItem = items.find(i => i.id === product.id);
              const qtyInCart = inCartItem ? inCartItem.quantity : 0;

              return (
                <div
                  key={product.id}
                  className="bg-[#0a0a0a]/75 border border-[#d4af37]/30 backdrop-blur-md rounded-2xl p-5 flex flex-col justify-between hover:border-[#f2d06b] transition-all shadow-xl group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-serif text-lg font-bold text-[#f2d06b] group-hover:text-white transition-colors">
                        {product.name}
                      </h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border border-emerald-500/40 text-emerald-400 bg-emerald-950/40">
                        {product.type}
                      </span>
                    </div>
                    <p className="text-xs text-[#efe8d6]/80 leading-relaxed mb-4">
                      {product.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#d4af37]/15 flex items-center justify-between mt-auto">
                    <span className="text-xl font-bold font-serif text-[#f2d06b]">
                      ₹{product.price}
                    </span>

                    {qtyInCart > 0 ? (
                      <div className="flex items-center gap-2 bg-[#d4af37]/20 border border-[#d4af37]/50 rounded-full px-2 py-1">
                        <button
                          onClick={() => updateQuantity(product.id, qtyInCart - 1)}
                          className="w-6 h-6 rounded-full bg-black/60 flex items-center justify-center text-[#f2d06b] hover:bg-black"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-bold text-[#f2d06b] px-1">
                          {qtyInCart}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, qtyInCart + 1)}
                          className="w-6 h-6 rounded-full bg-[#f2d06b] flex items-center justify-center text-black hover:bg-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(product, 1)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-black bg-gradient-to-r from-[#d4af37] via-[#f2d06b] to-[#d4af37] hover:scale-105 transition-transform"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add to Cart</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-auto py-8 text-center border-t border-[#d4af37]/20 text-xs text-[#f3eddc]/70">
          Visit Us Again . Thank You! © Golden Kulcha
        </footer>
      </div>

      {/* Floating Animated Review Popups */}
      {showReviewBubble && (
        <div className="fixed bottom-6 right-6 max-w-xs w-full bg-[#0a0a0a]/90 backdrop-blur-md border border-[#d4af37]/50 rounded-2xl p-4 shadow-2xl z-40 transition-all duration-500 animate-bounce">
          <p className="font-bold text-xs text-[#f2d06b] mb-1">
            {REVIEWS[reviewIndex].name}
          </p>
          <p className="text-xs text-[#f3eddc] italic leading-snug">
            "{REVIEWS[reviewIndex].text}"
          </p>
        </div>
      )}

      {/* Cart Drawer Overlay */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0f0f0f] border-l border-[#d4af37]/30 text-[#f7f4ef] h-full flex flex-col p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#d4af37]/30">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#f2d06b]" />
                <h2 className="text-xl font-serif font-bold text-[#f2d06b]">Your Order Cart</h2>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30 text-[#f2d06b]" />
                  <p className="text-sm">Your cart is empty.</p>
                  <p className="text-xs text-gray-500 mt-1">Add fresh kulchas from the menu to start!</p>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-[#d4af37]/20 bg-[#141414]"
                  >
                    <div>
                      <p className="font-serif font-bold text-sm text-[#f2d06b]">{item.name}</p>
                      <p className="text-xs text-gray-400">₹{item.price} x {item.quantity}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 bg-black/60 border border-[#d4af37]/30 rounded-lg px-2 py-0.5">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="text-xs text-[#f2d06b] hover:text-white"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold px-1.5">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="text-xs text-[#f2d06b] hover:text-white"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="pt-4 border-t border-[#d4af37]/30 space-y-4">
                <div className="flex justify-between items-center text-lg font-bold font-serif">
                  <span className="text-gray-300">Total Amount:</span>
                  <span className="text-[#f2d06b]">₹{totalPrice}</span>
                </div>

                <button
                  onClick={handleCheckoutClick}
                  className="w-full py-3 rounded-full font-bold text-black bg-gradient-to-r from-[#d4af37] via-[#f2d06b] to-[#d4af37] hover:scale-102 transition-transform shadow-lg shadow-[#d4af37]/25 text-center flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Proceed to Checkout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GoldenLandingPage;
