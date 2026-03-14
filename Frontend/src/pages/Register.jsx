import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import faviconUrl from '../assets/favicon.ico';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/caterers';
  const redirectMessage = location.state?.message;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      await register(name, email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#0a0a0f' }}>
      
      {/* ── Left Side (Image) ── */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img 
          src="https://weddingsutra.com/images/Vendor_Images/Catering/gyanjee-caterers/gyanjee-caterers-10.jpg" 
          alt="Fine dining backdrop"
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
              Discover local<br/>caterers and make<br/>your event special.
            </h1>
            <p className="text-gray-300 max-w-sm drop-shadow-md">
              Sign up today to explore exclusive deals and directly request quotes from top caterers.
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
            <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Create an account</h2>
            <p className="text-sm text-gray-400">Sign up to compare caterers and request quotes.</p>
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
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field" 
                placeholder="Rohan Sharma"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field" 
                placeholder="rohan@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field" 
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">Confirm Password</label>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-field" 
                placeholder="••••••••"
                required
              />
            </div>

            <p className="text-xs text-gray-500 leading-relaxed pt-2">
              By creating an account, you agree to our <a href="#" className="text-gray-400 hover:text-white underline decoration-white/30">Terms of Service</a> and <a href="#" className="text-gray-400 hover:text-white underline decoration-white/30">Privacy Policy</a>.
            </p>

            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary w-full py-3.5 text-[15px] mt-2"
            >
              {loading ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : 'Create account'}
            </button>
            
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-white hover:text-amber-400 transition-colors">
              Log in
            </Link>
          </p>
        </div>
      </div>

    </div>
  );
};

export default Register;
