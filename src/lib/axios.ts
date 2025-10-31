import axios from 'axios';

// Prefer env var set at build time on Vercel; fallback to Render URL; dev -> localhost
const baseURL =
  (import.meta.env && (import.meta.env as any).VITE_API_URL) ||
  (typeof window !== 'undefined' && (window as any).__VITE_API_URL__) ||
  'https://ideahub-w8zr.onrender.com/api';

// Create axios instance with baseURL and credentials
const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Important for sending cookies
});

// Add a request interceptor to include the auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('idea_hub_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't log 401 errors to avoid console noise
    if (error.response?.status !== 401) {
      console.error('API Error:', error);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
