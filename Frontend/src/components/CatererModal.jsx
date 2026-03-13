import PropTypes from 'prop-types';
import { useEffect } from 'react';

const StarRating = ({ rating }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((s) => (
      <svg key={s} viewBox="0 0 16 16" className={`w-4 h-4 ${s <= Math.round(rating) ? 'text-amber-400' : 'text-gray-700'}`} fill="currentColor">
        <path d="M8 1.139l1.545 3.13 3.455.502-2.5 2.437.59 3.442L8 8.938l-3.09 1.624.59-3.441L3 4.771l3.455-.502z" />
      </svg>
    ))}
    <span className="text-sm font-semibold text-amber-400 ml-1">{rating.toFixed(1)}</span>
    <span className="text-xs text-gray-500">/ 5.0</span>
  </div>
);

const CatererModal = ({ caterer, onClose }) => {
  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const { name, location, pricePerPlate, cuisines, rating } = caterer;

  const colors = [
    'from-amber-500 to-orange-600', 'from-violet-500 to-purple-700',
    'from-emerald-500 to-teal-700', 'from-rose-500 to-pink-700', 'from-sky-500 to-blue-700',
  ];
  const colorClass = colors[name.charCodeAt(0) % colors.length];

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 animate-fade-in"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Modal panel */}
      <div className="w-full max-w-md rounded-2xl overflow-hidden animate-slide-up shadow-2xl" style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.08)' }}>

        {/* Top Image banner instead of a simple gradient bar */}
        <div className="relative h-40 w-full overflow-hidden bg-gray-900">
          <img src={caterer.image} alt={name} className="w-full h-full object-cover opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111118] to-transparent" />
        </div>

        {/* Header */}
        <div className="px-6 pt-2 pb-5 flex items-start gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-display font-bold text-white leading-tight">{name}</h2>
            <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1.5 font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 text-amber-500">
                <path fillRule="evenodd" d="M8 1a5.5 5.5 0 00-5.5 5.5c0 3.15 2.4 5.817 4.73 7.538a1.25 1.25 0 001.54 0C11.1 12.317 13.5 9.65 13.5 6.5A5.5 5.5 0 008 1zm0 7a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" clipRule="evenodd" />
              </svg>
              {location}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-600 hover:text-gray-300 hover:bg-white/5 transition-all flex-shrink-0"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>

        {/* Divider */}
        <div className="mx-6 h-px bg-white/[0.06]" />

        {/* Body */}
        <div className="px-6 py-5 space-y-5">

          {/* Rating */}
          <div>
            <p className="section-label mb-2">Rating</p>
            <StarRating rating={rating} />
          </div>

          {/* Pricing */}
          <div>
            <p className="section-label mb-2">Pricing</p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-amber-400">₹{pricePerPlate.toLocaleString('en-IN')}</span>
              <span className="text-sm text-gray-500">per plate</span>
            </div>
          </div>

          {/* Cuisines */}
          <div>
            <p className="section-label mb-2.5">Cuisines Offered</p>
            <div className="flex flex-wrap gap-2">
              {cuisines.map((c) => (
                <span key={c} className="badge">{c}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg text-sm font-medium border border-white/[0.08] text-gray-400 hover:text-white hover:bg-white/5 transition-all"
          >
            Close
          </button>
          <button className="flex-1 btn-primary justify-center">
            Request a Quote
          </button>
        </div>

      </div>
    </div>
  );
};

CatererModal.propTypes = {
  caterer: PropTypes.shape({
    name: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    pricePerPlate: PropTypes.number.isRequired,
    cuisines: PropTypes.arrayOf(PropTypes.string).isRequired,
    rating: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CatererModal;
