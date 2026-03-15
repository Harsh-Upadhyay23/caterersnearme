import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CheckoutModal from './CheckoutModal';

const CartSidebar = () => {
  const { cartItems, removeCartItem, isCartOpen, setIsCartOpen, guestCount, setGuestCount, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showCheckout, setShowCheckout] = useState(false);

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop - pointer-events-none so user can add more menus while cart is open */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] pointer-events-none"
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-[420px] z-50 bg-white border-l border-gray-200 shadow-xl flex flex-col animate-slide-in-right overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-400/10 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-base font-bold text-gray-900">Your Cart</h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="w-8 h-8 rounded-full hover:bg-gray-200 text-gray-500 flex items-center justify-center"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 border border-gray-200">
                <svg className="w-9 h-9 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p className="text-gray-600 font-medium">Your cart is empty</p>
              <p className="text-gray-500 text-sm mt-1">Select a menu package from a caterer</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Selected Menu Cards */}
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.menuId} className="bg-gray-50 border border-amber-500/20 rounded-2xl p-5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/10 rounded-bl-3xl pointer-events-none" />
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-1">{item.catererName}</p>
                        <h3 className="text-lg font-bold text-gray-900">{item.menuName}</h3>
                        {item.description && <p className="text-xs text-gray-600 mt-1">{item.description}</p>}
                      </div>
                      <span className={`shrink-0 mt-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.type === 'Veg' ? 'bg-green-500/10 text-green-400' :
                        item.type === 'Non-Veg' ? 'bg-red-500/10 text-red-400' :
                        'bg-amber-500/10 text-amber-400'
                      }`}>{item.type}</span>
                    </div>

                    {/* Dishes Preview */}
                    {item.dishes && item.dishes.length > 0 && (
                      <div className="mb-4">
                        <p className="text-[10px] font-bold text-gray-600 uppercase tracking-wide mb-2">Includes</p>
                        <div className="flex flex-wrap gap-1">
                          {item.dishes.slice(0, 6).map((d, i) => (
                            <span key={i} className="text-[11px] text-gray-600 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded">{d}</span>
                          ))}
                          {item.dishes.length > 6 && (
                            <span className="text-[11px] text-amber-500 font-semibold">+{item.dishes.length - 6} more</span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                      <p className="text-sm text-gray-600">₹{item.pricePerPerson.toLocaleString('en-IN')}<span className="text-xs text-gray-500">/person</span></p>
                      <button onClick={() => removeCartItem(item.menuId)} className="text-xs text-red-400 hover:text-red-300 transition-colors flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Guest Count */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Number of Guests</label>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setGuestCount(g => Math.max(10, g - 10))}
                    className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-amber-500/10 border border-gray-200 hover:border-amber-500/30 text-gray-900 flex items-center justify-center text-lg font-bold transition-all"
                  >−</button>
                  <div className="text-center">
                    <span className="text-4xl font-bold text-gray-900">{guestCount}</span>
                    <p className="text-xs text-gray-500 mt-1">guests</p>
                  </div>
                  <button
                    onClick={() => setGuestCount(g => g + 10)}
                    className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-amber-500/10 border border-gray-200 hover:border-amber-500/30 text-gray-900 flex items-center justify-center text-lg font-bold transition-all"
                  >+</button>
                </div>
                <input
                  type="range" min={10} max={2000} step={10}
                  value={guestCount}
                  onChange={e => setGuestCount(parseInt(e.target.value))}
                  className="w-full mt-4 accent-amber-400"
                />
              </div>

              {/* Price Breakdown */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-3">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Price Breakdown</p>
                <div className="flex justify-between text-sm text-gray-600">
                  <div className="flex flex-col gap-1">
                    {cartItems.map((item, idx) => (
                      <span key={idx}>₹{item.pricePerPerson} × {guestCount} guests ({item.menuName})</span>
                    ))}
                  </div>
                  <span className="text-gray-900">₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-amber-600">₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer CTA */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => {
                if (!user) {
                  navigate('/login', {
                    state: {
                      from: location,
                      message: 'Please log in to proceed to checkout and confirm your booking.',
                    },
                  });
                  return;
                }
                setShowCheckout(true);
              }}
              className="btn-primary w-full py-4 text-sm font-bold shadow-[0_0_20px_rgba(251,191,36,0.2)] flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Proceed to Checkout
            </button>
            <p className="text-center text-[11px] text-gray-600 mt-3">No payment required now. Caterer will confirm your booking.</p>
          </div>
        )}
      </div>

      {showCheckout && <CheckoutModal onClose={() => setShowCheckout(false)} />}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slide-in-right {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in-right { animation: slide-in-right 0.3s cubic-bezier(0.16, 1, 0.3, 1) both; }
      ` }} />
    </>
  );
};

export default CartSidebar;
