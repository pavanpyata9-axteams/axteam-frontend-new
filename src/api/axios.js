import axios from "axios";

const api = axios.create({
  baseURL: "https://axteam-backend.onrender.com/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ FIXED: Request interceptor as per prompt requirements
api.interceptors.request.use(
  (config) => {
    // ✅ FIXED: Get token from axteamAuth as per prompt requirements
    const stored = localStorage.getItem('axteamAuth');
    if (stored) {
      const { token } = JSON.parse(stored);
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
        console.log('🔗 [axios] Request to:', config.url, 'with token');
      }
    } else {
      // Check if this is a public route (like /reviews/homepage)
      const isPublicRoute = config.url.includes('/reviews/homepage') || 
                           config.url.includes('/services/') || 
                           config.url.includes('/health');
      if (!isPublicRoute) {
        console.warn('⚠️ [axios] No axteamAuth found for request to:', config.url);
      }
    }
    return config;
  },
  (error) => {
    console.error('❌ [axios] Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Clear invalid token and redirect to login
      console.log('🚫 [axios] 401 Unauthorized - clearing auth data');
      localStorage.removeItem('axteamAuth');
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      localStorage.removeItem('userType');
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userPhone');
      window.location.href = '/login';
    }
    // Propagate error.response.data as per prompt requirements
    return Promise.reject(error);
  }
);

export default api;