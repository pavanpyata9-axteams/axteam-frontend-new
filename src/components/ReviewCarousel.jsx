import { useState, useEffect } from 'react';
import { reviewService } from '../services/reviewService';

const ReviewCarousel = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      // Get all reviews from the database
      const response = await reviewService.getAllReviews({ limit: 50, approved: true });
      const reviewData = response.data?.reviews || response.reviews || [];
      
      // Filter for approved reviews only
      const approvedReviews = reviewData.filter(review => review.isApproved !== false);
      
      setReviews(approvedReviews);
    } catch (error) {
      console.error('Failed to load reviews:', error);
      // Fallback to homepage reviews if getAllReviews fails
      try {
        const fallbackResponse = await reviewService.getHomepageReviews(10);
        setReviews(fallbackResponse.data || []);
      } catch (fallbackError) {
        console.error('Failed to load fallback reviews:', fallbackError);
        setReviews([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <span key={i} className={i < rating ? 'text-yellow-500' : 'text-gray-300'}>
        ⭐
      </span>
    ));
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading reviews...</p>
          </div>
        </div>
      </section>
    );
  }

  if (reviews.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Be the first to leave a review! Share your experience with AX Team services.
            </p>
            <button
              onClick={() => window.location.href = '/booking'}
              className="mt-6 bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Book a Service
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Duplicate reviews for seamless infinite loop
  const duplicatedReviews = [...reviews, ...reviews];

  return (
    <section className="py-16 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Read authentic reviews from our satisfied customers across various home services.
          </p>
        </div>

        {/* Infinite Scrolling Carousel */}
        <div className="relative">
          <div className="carousel-container">
            <div className="carousel-track">
              {duplicatedReviews.map((review, index) => (
                <div
                  key={`${review._id || review.id || 'review'}-${index}`}
                  className="carousel-item"
                >
                  <div className="bg-white rounded-lg shadow-md p-6 h-full hover:shadow-lg transition-shadow">
                    {/* Star Rating */}
                    <div className="flex items-center mb-4">
                      <div className="flex">
                        {renderStars(review.rating || 5)}
                      </div>
                      <span className="ml-2 text-gray-600 font-medium">
                        {review.rating || 5}/5
                      </span>
                    </div>

                    {/* Review Text */}
                    <p className="text-gray-700 mb-4 italic line-clamp-4">
                      "{review.feedback || review.comment || 'Excellent service! Highly recommended.'}"
                    </p>

                    {/* Customer Info */}
                    <div className="border-t pt-4">
                      <p className="font-semibold text-gray-900">
                        {review.customerName || review.userName || 'Satisfied Customer'}
                      </p>
                      <p className="text-sm text-gray-600">
                        User • {review.serviceName || review.serviceCategory || 'AX Team Service'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {review.createdAt 
                          ? new Date(review.createdAt).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })
                          : 'Recent Review'
                        }
                      </p>
                    </div>

                    {/* Admin Reply (if exists) */}
                    {review.adminReply && review.adminReply.text && (
                      <div className="mt-4 p-3 bg-red-50 rounded-lg border-l-4 border-red-600">
                        <p className="text-sm font-medium text-red-800 mb-1">
                          Response from AX Team:
                        </p>
                        <p className="text-sm text-red-700 line-clamp-2">
                          {review.adminReply.text}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

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
  );
};

export default ReviewCarousel;