import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import faviconUrl from '../assets/favicon.ico';
import Loader from '../components/Loader';

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
    <div className="h-screen flex items-center justify-center p-4 bg-gray-50 overflow-hidden">

      <div className="w-full max-w-sm relative z-10">
        <div className="relative bg-white border border-gray-200 rounded-2xl p-5 shadow-lg">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500/0 via-amber-400 to-amber-500/0 rounded-t-2xl" aria-hidden />
          <div className="text-center mb-5 pt-1">
            <Link to="/" className="inline-flex items-center justify-center gap-2 mb-4 group">
              <img src={faviconUrl} alt="Logo" className="w-8 h-8 rounded-lg" />
              <span className="font-bold text-gray-900 text-sm tracking-tight">Caterers<span className="text-amber-500">NearMe</span></span>
            </Link>
            <h2 className="text-lg font-bold tracking-tight text-gray-900 mb-0.5">Welcome back</h2>
            <p className="text-xs text-gray-500">Enter your details to sign in.</p>
          </div>

          {redirectMessage && !error && (
            <div className="mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/40 text-amber-800 text-xs">
              {redirectMessage}
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 flex-shrink-0"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-[10px] font-semibold text-gray-500 mb-1 uppercase tracking-wide">Email</label>
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
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Password</label>
                <a href="#" className="text-[10px] font-semibold text-amber-500 hover:text-amber-600">Forgot?</a>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field py-2 text-sm"
                placeholder="••••••••"
                autoComplete="current-password"
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
            Don't have an account? <Link to="/register" className="font-semibold text-gray-900 hover:text-amber-500 transition-colors">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
