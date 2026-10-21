import axios from 'axios';
import { clearToken, getToken } from '../lib/tokenStore';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' });

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// An expired or revoked token on an authenticated call ends the session everywhere in the app.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && getToken()) {
      clearToken();
      window.dispatchEvent(new Event('auth:expired'));
    }
    return Promise.reject(error);
  },
);

/** Normalises any request failure to { message, fields } for forms and toasts. */
export function getErrorInfo(error) {
  if (error.response) {
    return { message: error.response.data?.message || 'Request failed', fields: error.response.data?.errors || null };
  }
  return { message: 'Cannot reach the server. Check your connection and try again.', fields: null };
}

export default api;
