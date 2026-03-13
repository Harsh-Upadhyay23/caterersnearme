import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import api from '../services/api';

const CatererAuthContext = createContext();

export const useCatererAuth = () => useContext(CatererAuthContext);

export const CatererAuthProvider = ({ children }) => {
  const [caterer, setCaterer] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if caterer is logged in via HTTP-only cookie
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const { data } = await api.get('/caterers/me');
        if (data.success) {
          setCaterer(data.data);
        }
      } catch (err) {
        setCaterer(null);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/caterers/login', { email, password });
      setCaterer(data.data);
      return data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Login failed');
    }
  };

  const register = async (name, email, password, phone, city, address) => {
    try {
      const { data } = await api.post('/caterers/register', { name, email, password, phone, city, address });
      setCaterer(data.data);
      return data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Registration failed');
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const { data } = await api.put('/caterers/profile', profileData);
      setCaterer(data.data);
      return data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Profile update failed');
    }
  };

  const logout = async () => {
    try {
      await api.post('/caterers/logout');
      setCaterer(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const value = {
    caterer,
    loading,
    login,
    register,
    updateProfile,
    logout,
    isAuthenticated: !!caterer,
  };

  return (
    <CatererAuthContext.Provider value={value}>
      {!loading && children}
    </CatererAuthContext.Provider>
  );
};

CatererAuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
