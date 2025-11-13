import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import MobileOurServices from '../../components/mobile/MobileOurServices';
import { reviewService } from '../../services/reviewService';

const MobileHome = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [reviewIndex, setReviewIndex] = useState(0);

  useEffect(() => {
    const loadData = () => {
      const savedGallery = JSON.parse(localStorage.getItem('galleryImages') || '[]');
      setGalleryItems(savedGallery);
    };

    loadData();
    const onStorage = (e) => {
      if (e.key === 'galleryImages') {
        loadData();
      }
    };
    window.addEventListener('storage', onStorage);
    const refresh = setInterval(loadData, 10000);
    return () => {
      window.removeEventListener('storage', onStorage);
      clearInterval(refresh);
    };
  }, []);

  // Load reviews from API
  useEffect(() => {
    const loadReviews = async () => {
      try {
        const response = await reviewService.getHomepageReviews(8);
        if (response.success && response.data && response.data.length > 0) {
          const reviewList = response.data.map(review => ({
            name: review.customerName || 'Customer',
            role: review.serviceName || 'Service',
            text: review.feedback,
            rating: review.rating,
            date: new Date(review.createdAt).toLocaleDateString(),
            adminReply: review.adminReply?.text,
            adminReplyDate: review.adminReply?.repliedAt ? new Date(review.adminReply.repliedAt).toLocaleDateString() : null,
          }));
          setReviews(reviewList);
        } else {
          // Keep reviews empty if no real reviews exist - will show default testimonial
          setReviews([]);
        }
      } catch (error) {
        console.error('Failed to load reviews:', error);
        // Keep reviews empty on error - will show default testimonial
        setReviews([]);
      }
    };

    loadReviews();
    
    // Refresh reviews every 30 seconds
    const reviewRefresh = setInterval(loadReviews, 30000);
    return () => clearInterval(reviewRefresh);
  }, []);

  // Auto-rotate gallery every 5 seconds
  useEffect(() => {
    if (galleryItems.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % galleryItems.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [galleryItems.length]);

  // Auto-rotate reviews every 8 seconds (faster for mobile)
  useEffect(() => {
    if (reviews.length > 0) {
      const interval = setInterval(() => {
        setReviewIndex((prev) => (prev + 1) % reviews.length);
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [reviews.length]);

  const testimonials = reviews.length > 0 ? reviews : [
    { name: 'Happy Customer', role: 'AX Team Service', text: 'Great service and quick support!', rating: 5 },
  ];

  const features = [
    { icon: '⚡', title: 'Fast Service', desc: 'Quick response' },
    { icon: '💰', title: 'Affordable', desc: 'Great pricing' },
    { icon: '✅', title: 'Trusted', desc: 'Licensed pros' },
    { icon: '📞', title: '24/7 Support', desc: 'Always here' },
  ];

  const currentItem = galleryItems[currentIndex] || null;
  const currentReview = testimonials[reviewIndex] || testimonials[0];

  return (
    <div className="bg-white">
      {/* Mobile Hero Section - Optimized for small screens */}
      <section className="relative py-12 px-4 text-center overflow-hidden">
        {/* Video Background - Mobile Optimized */}
        <video
          className="absolute top-0 left-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
        >
          <source src="/assets/videos/expert-home-services.mp4" type="video/mp4" />
        </video>
        
        {/* Overlay for better text readability on mobile */}
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50"></div>
        
        {/* Content */}
        <div className="relative z-10 max-w-sm mx-auto">
          <h1 className="text-3xl font-bold mb-4 leading-tight text-white drop-shadow-lg">
            Your One-Stop Solution for Every Home Service
          </h1>
          <p className="text-base mb-6 text-white leading-relaxed drop-shadow-md">
            Professional, reliable, and affordable services for your home needs
          </p>
          
          {/* Mobile-optimized CTA buttons - Stacked */}
          <div className="space-y-3">
            <Link
              to="/login"
              className="block w-full text-white px-6 py-4 rounded-xl font-semibold hover:opacity-90 active:scale-95 transition-all duration-200 text-base shadow-lg"
              style={{ backgroundColor: '#dc2626' }}
            >
              📋 Book a Service
            </Link>
            <Link
              to="/services"
              className="block w-full bg-white border-2 px-6 py-4 rounded-xl font-semibold transition-all duration-200 text-base active:scale-95"
              style={{ borderColor: '#dc2626', color: '#dc2626' }}
            >
              🔧 Explore Services
            </Link>
            <a
              href="tel:+919505909059"
              className="block w-full bg-green-600 text-white px-6 py-4 rounded-xl font-semibold hover:bg-green-700 active:bg-green-800 active:scale-95 transition-all duration-200 text-base shadow-lg"
            >
              📞 Call Now
            </a>
          </div>
        </div>
      </section>

      {/* Mobile Gallery Section - Compact */}
      {galleryItems.length > 0 && (
        <section className="py-12 bg-gray-50 px-4">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Our Recent Works</h2>
          <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden h-48 max-w-sm mx-auto">
            {currentItem && (
              <>
                {currentItem.mediaType === 'video' ? (
                  <video
                    src={currentItem.mediaData}
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                ) : currentItem.mediaData ? (
                  <img
                    src={currentItem.mediaData}
                    alt={currentItem.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-6xl">
                    {currentItem.emoji || '📸'}
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                  <h3 className="text-lg font-bold mb-1">{currentItem.title}</h3>
                  <p className="text-sm">{currentItem.category || 'Our Work'}</p>
                </div>
              </>
            )}
            {galleryItems.length > 1 && (
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                {galleryItems.slice(0, Math.min(5, galleryItems.length)).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-1 h-1 rounded-none transition-all ${
                      index === currentIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                    aria-label={`View image ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="text-center mt-6">
            <Link
              to="/gallery"
              className="bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 active:bg-primary-800 active:scale-95 transition-all duration-200 inline-block"
            >
              View Gallery
            </Link>
          </div>
        </section>
      )}

      {/* Our Services Section - Mobile */}
      <MobileOurServices />

      {/* Why Choose Us - Mobile Grid */}
      <section className="py-12 bg-white px-4">
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">Why Choose AX Team?</h2>
        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-4 bg-gray-50 rounded-xl active:bg-gray-100 transition-colors">
              <div className="text-3xl mb-2">{feature.icon}</div>
              <h3 className="text-sm font-semibold mb-1">{feature.title}</h3>
              <p className="text-xs text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mobile Testimonials - Single review display */}
      <section className="py-12 bg-gray-50 px-4">
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">What Customers Say</h2>
        {currentReview && (
          <div className="bg-white p-6 rounded-2xl shadow-md max-w-sm mx-auto">
            <div className="flex mb-3 justify-center">
              {[...Array(currentReview.rating || 0)].map((_, i) => (
                <span key={i} className="text-yellow-400 text-lg">⭐</span>
              ))}
            </div>
            <p className="text-gray-700 mb-4 italic text-center text-sm leading-relaxed">
              "{currentReview.text}"
            </p>
            <div className="text-center">
              <p className="font-semibold text-gray-800">{currentReview.name}</p>
              <p className="text-sm text-gray-500">{currentReview.role}</p>
              {currentReview.date && <p className="text-xs text-gray-400 mt-1">{currentReview.date}</p>}
            </div>
            {currentReview.adminReply && (
              <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Admin reply:</p>
                <p className="text-xs text-gray-700">{currentReview.adminReply}</p>
                {currentReview.adminReplyDate && (
                  <p className="text-xs text-gray-400 mt-1">{currentReview.adminReplyDate}</p>
                )}
              </div>
            )}
          </div>
        )}
        
        {/* Review navigation dots */}
        {testimonials.length > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.slice(0, 5).map((_, i) => (
              <button
                key={i}
                onClick={() => setReviewIndex(i)}
                className={`w-2 h-2 rounded-none transition-all ${reviewIndex === i ? 'bg-gray-800' : 'bg-gray-300'}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* Mobile CTA Section */}
      <section className="py-12 bg-white px-4">
        <div className="text-center max-w-sm mx-auto">
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#dc2626' }}>Ready to Get Started?</h2>
          <p className="text-base mb-6 text-gray-600 leading-relaxed">
            Contact us today for a free quote and experience the AX Team difference
          </p>
          <Link
            to="/login"
            className="block w-full text-white px-6 py-4 rounded-xl font-semibold hover:opacity-90 active:scale-95 transition-all duration-200 text-base shadow-lg"
            style={{ backgroundColor: '#dc2626' }}
          >
            Book Now
          </Link>
        </div>
      </section>

    </div>
  );
};

export default MobileHome;