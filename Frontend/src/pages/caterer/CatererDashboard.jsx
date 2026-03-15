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
    pricePerPlate: '',
    description: '',
    cuisines: '',
    services: '',
    areasServed: ''
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState('');
  const [profileSaved, setProfileSaved] = useState(false);

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
        pricePerPlate: caterer.pricePerPlate || '',
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
      setProfileSaved(true);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.message || 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-gray-200 gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">Partner Dashboard</h1>
            <p className="text-gray-600">Welcome back, <span className="text-amber-600 font-semibold">{caterer?.name}</span></p>
          </div>
          <div className="flex items-center gap-4">
            <a href={`/caterer/${caterer?.slug}`} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 text-sm hover:bg-gray-50 transition-colors shadow-sm">
              View Public Profile
            </a>
            <button onClick={logout} className="px-4 py-2 rounded-lg bg-red-50 text-red-600 text-sm hover:bg-red-100 transition-colors font-medium shadow-sm">
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
                    ? 'bg-amber-50 text-amber-600 border border-amber-200 font-semibold shadow-sm' 
                    : 'text-gray-600 hover:bg-white hover:text-gray-900 border border-transparent shadow-sm'
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
            <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 sm:p-8">
              
              {/* === PROFILE TAB === */}
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Business Details</h2>
                  
                  {message && (
                    <div className={`mb-6 p-4 rounded-xl text-sm flex items-center gap-3 ${message.includes('success') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                      {message}
                    </div>
                  )}

                  <form onSubmit={handleProfileSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Business Name</label>
                        <input type="text" name="name" value={profileData.name} onChange={handleProfileChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all" required />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Established Year</label>
                        <input type="number" name="establishedYear" value={profileData.establishedYear} onChange={handleProfileChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all" placeholder="e.g. 2010" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Contact Phone</label>
                        <input type="tel" name="phone" value={profileData.phone} onChange={handleProfileChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all" required />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Price Per Plate (₹)</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-600 font-bold text-sm pointer-events-none select-none">₹</span>
                          <input
                            type="number"
                            name="pricePerPlate"
                            value={profileData.pricePerPlate}
                            onChange={handleProfileChange}
                            className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                            placeholder="e.g. 450"
                            min="1"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Location (General)</label>
                        <input type="text" name="location" value={profileData.location} onChange={handleProfileChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all" placeholder="e.g. Andheri West" required />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">City</label>
                        <input type="text" name="city" value={profileData.city} onChange={handleProfileChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all" placeholder="e.g. Mumbai" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Full Address</label>
                        <input type="text" name="address" value={profileData.address} onChange={handleProfileChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">About Business</label>
                        <textarea name="description" value={profileData.description} onChange={handleProfileChange} rows="4" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all resize-none" placeholder="Describe your experience, quality standards, etc."></textarea>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Cuisines Offered (Comma separated)</label>
                        <input type="text" name="cuisines" value={profileData.cuisines} onChange={handleProfileChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all" placeholder="North Indian, Maharashtrian, Chinese" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Services (Comma separated)</label>
                        <input type="text" name="services" value={profileData.services} onChange={handleProfileChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all" placeholder="Veg, Non-Veg, Jain Food, Corporate Events" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Areas Served (Comma separated)</label>
                        <input type="text" name="areasServed" value={profileData.areasServed} onChange={handleProfileChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all" placeholder="Andheri, Bandra, Juhu" />
                      </div>
                    </div>
                    
                    <div className="flex justify-end items-center gap-4 pt-4 border-t border-gray-200">
                      {profileSaved && (
                        <button
                          type="button"
                          onClick={() => setActiveTab('images')}
                          className="flex items-center gap-2 px-8 py-2.5 bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                        >
                          Next — Upload Images
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      )}
                      <button type="submit" disabled={isUpdating} className="px-8 py-2.5 bg-gray-900 hover:bg-black text-white font-medium rounded-xl transition-all shadow-md">
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
                  currentThumbnail={caterer.image}
                  onUploadSuccess={() => {}}
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
