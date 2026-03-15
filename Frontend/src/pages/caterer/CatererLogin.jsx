import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCatererAuth } from '../../context/CatererAuthContext';
import faviconUrl from '../../assets/favicon.ico';
import Loader from '../../components/Loader';

const CatererLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useCatererAuth();
  const navigate = useNavigate();

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
      navigate('/caterer/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center p-4 overflow-hidden bg-gray-50">
      <div className="w-full max-w-sm relative z-10">
        <div className="relative bg-white border border-gray-200 rounded-2xl p-5 shadow-lg">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500/0 via-amber-400 to-amber-500/0 rounded-t-2xl" aria-hidden />
          <div className="text-center mb-5 pt-1">
            <Link to="/" className="inline-flex items-center justify-center gap-2 mb-4 group">
              <img src={faviconUrl} alt="Logo" className="w-8 h-8 rounded-lg" />
              <span className="font-bold text-gray-900 text-sm tracking-tight">
                Caterers<span className="text-amber-500">NearMe</span>
                <span className="ml-1.5 text-[9px] uppercase font-bold text-amber-600">Partner</span>
              </span>
            </Link>
            <h2 className="text-lg font-bold tracking-tight text-gray-900 mb-0.5">Partner login</h2>
            <p className="text-xs text-gray-500">Log in to manage your dashboard.</p>
          </div>

          {error && (
            <div className="mb-3 p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 flex-shrink-0"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-[10px] font-semibold text-gray-500 mb-0.5 uppercase tracking-wide">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field py-2 text-sm" 
                placeholder="contact@business.com"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-gray-500 mb-0.5 uppercase tracking-wide">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field py-2 text-sm" 
                placeholder="••••••••"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary w-full py-2.5 text-sm mt-2"
            >
              {loading ? (
                <Loader className="w-3.5 h-3.5 -ml-1 mr-2" />
              ) : 'Sign in'}
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-gray-500 border-t border-gray-100 pt-4">
            Not a partner? <Link to="/caterer/register" className="font-semibold text-gray-900 hover:text-amber-500 transition-colors">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CatererLogin;
