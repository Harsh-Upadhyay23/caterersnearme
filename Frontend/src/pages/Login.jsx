import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import faviconUrl from '../assets/favicon.ico';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/caterers';
  const redirectMessage = location.state?.message;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#0a0a0f' }}>
      
      {/* ── Left Side (Image) ── */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img 
          src="https://images.unsplash.com/photo-1555244162-803834f70033?w=1200&auto=format&fit=crop&q=80" 
          alt="Catering Setup" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-black/40 to-black/20" />
        <div className="absolute inset-0 bg-amber-500/10 mix-blend-overlay" />
        
        <div className="relative z-10 p-12 flex flex-col justify-between h-full w-full">
          <Link to="/" className="flex items-center gap-2.5 w-max">
            <img src={faviconUrl} alt="Logo" className="w-8 h-8 rounded-lg shadow-lg" />
            <span className="font-bold text-white text-[17px] tracking-tight drop-shadow-md">
              Caterers<span className="text-amber-400">NearMe</span>
            </span>
          </Link>
          
          <div className="mb-10">
            <h1 className="text-4xl text-white font-display font-bold leading-tight mb-4 drop-shadow-lg">
              Find the perfect<br/>caterer for your<br/>next big event.
            </h1>
            <p className="text-gray-300 max-w-sm drop-shadow-md">
              Join thousands of people who found their ideal catering partner through our platform.
            </p>
          </div>
        </div>
      </div>

      {/* ── Right Side (Form) ── */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-4 py-8 sm:px-8 sm:py-12 relative">
        
        {/* Mobile Logo */}
        <Link to="/" className="lg:hidden absolute top-5 left-4 sm:top-8 sm:left-8 flex items-center gap-2.5">
          <img src={faviconUrl} alt="Logo" className="w-8 h-8 rounded-lg" />
          <span className="font-bold text-white text-[15px] tracking-tight">
            Caterers<span className="text-amber-400">NearMe</span>
          </span>
        </Link>
        
        <div className="w-full max-w-md pt-10 sm:pt-12">
          <div className="mb-8 sm:mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Welcome back</h2>
            <p className="text-sm text-gray-400">Please enter your details to sign in.</p>
          </div>

          {redirectMessage && !error && (
            <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-200 text-sm">
              {redirectMessage}
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-950/50 border border-red-900/50 text-red-300 text-sm flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 flex-shrink-0"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field" 
                placeholder="Enter your email"
                autoComplete="email"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide">Password</label>
                <a href="#" className="text-xs font-semibold text-amber-500 hover:text-amber-400">Forgot password?</a>
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field" 
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary w-full py-3.5 text-[15px] mt-4"
            >
              {loading ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : 'Sign in'}
            </button>
            
            <button 
              type="button"
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border border-white/[0.08] bg-white/[0.02] text-sm font-semibold text-white hover:bg-white/[0.04] transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
              Sign in with Google
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-white hover:text-amber-400 transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
