import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCatererAuth } from '../../context/CatererAuthContext';
import faviconUrl from '../../assets/favicon.ico';

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
    <div className="min-h-screen flex selection:bg-amber-400 selection:text-black" style={{ background: '#0a0a0f' }}>
      
      {/* ── Left Side (Form) ── */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 relative z-10">
        
        {/* Mobile Logo */}
        <Link to="/" className="lg:hidden absolute top-8 left-6 sm:left-10 flex items-center gap-2.5">
          <img src={faviconUrl} alt="Logo" className="w-8 h-8 rounded-lg" />
          <span className="font-bold text-white text-[15px] tracking-tight">
            Caterers<span className="text-amber-400">NearMe</span>
            <span className="ml-2 px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-md bg-amber-400/20 text-amber-400 border border-amber-400/30">Partner</span>
          </span>
        </Link>
        
        <div className="w-full max-w-md mt-12 lg:mt-0">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Partner with us</h2>
            <p className="text-sm text-gray-400">Create your caterer account to reach thousands of customers.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-950/50 border border-red-900/50 text-red-300 text-sm flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 flex-shrink-0"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">Business Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="input-field" placeholder="Kamble Caterers" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="input-field" placeholder="contact@example.com" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">Phone Number</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="input-field" placeholder="9876543210" required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} className="input-field" placeholder="••••••••" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">Confirm Password</label>
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="input-field" placeholder="••••••••" required />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1">
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">City</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} className="input-field" placeholder="Mumbai" required />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">Business Address</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} className="input-field" placeholder="Shop 4, Linking Road" required />
              </div>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed pt-2">
              By creating a partner account, you agree to our <a href="#" className="text-gray-400 hover:text-white underline decoration-white/30">Terms of Service</a>.
            </p>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-[15px] mt-2 group relative overflow-hidden">
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-amber-400 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative z-10 flex items-center justify-center">
                {loading ? (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ) : 'Sign up as Caterer'}
              </span>
            </button>
            
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Already a partner?{' '}
            <Link to="/caterer/login" className="font-semibold text-white hover:text-amber-400 transition-colors">
              Log in to Dashboard
            </Link>
          </p>
        </div>
      </div>

      {/* ── Right Side (Image) ── */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#111116] border-l border-white/5 overflow-hidden">
        {/* Abstract Background Design */}
        <div className="absolute top-0 right-0 w-full h-full opacity-30">
          <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-amber-500/20 blur-[120px]"></div>
          <div className="absolute bottom-[10%] -left-[10%] w-[60%] h-[60%] rounded-full bg-orange-600/10 blur-[100px]"></div>
        </div>

        <div className="relative z-10 p-16 flex flex-col justify-between h-full w-full">
          <div className="flex justify-start w-full">
            <Link to="/" className="flex items-center gap-3 w-max group">
              <img src={faviconUrl} alt="Logo" className="w-9 h-9 rounded-xl shadow-[0_0_15px_rgba(251,191,36,0.2)] group-hover:shadow-[0_0_20px_rgba(251,191,36,0.4)] transition-all duration-300" />
              <div className="flex flex-col">
                <span className="font-bold text-white text-[18px] leading-tight tracking-tight">
                  Caterers<span className="text-amber-400">NearMe</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-500/80">Partner Portal</span>
              </div>
            </Link>
          </div>
          
          <div className="max-w-md">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400-[0.05] rounded-full border border-amber-400/20 mb-6 font-medium text-amber-400 text-xs tracking-wide uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
              Grow your business
            </div>
            <h1 className="text-4xl text-white font-display font-medium leading-[1.1] tracking-tight mb-6">
              Connect with thousands of event hosts locally.
            </h1>
            <ul className="space-y-4 text-gray-400 text-sm">
               <li className="flex items-start gap-3">
                 <svg className="w-5 h-5 text-amber-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                 <span>Free public profile optimized for Google</span>
               </li>
               <li className="flex items-start gap-3">
                 <svg className="w-5 h-5 text-amber-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                 <span>Showcase multimedia image gallery</span>
               </li>
               <li className="flex items-start gap-3">
                 <svg className="w-5 h-5 text-amber-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                 <span>Manage menus & prices dynamically</span>
               </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatererRegister;
