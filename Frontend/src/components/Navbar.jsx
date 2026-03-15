import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCatererAuth } from '../context/CatererAuthContext';
import { useCart } from '../context/CartContext';
const Navbar = () => {
  const { user, logout } = useAuth();
  const { caterer, logout: catererLogout } = useCatererAuth();
  const { cartItems, setIsCartOpen } = useCart();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [catererDropdownOpen, setCatererDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const catererDropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (catererDropdownRef.current && !catererDropdownRef.current.contains(event.target)) {
        setCatererDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">

          <Link to="/caterers" className="flex items-center gap-2 group min-w-0">
            <img src="/logo.gif" alt="CaterersNearMe" className="h-12 w-auto flex-shrink-0" />
            <span className="hidden sm:inline-block font-bold text-gray-900 text-[14px] tracking-tight truncate">
              Caterers<span className="text-amber-500">NearMe</span>
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {!user && !caterer && (
              <Link
                to="/caterer/register"
                className="text-[11px] sm:text-xs font-semibold text-amber-600 hover:text-amber-500 px-2 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 transition-colors"
              >
                Partner with us
              </Link>
            )}

            {!user && !caterer && <div className="w-px h-4 bg-gray-200 hidden sm:block" />}

            {caterer && (
              <div className="relative" ref={catererDropdownRef}>
                <button 
                  onClick={() => setCatererDropdownOpen(!catererDropdownOpen)}
                  className="flex items-center gap-2 p-1 pr-2.5 rounded-full border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 transition-all"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-gray-900 font-bold text-[10px] shadow-inner">
                    C
                  </div>
                  <span className="text-xs font-semibold text-amber-600 hidden sm:block">Dashboard</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-3.5 h-3.5 text-amber-500 transition-transform ${catererDropdownOpen ? 'rotate-180' : ''}`}>
                    <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                  </svg>
                </button>

                {catererDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-44 rounded-xl bg-white border border-gray-200 shadow-lg py-1 z-50 animate-fade-in origin-top-right">
                    <div className="px-3 py-2 border-b border-gray-100 mb-1">
                      <p className="text-[10px] text-amber-600/80">Partner Portal</p>
                      <p className="text-sm font-semibold text-gray-900 truncate">{caterer.name}</p>
                    </div>
                    
                    <Link to="/caterer/dashboard" className="flex py-2 px-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors gap-2">
                       <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                       Manage Business
                    </Link>
                    
                    <button 
                      onClick={() => { catererLogout(); setCatererDropdownOpen(false); }}
                      className="w-full text-left flex py-2 px-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors gap-2 mt-1"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {user && (
              // Logged In User: Profile Dropdown
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-1 pr-2.5 rounded-full border border-gray-200 hover:border-amber-500/30 bg-gray-100 transition-all hover:bg-gray-200"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white font-bold text-xs shadow-inner">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-semibold text-gray-700 hidden sm:block">{user.name}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-3.5 h-3.5 text-gray-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}>
                    <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-44 rounded-xl bg-white border border-gray-200 shadow-lg py-1 z-50 animate-fade-in origin-top-right">
                    <div className="px-3 py-2 border-b border-gray-100 mb-1">
                      <p className="text-[10px] text-gray-500">Signed in as</p>
                      <p className="text-sm font-semibold text-gray-900 truncate">{user.email}</p>
                    </div>
                    
                    <a href="#" className="flex py-2 px-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors gap-2">
                       <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                       Your Profile
                    </a>
                    <Link to="/dashboard" className="flex py-2 px-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors gap-2 border-b border-gray-100">
                       <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                       Dashboard
                    </Link>
                    
                    <button 
                      onClick={() => {
                        logout();
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left flex py-2.5 px-4 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors gap-2 mt-1"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            )}

            {!user && !caterer && (
              <>
                <Link to="/login" className="text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors px-2">
                  Log in
                </Link>
                <Link to="/register" className="btn-primary text-xs px-3 py-1.5">
                  Sign up
                </Link>
              </>
            )}

          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
