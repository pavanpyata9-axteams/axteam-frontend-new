import { Link } from 'react-router-dom';

const MobileFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="px-4 py-8">
        {/* Company Info - Centered for mobile */}
        <div className="text-center mb-8">
          <img 
            src="/axteam-logo.jpg" 
            alt="AX Team Services" 
            className="h-12 w-auto mx-auto mb-4"
          />
          <p className="text-gray-400 text-sm leading-relaxed max-w-sm mx-auto">
            Your trusted partner for all home and business services. Professional, affordable, and reliable solutions.
          </p>
        </div>

        {/* Quick Contact - Touch-optimized buttons */}
        <div className="mb-8 space-y-3">
          <h4 className="text-lg font-semibold text-center mb-4">Quick Contact</h4>
          
          <a 
            href="tel:+919505909059"
            className="flex items-center justify-center gap-3 bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700 active:bg-green-800 transition-colors"
          >
            <span className="text-lg">📞</span>
            Call +919505909059
          </a>
          
          <a 
            href="mailto:teamaxindia@gmail.com"
            className="flex items-center justify-center gap-3 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 active:bg-blue-800 transition-colors"
          >
            <span className="text-lg">📧</span>
            Email Us
          </a>
        </div>

        {/* Quick Links - Grid for mobile */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-center mb-4">Quick Links</h4>
          <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
            <Link 
              to="/" 
              className="text-center py-2 px-4 rounded-lg bg-gray-800 hover:bg-gray-700 active:bg-gray-600 transition-colors text-sm"
            >
              🏠 Home
            </Link>
            <Link 
              to="/about" 
              className="text-center py-2 px-4 rounded-lg bg-gray-800 hover:bg-gray-700 active:bg-gray-600 transition-colors text-sm"
            >
              ℹ️ About
            </Link>
            <Link 
              to="/services" 
              className="text-center py-2 px-4 rounded-lg bg-gray-800 hover:bg-gray-700 active:bg-gray-600 transition-colors text-sm"
            >
              🔧 Services
            </Link>
            <Link 
              to="/gallery" 
              className="text-center py-2 px-4 rounded-lg bg-gray-800 hover:bg-gray-700 active:bg-gray-600 transition-colors text-sm"
            >
              📸 Gallery
            </Link>
            <Link 
              to="/login" 
              className="text-center py-2 px-4 rounded-lg bg-primary-600 hover:bg-primary-700 active:bg-primary-800 transition-colors text-sm col-span-2"
            >
              📋 Book Service
            </Link>
          </div>
        </div>

        {/* Address - Compact for mobile */}
        <div className="text-center mb-6">
          <h4 className="text-base font-semibold mb-3">Visit Us</h4>
          <div className="text-gray-400 text-sm space-y-1">
            <p>📍 High-tech Hyderabad</p>
            <p>Telangana, India 500081</p>
            <p>🕒 Mon-Sat: 8:00 AM - 8:00 PM</p>
          </div>
        </div>

        {/* Social Media - Larger touch targets */}
        <div className="flex justify-center space-x-6 mb-6">
          <a 
            href="#" 
            className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 active:bg-gray-600 transition-colors"
            aria-label="Facebook"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </a>
          <a 
            href="#" 
            className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 active:bg-gray-600 transition-colors"
            aria-label="Twitter"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
          </a>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-6 text-center">
          <p className="text-gray-400 text-sm">&copy; {currentYear} AX Team. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default MobileFooter;