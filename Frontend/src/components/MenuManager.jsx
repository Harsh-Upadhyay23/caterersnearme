import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import api from '../services/api';

const MenuManager = ({ catererId }) => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Form state
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    menuName: '',
    description: '',
    type: 'Veg',
    price: '',
    dishes: ''
  });

  const fetchMenus = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/menus/caterer/${catererId}`);
      if (data.success) {
        setMenus(data.data);
      }
    } catch (err) {
      setError('Failed to fetch menus');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (catererId) {
      fetchMenus();
    }
  }, [catererId]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateMenu = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        dishes: formData.dishes.split(',').map(d => d.trim()).filter(Boolean)
      };
      
      const { data } = await api.post('/menus', payload);
      if (data.success) {
        setMenus([...menus, data.data]);
        setIsAdding(false);
        setFormData({
          menuName: '',
          description: '',
          type: 'Veg',
          price: '',
          dishes: ''
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create menu');
    }
  };

  const handleDeleteMenu = async (id) => {
    if (!window.confirm('Are you sure you want to delete this menu?')) return;
    try {
      await api.delete(`/menus/${id}`);
      setMenus(menus.filter(m => m.id !== id));
    } catch (err) {
      setError('Failed to delete menu');
    }
  };

  if (loading && menus.length === 0) {
    return <div className="text-gray-400 text-sm">Loading menus...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium text-white">Menu Management</h2>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)} 
            className="px-4 py-2 bg-amber-400 text-gray-950 text-sm font-semibold rounded-lg hover:bg-amber-500 transition-colors"
          >
            + Add New Menu
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {isAdding && (
        <div className="mb-8 p-6 bg-white/5 border border-white/10 rounded-xl relative">
          <button onClick={() => setIsAdding(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <h3 className="text-lg font-medium text-white mb-4">Create New Menu</h3>
          <form onSubmit={handleCreateMenu} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">Menu Name</label>
                <input type="text" name="menuName" value={formData.menuName} onChange={handleInputChange} className="input-field" placeholder="e.g. Deluxe Veg Thali" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">Type</label>
                <select name="type" value={formData.type} onChange={handleInputChange} className="input-field">
                  <option value="Veg">Veg</option>
                  <option value="Non-Veg">Non-Veg</option>
                  <option value="Jain">Jain</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">Description</label>
                <input type="text" name="description" value={formData.description} onChange={handleInputChange} className="input-field" placeholder="Short description of this menu" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">Dishes (Comma separated)</label>
                <textarea name="dishes" value={formData.dishes} onChange={handleInputChange} className="input-field resize-none" rows="2" placeholder="Paneer Tikka, Dal Makhani, Butter Naan, Gulab Jamun" required></textarea>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">Price per Person (₹)</label>
                <input type="number" name="price" value={formData.price} onChange={handleInputChange} className="input-field" placeholder="500" required />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button type="submit" className="btn-primary px-6 py-2">Save Menu</button>
            </div>
          </form>
        </div>
      )}

      {menus.length === 0 && !isAdding ? (
        <div className="p-8 text-center border-2 border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
           <p className="text-gray-400">You haven't added any menus yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {menus.map(menu => (
            <div key={menu.id} className="p-5 rounded-xl border border-white/10 bg-white/[0.02] flex flex-col h-full">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-white font-semibold text-lg">{menu.menuName}</h4>
                    <span className={`px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded border ${
                      menu.type === 'Veg' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                      menu.type === 'Non-Veg' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                      'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {menu.type}
                    </span>
                  </div>
                  <p className="text-xl font-bold text-amber-400">₹{menu.price} <span className="text-xs font-normal text-gray-500">/ person</span></p>
                </div>
                <button onClick={() => handleDeleteMenu(menu.id)} className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
              
              {menu.description && <p className="text-sm text-gray-400 mb-3">{menu.description}</p>}
              
              <div className="mt-auto">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Included Dishes</p>
                <div className="flex flex-wrap gap-1.5">
                  {menu.dishes.map((dish, i) => (
                    <span key={i} className="px-2 py-1 text-xs text-gray-300 bg-white/5 border border-white/10 rounded-md">
                      {dish}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

MenuManager.propTypes = {
  catererId: PropTypes.string.isRequired
};

export default MenuManager;
