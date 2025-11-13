import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { sessionManager } from '../../utils/sessionManager';

const MobileNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/about', label: 'About', icon: 'ℹ️' },
    { path: '/services', label: 'Services', icon: '🔧' },
    { path: '/gallery', label: 'Gallery', icon: '📸' },
    { path: '/support', label: 'Support', icon: '💬' },
  ];

  useEffect(() => {
    const checkAuth = () => {
      const userType = localStorage.getItem('userType');
      const isValidSession = sessionManager.isSessionValid();
      setIsLoggedIn(userType === 'user' && isValidSession);
    };
    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  useEffect(() => {
    const userType = localStorage.getItem('userType');
    const isValidSession = sessionManager.isSessionValid();
    setIsLoggedIn(userType === 'user' && isValidSession);
  }, [location.pathname]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('.mobile-nav-container')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('touchstart', handleClickOutside);
    return () => document.removeEventListener('touchstart', handleClickOutside);
  }, [isMenuOpen]);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 mobile-nav-container" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      <div className="px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo - Enhanced for mobile */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/assets/icons/axteam-logo.jpg" 
              alt="AX Team" 
              className="h-12 w-auto object-contain"
            />
            <div className="brand-text" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '20px',
              fontWeight: '700',
              lineHeight: '1'
            }}>
              <span className="text-gray-900">AX</span>
              <span className="text-red-600">TEAM</span>
            </div>
          </Link>

          {/* Right side - User icon + Menu button */}
          <div className="flex items-center gap-3">
            {/* User Icon (if logged in) */}
            {isLoggedIn && (
              <Link
                to="/user/dashboard"
                className="w-9 h-9 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center border border-primary-200 active:bg-primary-100"
                title="My Account"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
            )}

            {/* Hamburger Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-10 h-10 flex items-center justify-center text-gray-700 hover:text-primary-600 focus:outline-none active:bg-gray-100 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-down Menu */}
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
        isMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="bg-gray-50 border-t border-gray-200">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'text-primary-600 bg-primary-50 border border-primary-200'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-white active:bg-gray-100'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="text-lg">{link.icon}</span>
                {link.label}
              </Link>
            ))}
            
            {/* Login/Dashboard Link */}
            {isLoggedIn ? (
              <Link
                to="/user/dashboard"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-primary-600 bg-primary-50 border border-primary-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="text-lg">👤</span>
                My Account
              </Link>
            ) : (
              <Link
                to="/login"
                className="flex items-center justify-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-700 active:bg-primary-800 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="text-lg">📋</span>
                Book Now
              </Link>
            )}

            {/* Quick Call Button - Enhanced visibility */}
            <a
              href="tel:+919505909059"
              className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-4 rounded-xl font-bold text-lg hover:bg-green-700 active:bg-green-800 transition-colors shadow-lg border-2 border-green-500"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="text-xl animate-pulse">📞</span>
              Call Now - 9505909059
            </a>
            
            {/* WhatsApp Button - Additional contact option */}
            <a
              href="https://wa.me/919505909059"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-green-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-600 active:bg-green-700 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="text-lg">💬</span>
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MobileNavbar;