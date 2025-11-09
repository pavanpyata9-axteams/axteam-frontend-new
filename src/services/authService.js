import api from '../api/axios';

export const authService = {
  // User registration
  register: async (userData) => {
    try {
      console.log('📝 [authService] Attempting registration with:', { name: userData.name, email: userData.email, phone: userData.phone });
      
      const response = await api.post('/api/auth/register', userData);
      console.log('✅ [authService] Registration response received:', response.data);
      
      // Validate response structure
      const { success, token, user } = response.data;
      
      if (!success || !user || !user._id || !token) {
        console.error('❌ [authService] Invalid registration response structure');
        throw new Error('Invalid server response');
      }
      
      // Save in axteamAuth format
      const axteamAuth = {
        token: token,
        user: user
      };
      
      console.log('💾 [authService] Saving registration axteamAuth to localStorage:', axteamAuth);
      localStorage.setItem('axteamAuth', JSON.stringify(axteamAuth));
      
      return {
        user: user,
        token: token
      };
    } catch (error) {
      console.error('❌ [authService] Registration error:', error);
      throw error.response?.data || { message: 'Registration failed' };
    }
  },

  // ✅ FIXED: User login (as per prompt requirements)
  login: async (credentials) => {
    try {
      console.log('🔐 [authService] Attempting login with:', { email: credentials.email });
      
      // ✅ FIXED: Send ONLY email and password (no extra fields)
      const loginPayload = {
        email: credentials.email,
        password: credentials.password
      };
      
      const response = await api.post('/api/auth/login', loginPayload);
      console.log('✅ [authService] Login response received:', response.data);
      
      // ✅ FIXED: Handle response according to prompt structure
      const { success, token, user } = response.data;
      
      if (!success || !user || !user._id || !token) {
        console.error('❌ [authService] Invalid login response structure');
        throw new Error('Invalid server response');
      }
      
      // ✅ FIXED: Save in axteamAuth format as per prompt requirements
      const axteamAuth = {
        token: token,
        user: user
      };
      
      console.log('💾 [authService] Saving axteamAuth to localStorage:', axteamAuth);
      localStorage.setItem('axteamAuth', JSON.stringify(axteamAuth));
      
      // Also save individual items for backward compatibility
      localStorage.setItem('authToken', token);
      localStorage.setItem('userId', user._id);
      localStorage.setItem('userName', user.name);
      localStorage.setItem('userEmail', user.email);
      localStorage.setItem('userType', user.role);
      
      console.log('✅ [authService] Auth data saved successfully');
      
      return {
        user: user,
        token: token,
        message: response.data.message
      };
    } catch (error) {
      console.error('❌ [authService] Login error:', error);
      throw error.response?.data || { message: 'Login failed' };
    }
  },

  // Admin login
  adminLogin: async (credentials) => {
    try {
      console.log('🔐 [authService] Attempting admin login with:', { email: credentials.email });
      
      const loginPayload = {
        email: credentials.email,
        password: credentials.password
      };
      
      const response = await api.post('/api/auth/admin-login', loginPayload);
      console.log('✅ [authService] Admin login response received:', response.data);
      
      // Handle response according to prompt structure
      const { success, token, user } = response.data;
      
      if (!success || !user || !user._id || !token) {
        console.error('❌ [authService] Invalid admin login response structure');
        throw new Error('Invalid server response');
      }
      
      // Save in axteamAuth format
      const axteamAuth = {
        token: token,
        user: user
      };
      
      console.log('💾 [authService] Saving admin axteamAuth to localStorage:', axteamAuth);
      localStorage.setItem('axteamAuth', JSON.stringify(axteamAuth));
      
      return {
        user: user,
        token: token
      };
    } catch (error) {
      console.error('❌ [authService] Admin login error:', error);
      throw error.response?.data || { message: 'Admin login failed' };
    }
  },

  // Get current user (GET /auth/me)
  getMe: async () => {
    try {
      const response = await api.get('/api/auth/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get current user' };
    }
  },

  // Logout
  logout: () => {
    console.log('🚪 [authService] Logging out - clearing axteamAuth');
    localStorage.removeItem('axteamAuth');
    // Also clear backward compatibility items
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userPhone');
  },

  // Get current user profile
  getProfile: async () => {
    try {
      const response = await api.get('/api/auth/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get profile' };
    }
  }
};