import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
      navigate('/caterers');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#0a0a0f' }}>
      
      {/* ── Left Side (Form) ── */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 relative order-2 lg:order-1">
        
        {/* Mobile Logo */}
        <Link to="/" className="lg:hidden absolute top-8 left-6 sm:left-10 flex items-center gap-2.5">
          <img src={faviconUrl} alt="Logo" className="w-8 h-8 rounded-lg" />
          <span className="font-bold text-white text-[15px] tracking-tight">
            Caterers<span className="text-amber-400">NearMe</span>
          </span>
        </Link>
        
        <div className="w-full max-w-md">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Create an account</h2>
            <p className="text-sm text-gray-400">Sign up to compare caterers and request quotes.</p>
          </div>

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

      {/* ── Right Side (Image) ── */}
      <div className="hidden lg:flex lg:w-1/2 relative order-1 lg:order-2">
        <img 
          src="https://images.unsplash.com/photo-1414235077428-338988a2e8c0?w=1200&auto=format&fit=crop&q=80" 
          alt="Fine Dining" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-black/40 to-black/20" />
        <div className="absolute inset-0 bg-amber-500/10 mix-blend-overlay" />
        
        <div className="relative z-10 p-12 flex flex-col justify-between h-full w-full">
          <div className="flex justify-end w-full">
            <Link to="/" className="flex items-center gap-2.5 w-max">
              <span className="font-bold text-white text-[17px] tracking-tight drop-shadow-md">
                Caterers<span className="text-amber-400">NearMe</span>
              </span>
              <img src={faviconUrl} alt="Logo" className="w-8 h-8 rounded-lg shadow-lg" />
            </Link>
          </div>
          
          <div className="mb-10 text-right">
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-4 shadow-xl">
               {[1,2,3,4,5].map(i => (
                 <svg key={i} className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
               ))}
               <span className="text-xs font-bold text-white ml-1">4.9 / 5.0</span>
             </div>
            <h1 className="text-3xl text-white font-display font-medium leading-tight drop-shadow-lg">
              "We found the best North Indian caterer for our wedding in minutes. Highly recommended!"
            </h1>
            <p className="text-amber-400 font-semibold mt-4 drop-shadow-md">
              — Priya & Rahul
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
