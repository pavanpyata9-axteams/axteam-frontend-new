import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { sessionManager } from '../../utils/sessionManager';
import { bookingService } from '../../services/bookingService';
import { reviewService } from '../../services/reviewService';

const MobileUserDashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userBookings, setUserBookings] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [reviewData, setReviewData] = useState({ rating: 5, review: '' });
  const [activeTab, setActiveTab] = useState('pending');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const initMobileDashboard = async () => {
      try {
        console.log('Initializing mobile dashboard...');
        
        // Add delay to prevent white screen
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Check session validity
        if (!sessionManager.checkAndAutoLogout(navigate)) {
          console.log('Session invalid, redirecting to login');
          setIsLoading(false);
          return;
        }
        
        const userType = localStorage.getItem('userType');
        const name = localStorage.getItem('userName');
        const email = localStorage.getItem('userEmail');
        
        console.log('User data:', { userType, name, email });
        
        if (userType === 'user' && name && email) {
          setIsAuthenticated(true);
          setUserName(name);
          setUserEmail(email);
          await loadBookings();
          console.log('Mobile dashboard initialized successfully');
        } else {
          console.log('User not authenticated, redirecting to login');
          navigate('/login');
        }
      } catch (error) {
        console.error('Mobile dashboard initialization error:', error);
        setError('Failed to load dashboard. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    initMobileDashboard();
  }, [navigate]);

  const loadBookings = async () => {
    try {
      console.log('🔄 [MobileUserDashboard] Loading bookings from backend...');
      
      const axteamAuth = JSON.parse(localStorage.getItem('axteamAuth') || '{}');
      const token = axteamAuth.token;
      
      if (!token) {
        console.error('❌ [MobileUserDashboard] No auth token found');
        setUserBookings([]);
        return;
      }

      // Get user ID from auth data (match desktop pattern)
      const user = axteamAuth.user;
      const userId = user?._id; // Use _id as in desktop version
      console.log('🔍 [MobileUserDashboard] Auth data:', axteamAuth);
      console.log('🔍 [MobileUserDashboard] User object:', user);
      console.log('🔍 [MobileUserDashboard] User ID found:', userId);
      
      if (!user || !user._id || !token) {
        console.error('❌ [MobileUserDashboard] Invalid auth state - redirecting to login');
        console.error('❌ [MobileUserDashboard] Auth check:', { 
          hasToken: !!token, 
          hasUser: !!user, 
          userId: user?._id 
        });
        setUserBookings([]);
        return;
      }

      const response = await bookingService.getUserBookings(userId);
      
      if (response.success && response.data && response.data.bookings) {
        console.log('✅ [MobileUserDashboard] Loaded bookings from backend:', response.data.bookings.length);
        setUserBookings(response.data.bookings);
      } else {
        console.error('❌ [MobileUserDashboard] Failed to load bookings:', response);
        setUserBookings([]);
      }
    } catch (error) {
      console.error('❌ [MobileUserDashboard] Error loading bookings:', error);
      setUserBookings([]);
    }
  };

  const handleRefresh = () => {
    loadBookings();
    alert('Data refreshed successfully!');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) {
      return;
    }

    try {
      console.log('🗑️ [MobileUserDashboard] Deleting booking:', id);
      
      const response = await bookingService.deleteBooking(id);
      
      if (response.success) {
        console.log('✅ [MobileUserDashboard] Booking deleted successfully');
        await loadBookings(); // Refresh from backend
        alert('Booking deleted successfully.');
      } else {
        console.error('❌ [MobileUserDashboard] Failed to delete booking:', response);
        alert('Failed to delete booking. Please try again.');
      }
    } catch (error) {
      console.error('❌ [MobileUserDashboard] Error deleting booking:', error);
      alert('Error deleting booking. Please try again.');
    }
  };

  const handleLogout = () => {
    sessionManager.clearSession();
    navigate('/login');
  };

  const handleReview = (booking) => {
    setSelectedBooking(booking);
    setReviewData({ rating: 5, review: '' });
    setShowReviewModal(true);
  };

  const submitReview = async () => {
    if (!selectedBooking || !reviewData.review.trim()) {
      alert('Please write a review');
      return;
    }

    try {
      console.log('⭐ [MobileUserDashboard] Submitting review to backend:', {
        bookingId: selectedBooking._id,
        rating: reviewData.rating,
        feedback: reviewData.review
      });

      // Create review using the new review service
      await reviewService.createReview({
        bookingId: selectedBooking._id,
        rating: reviewData.rating,
        feedback: reviewData.review
      });

      console.log('✅ [MobileUserDashboard] Review submitted successfully');
      
      // Refresh bookings from backend
      await loadBookings();
      setShowReviewModal(false);
      alert('Thank you for your review! It will be displayed on our website.');
    } catch (error) {
      console.error('❌ [MobileUserDashboard] Failed to submit review:', error);
      alert(`Failed to submit review: ${error.message || 'Unknown error'}`);
    }
  };

  const pendingBookings = userBookings.filter(b => b.status === 'Pending' || b.status === 'Confirmed');
  const completedBookings = userBookings.filter(b => b.status === 'Completed');

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your dashboard...</p>
          <p className="text-gray-400 text-sm mt-2">Please wait a moment</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-lg font-bold text-primary-600">My Dashboard</h1>
              <p className="text-sm text-gray-600 truncate">Hi, {userName}!</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleRefresh}
                className="p-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                title="Refresh"
              >
                🔄
              </button>
              <button
                onClick={() => navigate('/booking')}
                className="px-3 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 active:bg-primary-800"
              >
                + New
              </button>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                title="Logout"
              >
                🚪
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="px-4 py-6">
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4 text-center">
            <p className="text-2xl font-bold text-primary-600">{userBookings.length}</p>
            <p className="text-xs text-gray-500 mt-1">Total</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">{pendingBookings.length}</p>
            <p className="text-xs text-gray-500 mt-1">Pending</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{completedBookings.length}</p>
            <p className="text-xs text-gray-500 mt-1">Completed</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-white rounded-lg shadow-sm mb-4 p-1">
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'pending'
                ? 'bg-primary-600 text-white'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            ⏳ Pending ({pendingBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'completed'
                ? 'bg-primary-600 text-white'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            ✅ Completed ({completedBookings.length})
          </button>
        </div>

        {/* Booking Cards */}
        <div className="space-y-4">
          {activeTab === 'pending' ? (
            pendingBookings.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <p className="text-gray-500 mb-4">No pending bookings</p>
                <button
                  onClick={() => navigate('/booking')}
                  className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium"
                >
                  Create New Booking
                </button>
              </div>
            ) : (
              pendingBookings.map((booking) => (
                <div key={booking._id || booking.id} className="bg-white rounded-lg shadow-sm p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-primary-600 mb-1">
                        {booking.bookingId || `#${booking.id}`}
                      </p>
                      <div className="space-y-1">
                        {booking.services ? (
                          Array.isArray(booking.services) ? (
                            booking.services.map((service, index) => (
                              <div key={index} className="text-sm bg-gray-100 px-2 py-1 rounded">
                                {typeof service === 'object' ? service.serviceName || service.name : service}
                              </div>
                            ))
                          ) : (
                            <div className="text-sm bg-gray-100 px-2 py-1 rounded">
                              {typeof booking.services === 'object' ? booking.services.serviceName || booking.services.name : booking.services}
                            </div>
                          )
                        ) : (
                          <p className="text-sm text-gray-800">{booking.service}</p>
                        )}
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      booking.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <span>📅</span>
                      <span>{booking.preferredDate || booking.date}</span>
                      {booking.preferredTime && (
                        <span className="text-xs text-gray-400">({booking.preferredTime})</span>
                      )}
                    </div>
                    
                    {booking.technicianName ? (
                      <div className="flex items-center gap-2">
                        <span>👨‍🔧</span>
                        <span>{booking.technicianName}</span>
                        {booking.technicianPhone && (
                          <a href={`tel:${booking.technicianPhone}`} className="text-primary-600 underline">
                            📞
                          </a>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-gray-400">
                        <span>👨‍🔧</span>
                        <span>Waiting for assignment</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-end mt-3">
                    <button
                      onClick={() => handleDelete(booking._id)}
                      className="text-red-600 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )
          ) : (
            completedBookings.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <p className="text-gray-500">No completed bookings yet</p>
              </div>
            ) : (
              completedBookings.map((booking) => (
                <div key={booking._id || booking.id} className="bg-white rounded-lg shadow-sm p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-primary-600 mb-1">
                        {booking.bookingId || `#${booking.id}`}
                      </p>
                      <div className="space-y-1">
                        {booking.services ? (
                          Array.isArray(booking.services) ? (
                            booking.services.map((service, index) => (
                              <div key={index} className="text-sm bg-gray-100 px-2 py-1 rounded">
                                {typeof service === 'object' ? service.serviceName || service.name : service}
                              </div>
                            ))
                          ) : (
                            <div className="text-sm bg-gray-100 px-2 py-1 rounded">
                              {typeof booking.services === 'object' ? booking.services.serviceName || booking.services.name : booking.services}
                            </div>
                          )
                        ) : (
                          <p className="text-sm text-gray-800">{booking.service}</p>
                        )}
                      </div>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                      Completed
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <span>📅</span>
                      <span>{booking.preferredDate || booking.date}</span>
                    </div>
                    
                    {booking.technicianName && (
                      <div className="flex items-center gap-2">
                        <span>👨‍🔧</span>
                        <span>{booking.technicianName}</span>
                        {booking.technicianPhone && (
                          <a href={`tel:${booking.technicianPhone}`} className="text-primary-600 underline">
                            📞
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Review Section */}
                  {booking.userRating ? (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-1 mb-1">
                        <span className="text-yellow-500">
                          {[...Array(5)].map((_, i) => (
                            <span key={i}>{i < booking.userRating ? '⭐' : '☆'}</span>
                          ))}
                        </span>
                        <span className="text-sm text-gray-600">({booking.userRating}/5)</span>
                      </div>
                      <p className="text-sm text-gray-700 italic">"{booking.userReview}"</p>
                      <p className="text-xs text-gray-400 mt-1">Reviewed on {booking.reviewDate}</p>
                    </div>
                  ) : (
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => handleReview(booking)}
                        className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg text-sm font-medium"
                      >
                        ⭐ Rate & Review
                      </button>
                      <button
                        onClick={() => handleDelete(booking._id)}
                        className="text-red-600 text-sm font-medium px-4"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))
            )
          )}
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between border-b p-4">
              <h3 className="text-lg font-bold text-gray-800">Rate & Review</h3>
              <button onClick={() => setShowReviewModal(false)} className="text-gray-500 hover:text-gray-700 text-xl">✕</button>
            </div>
            <div className="p-4">
              <div className="mb-4">
                <p className="font-medium text-gray-800 mb-1">
                  {selectedBooking.services ? 
                    Array.isArray(selectedBooking.services) ?
                      selectedBooking.services.map(s => typeof s === 'object' ? s.serviceName || s.name : s).join(', ')
                      : (typeof selectedBooking.services === 'object' ? selectedBooking.services.serviceName || selectedBooking.services.name : selectedBooking.services)
                    : selectedBooking.service}
                </p>
                <p className="text-sm text-gray-600">Completed on {selectedBooking.date}</p>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <div className="flex gap-1 justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setReviewData({ ...reviewData, rating: star })}
                      className={`text-3xl ${star <= reviewData.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-1 text-center">{reviewData.rating} out of 5 stars</p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
                <textarea
                  value={reviewData.review}
                  onChange={(e) => setReviewData({ ...reviewData, review: e.target.value })}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  placeholder="Share your experience..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={submitReview}
                  className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700"
                >
                  Submit Review
                </button>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MobileUserDashboard;