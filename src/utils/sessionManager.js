// ✅ REFACTORED Session Management Utility
// Handles proper authentication with database integration

const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds (extended for better UX)

export const sessionManager = {
  // ✅ REFACTORED: Set login session with proper axteamAuth structure
  setLogin: (userType, userEmail, userName, userId, token) => {
    const loginTime = Date.now();
    
    // Primary auth structure (as per prompt requirements)
    const axteamAuth = {
      token: token,
      user: {
        _id: userId,
        name: userName,
        email: userEmail,
        role: userType
      },
      loginTime: loginTime
    };
    
    localStorage.setItem('axteamAuth', JSON.stringify(axteamAuth));
    
    // Backward compatibility items
    localStorage.setItem('userType', userType);
    localStorage.setItem('userEmail', userEmail);
    localStorage.setItem('userName', userName);
    localStorage.setItem('userId', userId);
    localStorage.setItem('authToken', token);
    localStorage.setItem('loginTime', loginTime.toString());
    
    console.log('✅ [sessionManager] Login session created:', { userType, userName, userId });
  },

  // Check if session is still valid
  isSessionValid: () => {
    const loginTime = localStorage.getItem('loginTime');
    if (!loginTime) return false;
    
    const currentTime = Date.now();
    const sessionAge = currentTime - parseInt(loginTime);
    
    return sessionAge < SESSION_DURATION;
  },

  // Get remaining session time in seconds
  getRemainingTime: () => {
    const loginTime = localStorage.getItem('loginTime');
    if (!loginTime) return 0;
    
    const currentTime = Date.now();
    const sessionAge = currentTime - parseInt(loginTime);
    const remaining = SESSION_DURATION - sessionAge;
    
    return Math.max(0, Math.floor(remaining / 1000));
  },

  // Refresh session (reset timer)
  refreshSession: () => {
    const userType = localStorage.getItem('userType');
    if (userType) {
      localStorage.setItem('loginTime', Date.now().toString());
    }
  },

  // ✅ REFACTORED: Clear session and logout
  clearSession: () => {
    // Clear primary auth structure
    localStorage.removeItem('axteamAuth');
    
    // Clear backward compatibility items
    localStorage.removeItem('userType');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    localStorage.removeItem('authToken');
    localStorage.removeItem('loginTime');
    
    console.log('🧹 [sessionManager] Session cleared');
  },

  // Check and auto-logout if session expired
  checkAndAutoLogout: (navigate) => {
    if (!sessionManager.isSessionValid()) {
      sessionManager.clearSession();
      if (navigate) {
        navigate('/login');
      }
      return false;
    }
    return true;
  }
};

export default sessionManager;