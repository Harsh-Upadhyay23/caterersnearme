import { useState, useEffect } from 'react';
import { useCatererAuth } from '../../context/CatererAuthContext';
import MenuManager from '../../components/MenuManager';
import ImageUploader from '../../components/ImageUploader';

const CatererDashboard = () => {
  const { caterer, updateProfile, logout } = useCatererAuth();
  const [activeTab, setActiveTab] = useState('profile');
  
  // Profile State
  const [profileData, setProfileData] = useState({
    name: '',
    establishedYear: '',
    location: '',
    city: '',
    address: '',
    phone: '',
    description: '',
    cuisines: '',
    services: '',
    areasServed: ''
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState('');

  // Initialize data
  useEffect(() => {
    if (caterer) {
      setProfileData({
        name: caterer.name || '',
        establishedYear: caterer.establishedYear || '',
        location: caterer.location || '',
        city: caterer.city || '',
        address: caterer.address || '',
        phone: caterer.phone || '',
        description: caterer.description || '',
        cuisines: caterer.cuisines ? caterer.cuisines.join(', ') : '',
        services: caterer.services ? caterer.services.join(', ') : '',
        areasServed: caterer.areasServed ? caterer.areasServed.join(', ') : ''
      });
    }
  }, [caterer]);

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setMessage('');
    
    try {
      // Convert comma-separated strings back to arrays
      const payload = {
        ...profileData,
        cuisines: profileData.cuisines.split(',').map(s => s.trim()).filter(Boolean),
        services: profileData.services.split(',').map(s => s.trim()).filter(Boolean),
        areasServed: profileData.areasServed.split(',').map(s => s.trim()).filter(Boolean),
      };
      
      await updateProfile(payload);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.message || 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8" style={{ background: '#0a0a0f' }}>
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-white/10 gap-4">
          <div>
            <h1 className="text-3xl font-display font-medium text-white mb-2">Partner Dashboard</h1>
            <p className="text-gray-400">Welcome back, <span className="text-amber-400 font-semibold">{caterer?.name}</span></p>
          </div>
          <div className="flex items-center gap-4">
            <a href={`/caterer/${caterer?.slug}`} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10 transition-colors">
              View Public Profile
            </a>
            <button onClick={logout} className="px-4 py-2 rounded-lg bg-red-500/10 text-red-500 text-sm hover:bg-red-500/20 transition-colors">
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1 space-y-2">
            {[
              { id: 'profile', label: 'Business Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
              { id: 'images', label: 'Image Gallery', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
              { id: 'menus', label: 'Menu Management', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                  activeTab === tab.id 
                    ? 'bg-amber-400/10 text-amber-400 border border-amber-400/20 font-medium' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                </svg>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-[#111116] border border-white/5 rounded-2xl p-6 sm:p-8">
              
              {/* === PROFILE TAB === */}
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-xl font-medium text-white mb-6">Business Details</h2>
                  
                  {message && (
                    <div className={`mb-6 p-4 rounded-xl text-sm flex items-center gap-3 ${message.includes('success') ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                      {message}
                    </div>
                  )}

                  <form onSubmit={handleProfileSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase">Business Name</label>
                        <input type="text" name="name" value={profileData.name} onChange={handleProfileChange} className="input-field" required />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase">Established Year</label>
                        <input type="number" name="establishedYear" value={profileData.establishedYear} onChange={handleProfileChange} className="input-field" placeholder="e.g. 2010" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase">Contact Phone</label>
                        <input type="tel" name="phone" value={profileData.phone} onChange={handleProfileChange} className="input-field" required />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase">Location (General)</label>
                        <input type="text" name="location" value={profileData.location} onChange={handleProfileChange} className="input-field" placeholder="e.g. Andheri West" required />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase">Full Address</label>
                        <input type="text" name="address" value={profileData.address} onChange={handleProfileChange} className="input-field" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase">About Business</label>
                        <textarea name="description" value={profileData.description} onChange={handleProfileChange} rows="4" className="input-field resize-none" placeholder="Describe your experience, quality standards, etc."></textarea>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase">Cuisines Offered (Comma separated)</label>
                        <input type="text" name="cuisines" value={profileData.cuisines} onChange={handleProfileChange} className="input-field" placeholder="North Indian, Maharashtrian, Chinese" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase">Services (Comma separated)</label>
                        <input type="text" name="services" value={profileData.services} onChange={handleProfileChange} className="input-field" placeholder="Veg, Non-Veg, Jain Food, Corporate Events" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase">Areas Served (Comma separated)</label>
                        <input type="text" name="areasServed" value={profileData.areasServed} onChange={handleProfileChange} className="input-field" placeholder="Andheri, Bandra, Juhu" />
                      </div>
                    </div>
                    
                    <div className="flex justify-end pt-4 border-t border-white/5">
                      <button type="submit" disabled={isUpdating} className="btn-primary px-8 py-2.5">
                        {isUpdating ? 'Saving...' : 'Save Profile'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* === IMAGES TAB === */}
              {activeTab === 'images' && (
                <ImageUploader 
                  currentImages={caterer.images || []} 
                  onUploadSuccess={(newImages) => {
                    // Update the local context state or let the context's updateProfile handle it
                  }} 
                />
              )}

              {/* === MENUS TAB === */}
              {activeTab === 'menus' && (
                <MenuManager catererId={caterer.id} />
              )}

            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default CatererDashboard;
