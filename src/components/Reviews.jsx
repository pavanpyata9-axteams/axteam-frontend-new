import { useState, useEffect } from 'react';
import { reviewService } from '../services/reviewService';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const response = await reviewService.getHomepageReviews(6);
      setReviews(response.data || []);
    } catch (error) {
      console.error('Failed to load reviews:', error);
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
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading reviews...</p>
          </div>
        </div>
      </section>
    );
  }

  if (reviews.length === 0) {
    return null; // Don't show section if no reviews
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Read authentic reviews from our satisfied customers across various home services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <div key={review._id || index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex">
                  {renderStars(review.rating)}
                </div>
                <span className="ml-2 text-gray-600 font-medium">
                  {review.rating}/5
                </span>
              </div>

              {/* Review Text */}
              <p className="text-gray-700 mb-4 italic">
                "{review.feedback}"
              </p>

              {/* Customer Info */}
              <div className="border-t pt-4">
                <p className="font-semibold text-gray-900">
                  {review.customerName}
                </p>
                <p className="text-sm text-gray-600">
                  {review.serviceName} • {review.serviceCategory}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(review.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>

              {/* Admin Reply */}
              {review.adminReply && review.adminReply.text && (
                <div className="mt-4 p-3 bg-red-50 rounded-lg border-l-4 border-red-600">
                  <p className="text-sm font-medium text-red-800 mb-1">
                    Response from AX Team:
                  </p>
                  <p className="text-sm text-red-700">
                    {review.adminReply.text}
                  </p>
                  {review.adminReply.repliedAt && (
                    <p className="text-xs text-red-600 mt-1">
                      {new Date(review.adminReply.repliedAt).toLocaleDateString('en-IN')}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
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

export default Reviews;