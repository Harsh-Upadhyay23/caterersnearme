import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const CatererProfile = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [caterer, setCaterer] = useState(null);
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart, cartItems, setIsCartOpen } = useCart();

  const handleSelectMenu = (menu) => {
    if (!user) {
      navigate('/login', {
        state: {
          from: location,
          message: 'Please log in to select menus and use your cart.',
        },
      });
      return;
    }

    addToCart(menu, caterer);
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        // 1. Fetch Caterer info by slug
        const catererRes = await api.get(`/caterers/slug/${slug}`);
        if (!catererRes.data.success) throw new Error('Caterer not found');
        
        const catererData = catererRes.data.data;
        setCaterer(catererData);
        
        // SEO Updates
        document.title = `${catererData.name} - CaterersNearMe`;
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
          metaDesc = document.createElement('meta');
          metaDesc.name = 'description';
          document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', catererData.description || `Premium catering services by ${catererData.name} located in ${catererData.location}. Best food for your events.`);

        // 2. Fetch Menus using the Caterer's ID
        const menusRes = await api.get(`/menus/caterer/${catererData.id}`);
        if (menusRes.data.success) {
          setMenus(menusRes.data.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load caterer profile');
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchProfileData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center" style={{ background: '#0a0a0f' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-400"></div>
      </div>
    );
  }

  if (error || !caterer) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center text-center px-4" style={{ background: '#0a0a0f' }}>
        <svg className="w-16 h-16 text-gray-600 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <h2 className="text-3xl font-display text-white mb-2">{error || 'Caterer Not Found'}</h2>
        <p className="text-gray-400 mb-8 max-w-md">We couldn't find the caterer you're looking for. The link might be broken or the caterer may have been removed.</p>
        <Link to="/caterers" className="btn-primary px-6 py-2">Browse All Caterers</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20" style={{ background: '#0a0a0f' }}>
      
      {/* ── HEADER HERO SECTION ── */}
      <div className="relative pt-24 pb-10 sm:pt-28 sm:pb-12 px-4 sm:px-6 lg:px-8 border-b border-white/5 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-[#0a0a0f] z-0"></div>
        <div className="absolute top-0 right-0 w-[50%] h-[100%] bg-amber-500/10 mix-blend-screen blur-[120px] rounded-full pointer-events-none z-0"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row gap-6 md:gap-8 items-start justify-between">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 backdrop-blur-md rounded-full border border-white/10 mb-4 shadow-xl">
              <span className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className={`w-3.5 h-3.5 ${i < Math.floor(caterer.rating || 5) ? 'text-amber-400' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                ))}
              </span>
              <span className="text-xs font-bold text-white ml-1">{caterer.rating ? caterer.rating.toFixed(1) : '5.0'} / 5.0</span>
              <span className="text-gray-500 text-[10px] uppercase font-bold tracking-wider ml-1 pl-2 border-l border-white/20">EST. {caterer.establishedYear || '2010'}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-medium text-white tracking-tight leading-tight mb-3">
              {caterer.name}
            </h1>
            
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-400 mb-5 font-medium">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                {caterer.location} {caterer.city && `, ${caterer.city}`}
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                {caterer.phone || 'Contact Available'}
              </span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {caterer.services && caterer.services.map((svc, i) => (
                <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 text-white rounded-lg text-xs font-medium tracking-wide">
                  {svc}
                </span>
              ))}
            </div>
          </div>
          
          <div className="w-full md:w-[280px] md:shrink-0 flex flex-col">
            <div className="bg-[#111116] border border-white/10 rounded-2xl p-5 shadow-2xl backdrop-blur-xl">
              <p className="text-gray-400 text-sm mb-1 font-medium">Starting from</p>
              <div className="flex items-end gap-2 mb-5">
                <span className="text-4xl font-bold tracking-tight text-white block">₹{caterer.pricePerPlate || '450'}</span>
                <span className="text-gray-500 text-sm font-semibold mb-1">/ plate</span>
              </div>
              <button className="btn-primary w-full py-3.5 shadow-[0_0_20px_rgba(251,191,36,0.2)]">Request Quote</button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
        {/* ── LEFT COLUMN: DETAILS & GALLERY ── */}
        <div className="lg:col-span-2 space-y-8 sm:space-y-10">
          
          {/* About Section */}
          <section>
            <h3 className="text-xl sm:text-2xl font-display font-medium text-white mb-3">About {caterer.name}</h3>
            <p className="text-gray-400 leading-relaxed text-[15px]">
              {caterer.description || `${caterer.name} is one of the premier catering services located in ${caterer.location}. Since ${caterer.establishedYear || 'their establishment'}, they have been delivering exceptional culinary experiences for weddings, corporate events, and parties.`}
            </p>
          </section>

          {/* Image Gallery (Horizontal Scroll) */}
          {caterer.images && caterer.images.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl sm:text-2xl font-display font-medium text-white">Gallery Showcase</h3>
                <div className="flex gap-2">
                  <button className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <button className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>
              </div>
              
              {/* Horizontal Scroll Container */}
              <div className="flex overflow-x-auto gap-3 pb-4 snap-x snap-mandatory hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
                {caterer.images.map((img, i) => (
                  <div key={i} className="min-w-[80%] sm:min-w-[300px] max-w-[360px] h-[220px] sm:h-[260px] snap-center rounded-xl overflow-hidden shadow-xl border border-white/5 flex-shrink-0 group relative">
                    <img src={img} alt={`Showcase ${i}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Menus Section */}
          <section>
            <h3 className="text-xl sm:text-2xl font-display font-medium text-white mb-4">Available Menus</h3>
            {menus.length === 0 ? (
              <div className="p-6 bg-white/[0.02] border border-white/5 rounded-xl text-center">
                <p className="text-gray-400">Menus are currently being updated by the caterer. Please inquire directly for options.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {menus.map((menu) => (
                  <div key={menu.id} className="bg-[#111116] border border-white/5 rounded-lg p-4 group hover:border-amber-400/30 transition-colors flex flex-col relative overflow-hidden">
                    
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-amber-500/10 to-transparent pointer-events-none rounded-bl-2xl" />
                    
                    <div className="flex justify-between items-start mb-2 relative z-10">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-base font-bold text-white truncate">{menu.menuName}</h4>
                          <span className={`w-2.5 h-2.5 rounded-full ${
                            menu.type === 'Veg' ? 'bg-green-500' : 
                            menu.type === 'Non-Veg' ? 'bg-red-500' : 'bg-amber-500'
                          }`}></span>
                        </div>
                        {menu.description && <p className="text-[11px] text-gray-400 line-clamp-2">{menu.description}</p>}
                      </div>
                    </div>
                    
                    <div className="mb-3 relative z-10">
                      <span className="text-lg font-bold text-amber-400">₹{menu.price}</span>
                      <span className="text-[9px] uppercase font-semibold tracking-wider text-gray-500 ml-1">/person</span>
                    </div>

                    <div className="mt-auto relative z-10">
                      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2 border-t border-white/5 pt-3">Dishes</p>
                      <ul className="space-y-1">
                        {menu.dishes.slice(0, 3).map((dish, i) => (
                          <li key={i} className="flex items-start text-xs text-gray-400">
                            <svg className="w-3 h-3 text-amber-400/70 mr-1.5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            <span className="truncate">{dish}</span>
                          </li>
                        ))}
                        {menu.dishes.length > 3 && (
                          <li className="text-[11px] font-medium text-amber-400 pl-4">+{menu.dishes.length - 3} more</li>
                        )}
                      </ul>
                    </div>
                    
                    {cartItems.some(item => item.menuId === menu.id) ? (
                      <button
                        onClick={() => setIsCartOpen(true)}
                        className="mt-4 w-full py-2 bg-amber-400 hover:bg-amber-300 text-gray-950 text-xs font-bold rounded-lg transition-all relative z-10 flex items-center justify-center gap-1.5"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        In Cart — View
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSelectMenu(menu)}
                        className="mt-4 w-full py-2 bg-white/5 hover:bg-amber-400/10 hover:border-amber-400/40 text-white hover:text-amber-400 text-xs font-semibold rounded-lg border border-white/10 transition-all duration-200 relative z-10 flex items-center justify-center gap-1.5"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        Add to Cart
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* ── RIGHT COLUMN: INFO ── */}
        <div className="lg:col-span-1 space-y-5 lg:space-y-6 flex flex-col lg:items-stretch">
          
          <div className="bg-[#111116] border border-white/5 rounded-xl p-5">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 pb-3 border-b border-white/10">Specialized Cuisines</h4>
            <div className="flex flex-wrap gap-2">
              {caterer.cuisines && caterer.cuisines.length > 0 ? caterer.cuisines.map((cuisine, i) => (
                <span key={i} className="px-3 py-1.5 bg-amber-400/10 text-amber-400 rounded-md text-sm font-medium border border-amber-400/20">
                  {cuisine}
                </span>
              )) : (
                <span className="text-gray-400 text-sm">Multi-cuisine</span>
              )}
            </div>
          </div>

          <div className="bg-[#111116] border border-white/5 rounded-xl p-5">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 pb-3 border-b border-white/10">Service Areas</h4>
            <ul className="space-y-2">
              {caterer.areasServed && caterer.areasServed.length > 0 ? caterer.areasServed.map((area, i) => (
                <li key={i} className="flex items-center text-sm text-gray-300">
                  <svg className="w-4 h-4 text-gray-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  {area}
                </li>
              )) : (
                <li className="text-gray-400 text-sm">{caterer.city || caterer.location || 'Throughout the city'}</li>
              )}
            </ul>
          </div>
          
          <div className="bg-[#111116] border border-white/5 rounded-xl p-5 relative overflow-hidden">
             <div className="absolute -right-6 -bottom-6 opacity-20 text-white w-32 h-32">
               <svg fill="currentColor" viewBox="0 0 24 24"><path d="M21 16.42v3.536a1 1 0 0 1-.93 1.042 19.88 19.88 0 0 1-8.594-2.8 19.52 19.52 0 0 1-6.075-6.074 19.88 19.88 0 0 1-2.8-8.595A1 1 0 0 1 3.642 2.6H7.18a1 1 0 0 1 .982.804 13.04 13.04 0 0 0 .506 2.392 1 1 0 0 1-.22.956L6.5 8.7a15.42 15.42 0 0 0 8.8 8.8l1.95-1.95a1 1 0 0 1 .955-.22 13.04 13.04 0 0 0 2.392.506 1 1 0 0 1 .804.982Z"></path></svg>
             </div>
             <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 relative z-10">Direct Contact</h4>
             <p className="text-white font-medium text-base relative z-10 mb-4">{caterer.phone || 'Available upon request'}</p>
             <button className="w-full py-3 bg-white text-gray-950 font-bold rounded-xl relative z-10 flex justify-center items-center gap-2 hover:bg-gray-200 transition-colors shadow-xl">
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
               Call Now
             </button>
          </div>

        </div>
      </div>
      
      {/* Floating Cart Bar - visible when item is in cart */}
      {cartItems.length > 0 && cartItems.some(item => item.catererId === (caterer?.id || caterer?._id)) && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 animate-fade-in">
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-3 px-6 py-3.5 bg-amber-400 text-gray-950 font-bold rounded-full shadow-2xl shadow-amber-500/40 hover:bg-amber-300 transition-all hover:scale-105 active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>{cartItems.filter(item => item.catererId === (caterer?.id || caterer?._id)).length} Menu(s) Selected · View Cart</span>
          </button>
        </div>
      )}

      {/* Hide Scrollbar Style Inject */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};

export default CatererProfile;
