import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/services', label: 'Services' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/support', label: 'Support' },
  ];

  useEffect(() => {
    const checkAuth = () => {
      const userType = localStorage.getItem('userType');
      setIsLoggedIn(userType === 'user');
    };
    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  // Re-evaluate auth state on route changes so the icon appears right after login
  useEffect(() => {
    const userType = localStorage.getItem('userType');
    setIsLoggedIn(userType === 'user');
  }, [location.pathname]);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src="/assets/icons/axteam-logo.jpg" 
                alt="AX Team Services" 
                className="max-h-16 md:max-h-20 w-auto object-contain"
              />
              <div className="flex items-center space-x-1">
                <span className="text-2xl font-bold text-gray-900">AX</span>
                <span className="text-2xl font-bold text-red-600">TEAM</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive(link.path)
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-700 hover:text-primary-600'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

              {/* User Icon (only when logged in) */}
              <div className="hidden md:flex items-center gap-4">
                {isLoggedIn && (
                  <Link
                    to="/user/dashboard"
                    className="w-10 h-10 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center border border-primary-100 hover:bg-primary-100"
                    title="My Account"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A9 9 0 1119 12v1a9 9 0 01-13.879 4.804z" />
                    </svg>
                  </Link>
                )}
                {/* CTA Button - Desktop (hidden if logged in) */}
                {!isLoggedIn && (
                  <Link
                    to="/login"
                    className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200"
                  >
                    Book Now
                  </Link>
                )}
              </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-primary-600 focus:outline-none focus:text-primary-600"
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

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50">
                {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(link.path)
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-100'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
                {isLoggedIn && (
                  <Link
                    to="/user/dashboard"
                    className="block px-3 py-2 rounded-md text-base font-medium text-primary-600 bg-primary-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Account
                  </Link>
                )}
                {!isLoggedIn && (
                  <Link
                    to="/login"
                    className="block text-center bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200 mt-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Book Now
                  </Link>
                )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

