import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Required to send/receive HTTP-only cookies
});

// Add request interceptor to attach custom token headers
api.interceptors.request.use((config) => {
  const userToken = localStorage.getItem('userToken');
  const catererToken = localStorage.getItem('catererToken');
  
  if (userToken) {
    config.headers['x-auth-token'] = userToken;
  }
  if (catererToken) {
    config.headers['x-caterer-token'] = catererToken;
  }
  
  return config;
});

/**
 * Fetch all caterers from the API
 * @returns {Promise<Array>}
 */
export const fetchCaterers = async () => {
  const { data } = await api.get('/caterers');
  return data.data; // unwrap the { success, count, data } envelope
};

/**
 * Search caterers by any query (name, city, area, cuisine, dishes, etc.) + optional maxPrice
 * @param {string} q - search term
 * @param {number|null} maxPrice
 * @returns {Promise<Array>}
 */
export const searchCaterers = async (q = '', maxPrice = null) => {
  const params = {};
  if (q && q.trim()) params.q = q.trim();
  if (maxPrice !== null && maxPrice !== Infinity) params.maxPrice = maxPrice;
  const { data } = await api.get('/caterers/search', { params });
  return data.data;
};


/**
 * Fetch a single caterer by ID
 * @param {string} id
 * @returns {Promise<Object>}
 */
export const fetchCatererById = async (id) => {
  const { data } = await api.get(`/caterers/${id}`);
  return data.data;
};

/**
 * Fetch menus for a specific caterer
 * @param {string} catererId
 * @returns {Promise<Array>}
 */
export const fetchMenusByCaterer = async (catererId) => {
  const { data } = await api.get(`/menus/caterer/${catererId}`);
  return data.data;
};

/**
 * Create a new caterer
 * @param {Object} catererData
 * @returns {Promise<Object>}
 */
export const createCaterer = async (catererData) => {
  const { data } = await api.post('/caterers', catererData);
  return data.data;
};

export default api;
