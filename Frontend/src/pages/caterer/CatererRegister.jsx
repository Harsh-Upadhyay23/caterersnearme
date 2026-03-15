import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCatererAuth } from '../../context/CatererAuthContext';
import faviconUrl from '../../assets/favicon.ico';
import Loader from '../../components/Loader';

const CatererRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    city: '',
    address: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useCatererAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword, phone, city, address } = formData;

    if (!name || !email || !password || !confirmPassword || !phone || !city || !address) {
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
      await register(name, email, password, phone, city, address);
      navigate('/caterer/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center p-4 bg-gray-50 overflow-hidden">
      <div className="w-full max-w-sm relative z-10 -mt-6">
        <div className="relative bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-lg max-h-[90vh] overflow-y-auto hide-scrollbar">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500/0 via-amber-400 to-amber-500/0 rounded-t-2xl" aria-hidden />
          <div className="text-center mb-4 pt-1">
            <Link to="/" className="inline-flex items-center justify-center gap-2 mb-3 lg:mb-4 group">
              <img src={faviconUrl} alt="Logo" className="w-7 h-7 lg:w-8 lg:h-8 rounded-lg" />
              <span className="font-bold text-gray-900 text-sm tracking-tight">
                Caterers<span className="text-amber-500">NearMe</span>
                <span className="ml-1.5 px-1 py-0.5 text-[9px] uppercase font-bold rounded bg-amber-500/10 text-amber-600 border border-amber-500/20">Partner</span>
              </span>
            </Link>
            <h2 className="text-lg font-bold tracking-tight text-gray-900 mb-0.5">Partner with us</h2>
            <p className="text-xs text-gray-500">Create your caterer account to reach thousands of customers.</p>
          </div>

          {error && (
            <div className="mb-3 p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 flex-shrink-0"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-2.5">
            <div>
              <label className="block text-[10px] font-semibold text-gray-500 mb-0.5 uppercase tracking-wide">Business Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="input-field py-2 text-sm" placeholder="Kamble Caterers" required />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 mb-0.5 uppercase tracking-wide">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="input-field py-2 text-sm" placeholder="contact@example.com" required />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 mb-0.5 uppercase tracking-wide">Phone</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="input-field py-2 text-sm" placeholder="9876543210" required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 mb-0.5 uppercase tracking-wide">Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} className="input-field py-2 text-sm" placeholder="••••••••" required />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 mb-0.5 uppercase tracking-wide">Confirm</label>
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="input-field py-2 text-sm" placeholder="••••••••" required />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 mb-0.5 uppercase tracking-wide">City</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} className="input-field py-2 text-sm" placeholder="Mumbai" required />
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] font-semibold text-gray-500 mb-0.5 uppercase tracking-wide">Address</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} className="input-field py-2 text-sm" placeholder="Shop 4, Linking Road" required />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 text-sm mt-2">
              {loading ? (
                <Loader className="w-3.5 h-3.5 -ml-1 mr-2" />
              ) : 'Sign up as Caterer'}
            </button>
          </form>

          <p className="mt-3 text-center text-xs text-gray-500 border-t border-gray-100 pt-3">
            Already a partner? <Link to="/caterer/login" className="font-semibold text-gray-900 hover:text-amber-500 transition-colors">Log in</Link>
          </p>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};

export default CatererRegister;
