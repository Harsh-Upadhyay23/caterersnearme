import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/Loader';

const CatererProfile = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [caterer, setCaterer] = useState(null);
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart, removeCartItem, cartItems, setIsCartOpen } = useCart();

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

    addToCart(menu, caterer, false);
  };

  const handleDeselectMenu = (menuId) => {
    removeCartItem(menuId);
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
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-gray-50">
        <Loader className="w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:h-32" />
      </div>
    );
  }

  if (error || !caterer) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center text-center px-4 bg-gray-50">
        <svg className="w-16 h-16 text-gray-400 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <h2 className="text-3xl font-display text-gray-900 mb-2">{error || 'Caterer Not Found'}</h2>
        <p className="text-gray-500 mb-8 max-w-md">We couldn't find the caterer you're looking for. The link might be broken or the caterer may have been removed.</p>
        <Link to="/caterers" className="btn-primary px-6 py-2">Browse All Caterers</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-gray-50 transition-colors">

      <div className="relative pt-24 pb-10 sm:pt-28 sm:pb-12 px-4 sm:px-6 lg:px-8 border-b border-gray-200 overflow-hidden">
        <div className="absolute inset-0 bg-gray-50 z-0"></div>
        <div className="absolute top-0 right-0 w-[50%] h-[100%] bg-amber-500/10 mix-blend-multiply blur-[120px] rounded-full pointer-events-none z-0"></div>

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row gap-6 md:gap-8 items-start justify-between">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white backdrop-blur-md rounded-full border border-gray-200 mb-4 shadow-sm">
              <span className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className={`w-3.5 h-3.5 ${i < Math.floor(caterer.rating || 5) ? 'text-amber-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                ))}
              </span>
              <span className="text-xs font-bold text-gray-900 ml-1">{caterer.rating ? caterer.rating.toFixed(1) : '5.0'} / 5.0</span>
              <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider ml-1 pl-2 border-l border-gray-200">EST. {caterer.establishedYear || '2010'}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-medium text-gray-900 tracking-tight leading-tight mb-3">
              {caterer.name}
            </h1>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500 mb-5 font-medium">
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
                <span key={i} className="px-3 py-1 bg-white border border-gray-200 text-gray-700 rounded-lg text-xs font-medium tracking-wide shadow-sm">
                  {svc}
                </span>
              ))}
            </div>
          </div>

          <div className="w-full md:w-[280px] md:shrink-0 flex flex-col">
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <p className="text-gray-500 text-sm mb-1 font-medium">Starting from</p>
              <div className="flex items-end gap-2 mb-5">
                <span className="text-4xl font-bold tracking-tight text-gray-900 block">₹{caterer.pricePerPlate || '450'}</span>
                <span className="text-gray-500 text-sm font-semibold mb-1">/ plate</span>
              </div>
              <button className="w-full py-3.5 bg-gray-900 text-white font-medium rounded-xl hover:bg-black transition-colors shadow-sm">Request Quote</button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
        {/* ── LEFT COLUMN: DETAILS & GALLERY ── */}
        <div className="lg:col-span-2 space-y-8 sm:space-y-10">

          {/* About Section */}
          <section>
            <h3 className="text-xl sm:text-2xl font-display font-medium text-gray-900 mb-3">About {caterer.name}</h3>
            <p className="text-gray-600 leading-relaxed text-[15px]">
              {caterer.description || `${caterer.name} is one of the premier catering services located in ${caterer.location}. Since ${caterer.establishedYear || 'their establishment'}, they have been delivering exceptional culinary experiences for weddings, corporate events, and parties.`}
            </p>
          </section>

          {/* Image Gallery (Horizontal Scroll) */}
          {caterer.images && caterer.images.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl sm:text-2xl font-display font-medium text-gray-900">Gallery Showcase</h3>
                <div className="flex gap-2">
                  <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors bg-white">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors bg-white">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>
              </div>

              {/* Horizontal Scroll Container */}
              <div className="flex overflow-x-auto gap-3 pb-4 snap-x snap-mandatory hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
                {caterer.images.map((img, i) => (
                  <div key={i} className="min-w-[80%] sm:min-w-[300px] max-w-[360px] h-[220px] sm:h-[260px] snap-center rounded-xl overflow-hidden shadow-sm border border-gray-200 flex-shrink-0 group relative bg-gray-100">
                    <img src={img} alt={`Showcase ${i}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Menus Section */}
          <section>
            <h3 className="text-xl sm:text-2xl font-display font-medium text-gray-900 mb-4">Available Menus</h3>
            {menus.length === 0 ? (
              <div className="p-6 bg-white border border-gray-200 rounded-xl text-center shadow-sm">
                <p className="text-gray-500 font-medium">Menus are currently being updated by the caterer. Please inquire directly for options.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {menus.map((menu) => {
                  const isSelected = cartItems.some(item => item.menuId === menu.id);
                  
                  return (
                  <div key={menu.id} className={`bg-white border rounded-xl p-4 transition-all duration-200 flex flex-col relative overflow-hidden ${isSelected ? 'border-amber-400 shadow-md ring-1 ring-amber-400' : 'border-gray-200 shadow-sm hover:border-amber-300 hover:shadow-md'}`}>

                    <div className="flex justify-between items-start mb-2 relative z-10">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1.5">
                          <h4 className="text-base font-bold text-gray-900 truncate">{menu.menuName}</h4>
                          <span className={`w-2 h-2 rounded-full ${menu.type === 'Veg' ? 'bg-green-500' :
                              menu.type === 'Non-Veg' ? 'bg-red-500' : 'bg-amber-500'
                            }`}></span>
                        </div>
                        {menu.description && <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">{menu.description}</p>}
                      </div>
                    </div>

                    <div className="mb-4 relative z-10">
                      <span className="text-lg font-bold text-amber-600">₹{menu.price}</span>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 ml-1">/person</span>
                    </div>

                    <div className="mt-auto relative z-10">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2.5 border-t border-gray-100 pt-3">Dishes</p>
                      <ul className="space-y-1.5">
                        {menu.dishes.slice(0, 3).map((dish, i) => (
                          <li key={i} className="flex items-start text-xs text-gray-600 font-medium">
                            <svg className="w-3.5 h-3.5 text-amber-400 mr-1.5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                            <span className="truncate">{dish}</span>
                          </li>
                        ))}
                        {menu.dishes.length > 3 && (
                          <li className="text-[11px] font-bold text-amber-500 pl-5">+{menu.dishes.length - 3} more</li>
                        )}
                      </ul>
                    </div>

                    {isSelected ? (
                      <button
                        onClick={() => handleDeselectMenu(menu.id)}
                        className="mt-5 w-full py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold rounded-lg transition-colors border border-amber-200 relative z-10 flex items-center justify-center gap-1.5 group"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        <span className="group-hover:hidden">Selected</span>
                        <span className="hidden group-hover:inline text-red-600">Remove</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSelectMenu(menu)}
                        className="mt-5 w-full py-2.5 bg-white hover:bg-amber-50 text-gray-700 hover:text-amber-700 text-xs font-bold rounded-lg border border-gray-200 hover:border-amber-300 transition-all duration-200 relative z-10 flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Select Menu
                      </button>
                    )}
                  </div>
                )})}
              </div>
            )}
          </section>
        </div>

        {/* ── RIGHT COLUMN: INFO ── */}
        <div className="lg:col-span-1 space-y-5 lg:space-y-6 flex flex-col lg:items-stretch">

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 pb-3 border-b border-gray-100">Specialized Cuisines</h4>
            <div className="flex flex-wrap gap-2">
              {caterer.cuisines && caterer.cuisines.length > 0 ? caterer.cuisines.map((cuisine, i) => (
                <span key={i} className="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-sm font-semibold border border-amber-100">
                  {cuisine}
                </span>
              )) : (
                <span className="text-gray-500 text-sm italic">Multi-cuisine</span>
              )}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 pb-3 border-b border-gray-100">Service Areas</h4>
            <ul className="space-y-3">
              {caterer.areasServed && caterer.areasServed.length > 0 ? caterer.areasServed.map((area, i) => (
                <li key={i} className="flex items-center text-sm text-gray-600 font-medium">
                  <svg className="w-4 h-4 text-amber-400 mr-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  {area}
                </li>
              )) : (
                <li className="text-gray-500 text-sm font-medium">{caterer.city || caterer.location || 'Throughout the city'}</li>
              )}
            </ul>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-xl p-6 shadow-sm">
            <h4 className="text-xs font-bold text-amber-600/70 uppercase tracking-widest mb-3">Direct Contact</h4>
            <p className="text-gray-900 font-bold text-lg mb-5">{caterer.phone || 'Available upon request'}</p>
            <button className="w-full py-3.5 bg-gray-900 text-white font-bold rounded-xl flex justify-center items-center gap-2 hover:bg-black transition-colors shadow-sm">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              Call Now
            </button>
          </div>

        </div>
      </div>

      {/* Floating Cart Bar - visible when item is in cart */}
      {cartItems.length > 0 && cartItems.some(item => item.catererId === (caterer?.id || caterer?._id)) && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 animate-fade-in w-[90%] sm:w-auto max-w-sm sm:max-w-none">
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center justify-between sm:justify-center gap-4 px-6 sm:px-8 py-3.5 bg-gray-900 text-white font-bold rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:bg-black hover:-translate-y-1 transition-all duration-300 w-full"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-amber-400 text-gray-900 text-sm flex items-center justify-center font-bold">
                {cartItems.filter(item => item.catererId === (caterer?.id || caterer?._id)).length}
              </span>
              <span>Menus Selected</span>
            </div>
            
            <span className="w-1.5 h-1.5 rounded-full bg-gray-600 hidden sm:block"></span>
            
            <span className="text-amber-400 flex items-center gap-1.5">
              Proceed to Cart
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </span>
          </button>
        </div>
      )}

      {/* Hide Scrollbar Style Inject */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};

export default CatererProfile;
