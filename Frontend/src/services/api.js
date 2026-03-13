import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Required to send/receive HTTP-only cookies
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
 * Fetch a single caterer by ID
 * @param {string} id
 * @returns {Promise<Object>}
 */
export const fetchCatererById = async (id) => {
  const { data } = await api.get(`/caterers/${id}`);
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
