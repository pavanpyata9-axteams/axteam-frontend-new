import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sessionManager } from '../utils/sessionManager';
import useDeviceDetection from '../hooks/useDeviceDetection';
import { authService } from '../services/authService';

const Login = () => {
  const { isMobile } = useDeviceDetection();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
  });
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Check if user is already logged in with valid session
  useEffect(() => {
    if (sessionManager.isSessionValid()) {
      const userType = localStorage.getItem('userType');
      if (userType === 'admin') {
        navigate('/admin/dashboard');
      } else if (userType === 'user') {
        navigate('/user/dashboard');
      }
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // ✅ FIXED: Determine if admin login based on email
      const isAdminLogin = formData.email.includes('@axteam.com') || formData.email.includes('admin');
      
      console.log('🔐 [Login] Login attempt:', { email: formData.email, isAdmin: isAdminLogin });
      
      // ✅ FIXED: Use correct endpoint logic
      const endpoint = isAdminLogin ? 'admin-login' : 'login';
      
      // ✅ FIXED: Send ONLY email and password (as per prompt requirements)
      const credentials = {
        email: formData.email,
        password: formData.password
      };
      
      // Call appropriate service method
      const response = isAdminLogin 
        ? await authService.adminLogin(credentials)
        : await authService.login(credentials);
      
      console.log('✅ [Login] Response received:', response);
      
      // ✅ FIXED: Handle response according to prompt requirements  
      // Response structure: { success: true, token: "JWT_TOKEN", user: { "_id", "email", "role", ... } }
      const { user, token } = response;
      
      // ✅ FIXED: Save in axteamAuth format as per prompt
      localStorage.setItem('axteamAuth', JSON.stringify({
        token: token,
        user: user
      }));
      
      // Backward compatibility storage
      localStorage.setItem('authToken', token);
      localStorage.setItem('userType', user.role || 'user');
      localStorage.setItem('userId', user._id);
      localStorage.setItem('userName', user.name);
      localStorage.setItem('userEmail', user.email);
      localStorage.setItem('userPhone', user.phone || '');
      
      // Set session using sessionManager
      sessionManager.setLogin(
        user.role || 'user', 
        user.email, 
        user.name,
        user._id,
        token
      );
      
      console.log('✅ [Login] Auth data stored successfully');
      
      // Force a small delay before navigation on mobile to prevent white screen
      if (isMobile) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      // Check user role and redirect accordingly
      if (user.role === 'admin' || isAdminLogin) {
        navigate('/admin/dashboard');
      } else {
        // Check for pending service selection and redirect
        const pendingService = localStorage.getItem('pendingServiceSelection');
        const redirectAfterLogin = localStorage.getItem('redirectAfterLogin');
        
        if (pendingService && redirectAfterLogin) {
          // Clear the pending data
          localStorage.removeItem('pendingServiceSelection');
          localStorage.removeItem('redirectAfterLogin');
          
          // Navigate to booking with the selected service
          navigate(`${redirectAfterLogin}?service=${encodeURIComponent(pendingService)}`);
        } else {
          // Normal flow - go to dashboard
          navigate('/user/dashboard');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Add small delay to prevent white screen flashing
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Register user via backend API
      const response = await authService.register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });
      
      // Store ONLY auth token and minimal session data (clear localStorage dependency)
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('userType', response.user.role || 'user');
      localStorage.setItem('userId', response.user._id);
      localStorage.setItem('userName', response.user.name);
      localStorage.setItem('userEmail', response.user.email);
      localStorage.setItem('userPhone', response.user.phone || '');
      
      // Set session using sessionManager
      sessionManager.setLogin('user', response.user.email, response.user.name);
      
      // Force a small delay before navigation on mobile to prevent white screen
      if (isMobile) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      // Check for pending service selection and redirect
      const pendingService = localStorage.getItem('pendingServiceSelection');
      const redirectAfterLogin = localStorage.getItem('redirectAfterLogin');
      
      if (pendingService && redirectAfterLogin) {
        // Clear the pending data
        localStorage.removeItem('pendingServiceSelection');
        localStorage.removeItem('redirectAfterLogin');
        
        // Navigate to booking with the selected service
        navigate(`${redirectAfterLogin}?service=${encodeURIComponent(pendingService)}`);
      } else {
        // New signup → go to booking page to create first booking
        navigate('/booking');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError(error.message || 'An error occurred during signup. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold" style={{ color: '#dc2626' }}>
            {isSignup ? 'Create Account' : 'Login'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isSignup ? 'Sign up to book services' : 'Access your account'}
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={isSignup ? handleSignup : handleLogin}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            {isSignup && (
              <>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required={isSignup}
                    value={formData.name || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                    placeholder="Enter your name"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required={isSignup}
                    value={formData.phone || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                    placeholder="Enter your phone number"
                  />
                </div>
              </>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="your@email.com"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="Enter password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#dc2626' }}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {isSignup ? 'Signing up...' : 'Logging in...'}
                </div>
              ) : (
                isSignup ? 'Sign Up' : 'Login'
              )}
            </button>
          </div>
          
          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignup(!isSignup);
                setError('');
              }}
              className="text-sm" style={{ color: '#dc2626' }}
            >
              {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign up"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Login;

