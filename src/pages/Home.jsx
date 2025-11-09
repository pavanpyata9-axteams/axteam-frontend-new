import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import OurServices from '../components/OurServices';
import { reviewService } from '../services/reviewService';

const Home = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);

  // Fallback reviews for when no real reviews exist
  const fallbackReviews = [
    { customerName: "User 1", feedback: "Excellent service! Very professional team.", rating: 5 },
    { customerName: "User 2", feedback: "Quick response and great work quality.", rating: 5 },
    { customerName: "User 3", feedback: "Highly recommend AX Team for home services.", rating: 5 },
    { customerName: "User 4", feedback: "Professional and reliable service.", rating: 4 },
    { customerName: "User 5", feedback: "Great experience with AC repair service.", rating: 5 }
  ];

  // Load gallery data
  useEffect(() => {
    const loadData = () => {
      const savedGallery = JSON.parse(localStorage.getItem('galleryImages') || '[]');
      setGalleryItems(savedGallery);
    };

    loadData();
    const onStorage = (e) => {
      if (e.key === 'bookings' || e.key === 'galleryImages') {
        loadData();
      }
    };
    window.addEventListener('storage', onStorage);
    const refresh = setInterval(loadData, 10000); // refresh every 10s
    return () => {
      window.removeEventListener('storage', onStorage);
      clearInterval(refresh);
    };
  }, []);

  // Load reviews from API
  useEffect(() => {
    const loadReviews = async () => {
      try {
        setIsLoadingReviews(true);
        const response = await reviewService.getHomepageReviews(10);
        if (response.success && response.data && response.data.length > 0) {
          setReviews(response.data);
        } else {
          // Use fallback reviews if no real reviews exist
          setReviews(fallbackReviews);
        }
      } catch (error) {
        console.error('Failed to load reviews:', error);
        // Use fallback reviews on error
        setReviews(fallbackReviews);
      } finally {
        setIsLoadingReviews(false);
      }
    };

    loadReviews();
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


  // Refresh on focus/visibility change for immediate updates when returning to the tab
  useEffect(() => {
  }, []);

  const features = [
    { icon: '⚡', title: 'Fast Service', desc: 'Quick response time' },
    { icon: '💰', title: 'Affordable', desc: 'Competitive pricing' },
    { icon: '✅', title: 'Trusted', desc: 'Licensed professionals' },
    { icon: '📞', title: '24/7 Support', desc: 'Always available' },
  ];

  const currentItem = galleryItems[currentIndex] || null;

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-20 border-b border-gray-200 overflow-hidden">
        {/* Video Background */}
        <video
          className="absolute top-0 left-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/assets/videos/expert-home-services.mp4" type="video/mp4" />
        </video>
        
        {/* Overlay for better text readability */}
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40"></div>
        
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 fade-in text-white drop-shadow-lg">
            Your One-Stop Solution<br />for Every Home Service
          </h1>
          <p className="text-xl mb-8 text-white max-w-2xl mx-auto drop-shadow-md">
            Professional, reliable, and affordable services for your home and business needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-colors duration-200 text-lg shadow-md"
              style={{ backgroundColor: '#dc2626' }}
            >
              Book a Service
            </Link>
            <Link
              to="/services"
              className="bg-white border-2 px-8 py-3 rounded-lg font-semibold transition-colors duration-200 text-lg"
              style={{ borderColor: '#dc2626', color: '#dc2626' }}
              onMouseEnter={(e) => { e.target.style.backgroundColor = '#dc2626'; e.target.style.color = 'white'; }}
              onMouseLeave={(e) => { e.target.style.backgroundColor = 'white'; e.target.style.color = '#dc2626'; }}
            >
              Explore Services
            </Link>
            <a
              href="tel:+919505909059"
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200 text-lg shadow-md inline-block"
            >
              📞 Call Now
            </a>
          </div>
        </div>
      </section>

      {/* Gallery Carousel Section */}
      {galleryItems.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Our Recent Works</h2>
            <div className="relative bg-white rounded-xl shadow-lg overflow-hidden h-64 sm:h-96 lg:h-[500px]">
              {currentItem && (
                <>
                  {currentItem.mediaType === 'video' ? (
                    <video
                      src={currentItem.mediaData}
                      className="w-full h-full object-cover"
                      autoPlay
                      loop
                      muted
                    />
                  ) : currentItem.mediaData ? (
                    <img
                      src={currentItem.mediaData}
                      alt={currentItem.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-8xl">
                      {currentItem.emoji || '📸'}
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8 text-white">
                    <h3 className="text-3xl font-bold mb-2">{currentItem.title}</h3>
                    <p className="text-lg">{currentItem.category || 'Our Work'}</p>
                  </div>
                </>
              )}
              {galleryItems.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {galleryItems.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-3 h-3 rounded-none transition-all ${
                        index === currentIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
            <div className="text-center mt-8">
              <Link
                to="/gallery"
                className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors duration-200 inline-block"
              >
                View Full Gallery
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Our Services Section */}
      <OurServices />

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Why Choose AX Team?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 hover-lift">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-center mb-6" style={{ color: '#dc2626' }}>Ready to Get Started?</h2>
          <p className="text-xl text-center mb-8 text-gray-600">
            Contact us today for a free quote and experience the AX Team difference
          </p>
          <div className="text-center">
            <Link
              to="/login"
              className="text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-colors duration-200 inline-block text-lg shadow-md"
              style={{ backgroundColor: '#dc2626' }}
            >
              Book Now
            </Link>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section with Infinite Scroll */}
      <section className="py-16 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Read authentic reviews from our satisfied customers across various home services.
            </p>
          </div>

          {/* Loading state */}
          {isLoadingReviews && (
            <div className="flex justify-center items-center py-12">
              <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-3 text-gray-600">Loading reviews...</span>
            </div>
          )}

          {/* Infinite Scrolling Reviews */}
          {!isLoadingReviews && (
            <div className="review-carousel-container">
              <div className="review-carousel-track">
                {/* First set of reviews */}
                {reviews?.map((review, index) => (
                  <div key={`review-1-${index}`} className="review-card">
                    <div className="bg-white rounded-lg shadow-md p-6 h-full">
                      {/* Star Rating */}
                      <div className="flex items-center mb-4">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < (review.rating || 5) ? 'text-yellow-500' : 'text-gray-300'}>
                              ⭐
                            </span>
                          ))}
                        </div>
                        <span className="ml-2 text-gray-600 font-medium">
                          {review.rating || 5}/5
                        </span>
                      </div>

                      {/* Review Text */}
                      <p className="text-gray-700 mb-4 italic">
                        "{review.feedback || review.review || 'Great service!'}"
                      </p>

                      {/* Customer Info */}
                      <div className="border-t pt-4">
                        <p className="font-semibold text-gray-900">
                          {review.customerName || review.name || 'Satisfied Customer'}
                        </p>
                        <p className="text-sm text-gray-600">
                          User • AX Team Service
                        </p>
                        {review.serviceName && (
                          <p className="text-xs text-gray-500 mt-1">
                            {review.serviceName}
                          </p>
                        )}
                      </div>

                      {/* Admin Reply */}
                      {review.adminReply?.text && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg border-l-4 border-red-500">
                          <p className="text-xs text-gray-500 mb-1 font-medium">AX Team Reply:</p>
                          <p className="text-sm text-gray-700">{review.adminReply.text}</p>
                          {review.adminReply.repliedAt && (
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(review.adminReply.repliedAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {/* Duplicate set for seamless loop */}
                {reviews?.map((review, index) => (
                  <div key={`review-2-${index}`} className="review-card">
                    <div className="bg-white rounded-lg shadow-md p-6 h-full">
                      {/* Star Rating */}
                      <div className="flex items-center mb-4">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < (review.rating || 5) ? 'text-yellow-500' : 'text-gray-300'}>
                              ⭐
                            </span>
                          ))}
                        </div>
                        <span className="ml-2 text-gray-600 font-medium">
                          {review.rating || 5}/5
                        </span>
                      </div>

                      {/* Review Text */}
                      <p className="text-gray-700 mb-4 italic">
                        "{review.feedback || review.review || 'Great service!'}"
                      </p>

                      {/* Customer Info */}
                      <div className="border-t pt-4">
                        <p className="font-semibold text-gray-900">
                          {review.customerName || review.name || 'Satisfied Customer'}
                        </p>
                        <p className="text-sm text-gray-600">
                          User • AX Team Service
                        </p>
                        {review.serviceName && (
                          <p className="text-xs text-gray-500 mt-1">
                            {review.serviceName}
                          </p>
                        )}
                      </div>

                      {/* Admin Reply */}
                      {review.adminReply?.text && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg border-l-4 border-red-500">
                          <p className="text-xs text-gray-500 mb-1 font-medium">AX Team Reply:</p>
                          <p className="text-sm text-gray-700">{review.adminReply.text}</p>
                          {review.adminReply.repliedAt && (
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(review.adminReply.repliedAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Call to Action */}
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              Have you used our services? We'd love to hear from you!
            </p>
            <button
              onClick={() => window.location.href = '/booking'}
              className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Book a Service
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

