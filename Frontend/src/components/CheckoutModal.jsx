import { useState } from 'react';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import Loader from './Loader';

const CheckoutModal = ({ onClose }) => {
  const { cartItems, guestCount, totalPrice, clearCart } = useCart();
  const [form, setForm] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    eventDate: '',
    eventLocation: '',
    specialInstructions: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await Promise.all(cartItems.map(item => 
        api.post('/orders', {
          ...form,
          guestCount,
          catererId: item.catererId,
          catererName: item.catererName,
          menuId: item.menuId,
          menuName: item.menuName,
          pricePerPerson: item.pricePerPerson,
        })
      ));
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div className="bg-white border border-green-500/30 rounded-2xl p-10 max-w-md w-full text-center shadow-2xl">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 text-gray-900 mb-3">Order Placed! 🎉</h2>
          <p className="text-gray-600 text-sm mb-2">Your orders have been sent to the respective caterers.</p>
          <p className="text-gray-600 text-sm mb-8">They will contact you on your provided phone number to confirm the booking.</p>
          <button
            onClick={() => { clearCart(); onClose(); }}
            className="btn-primary px-8 py-3 w-full"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-white bg-white border border-gray-200 border-gray-200 rounded-t-3xl md:rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 border-gray-200 sticky top-0 bg-white bg-white z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900 text-gray-900">Complete Your Booking</h2>
            <p className="text-xs text-gray-500 mt-0.5">Fill in your event details</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-500">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-6">
          {/* Order Summary */}
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-5 mb-8">
            <p className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-3">Order Summary</p>
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-4">
                {cartItems.map((item, idx) => (
                  <div key={idx}>
                    <p className="font-bold text-gray-900 text-gray-900">{item.menuName}</p>
                    <p className="text-sm text-gray-500">{item.catererName}</p>
                    <p className="text-sm text-gray-500 mt-1">{guestCount} guests × ₹{item.pricePerPerson}/person</p>
                  </div>
                ))}
              </div>
              <div className="text-right shrink-0">
                <p className="text-2xl font-bold text-amber-400">₹{totalPrice.toLocaleString('en-IN')}</p>
                <p className="text-xs text-gray-500">Total</p>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-5 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Full Name *</label>
                <input
                  type="text" name="customerName" required value={form.customerName}
                  onChange={handleChange} placeholder="Your full name"
                  className="w-full bg-white/[0.04] border border-white/10 text-white px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-amber-400 focus:bg-white/[0.06] transition placeholder-gray-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Phone Number *</label>
                <input
                  type="tel" name="customerPhone" required value={form.customerPhone}
                  onChange={handleChange} placeholder="e.g. 98765 43210"
                  className="w-full bg-white/[0.04] border border-white/10 text-white px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-amber-400 focus:bg-white/[0.06] transition placeholder-gray-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Email Address</label>
              <input
                type="email" name="customerEmail" value={form.customerEmail}
                onChange={handleChange} placeholder="your@email.com (optional)"
                className="w-full bg-white/[0.04] border border-white/10 text-white px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-amber-400 focus:bg-white/[0.06] transition placeholder-gray-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Event Date *</label>
                <input
                  type="date" name="eventDate" required value={form.eventDate}
                  onChange={handleChange} min={new Date().toISOString().split('T')[0]}
                  className="w-full bg-white/[0.04] border border-white/10 text-white px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-amber-400 focus:bg-white/[0.06] transition [color-scheme:dark]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Number of Guests *</label>
                <input
                  type="number" name="guestCount" required value={guestCount} readOnly
                  className="w-full bg-white/[0.04] border border-white/10 text-amber-400 font-bold px-4 py-3 rounded-xl text-sm cursor-not-allowed"
                />
                <p className="text-[10px] text-gray-600 mt-1">Adjust in the cart</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Event Location / Venue *</label>
              <input
                type="text" name="eventLocation" required value={form.eventLocation}
                onChange={handleChange} placeholder="Full address of venue"
                className="w-full bg-white/[0.04] border border-white/10 text-white px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-amber-400 focus:bg-white/[0.06] transition placeholder-gray-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Special Instructions</label>
              <textarea
                name="specialInstructions" rows={3} value={form.specialInstructions}
                onChange={handleChange} placeholder="Any dietary requirements, allergies, or special requests..."
                className="w-full bg-white/[0.04] border border-white/10 text-white px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-amber-400 focus:bg-white/[0.06] transition placeholder-gray-600 resize-none"
              />
            </div>

            <button
              type="submit" disabled={submitting}
              className="btn-primary w-full py-4 text-base font-bold shadow-[0_0_20px_rgba(251,191,36,0.3)] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {submitting ? (
                <>
                  <Loader className="w-5 h-5" />
                  Placing Order...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Confirm & Place Order (₹{totalPrice.toLocaleString('en-IN')})
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
