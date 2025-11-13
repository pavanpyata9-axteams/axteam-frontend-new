import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { sessionManager } from '../utils/sessionManager';
import useDeviceDetection from '../hooks/useDeviceDetection';
import MobileUserDashboard from './mobile/MobileUserDashboard';
import { bookingService } from '../services/bookingService';
import { reviewService } from '../services/reviewService';

const UserDashboard = () => {
  const navigate = useNavigate();
  const device = useDeviceDetection();
  const { isMobile } = device;
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userBookings, setUserBookings] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [reviewData, setReviewData] = useState({ rating: 5, review: '' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initDashboard = async () => {
      try {
        // Add small delay to prevent white screen
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Check session validity
        if (!sessionManager.checkAndAutoLogout(navigate)) {
          setIsLoading(false);
          return;
        }
        
        const userType = localStorage.getItem('userType');
        const name = localStorage.getItem('userName');
        const email = localStorage.getItem('userEmail');
        
        if (userType === 'user' && name && email) {
          setIsAuthenticated(true);
          setUserName(name);
          setUserEmail(email);
          loadBookings();
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Dashboard initialization error:', error);
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };
    
    initDashboard();
  }, [navigate]);

  useEffect(() => {
    // Reload bookings whenever userBookings changes or component mounts
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      // ✅ FORCE REFRESH: Always fetch from backend database
      const stored = JSON.parse(localStorage.getItem('axteamAuth') || '{}');
      const token = stored?.token;
      const user = stored?.user;
      
      console.log('🔍 [UserDashboard] Loading fresh bookings from backend...');
      console.log('🔍 [UserDashboard] Auth check:', { 
        hasToken: !!token, 
        hasUser: !!user, 
        userId: user?._id 
      });
      
      if (!user || !user._id || !token) {
        console.error('❌ [UserDashboard] Invalid auth state - redirecting to login');
        navigate('/login');
        return;
      }
      
      console.log('🔍 [UserDashboard] Fetching bookings for userId:', user._id);
      
      // ✅ FORCE FRESH API CALL: Direct fetch to ensure no caching
      const response = await api.get(`/bookings/user/${user._id}`);

      const data = response.data;
      console.log('📊 [UserDashboard] Fresh backend response:', data);
      
      if (data.success && data.data.bookings) {
        const backendBookings = data.data.bookings.map(booking => ({
          id: booking._id,
          bookingId: booking.bookingId,
          services: booking.services.map(s => s.serviceName),
          name: booking.name,
          email: booking.email,
          phone: booking.phone,
          address: booking.address.street,
          city: booking.address.city,
          area: booking.address.area || '',
          pincode: booking.address.pincode,
          workDescription: booking.workDescription,
          preferredDate: new Date(booking.date).toISOString().split('T')[0],
          preferredTime: booking.time,
          status: booking.status,
          date: new Date(booking.createdAt).toLocaleDateString(),
          createdAt: booking.createdAt,
          technicianName: booking.technician?.name,
          technicianPhone: booking.technician?.phone,
          technicianEmail: booking.technician?.email,
          estimatedCost: booking.estimatedCost,
          actualCost: booking.actualCost,
          rating: booking.rating,
          feedback: booking.feedback,
          userRating: booking.rating,
          userReview: booking.feedback,
          adminReply: booking.adminReply,
          adminReplyDate: booking.adminReplyDate,
          reviewDate: booking.feedback ? new Date(booking.createdAt).toLocaleDateString() : null
        }));
        
        // Sort by creation date descending (newest first)
        backendBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        console.log('✅ Loaded', backendBookings.length, 'bookings from backend');
        setUserBookings(backendBookings);
      } else {
        console.log('📝 No bookings found in backend');
        setUserBookings([]);
      }
      
    } catch (error) {
      console.error('❌ Error loading bookings from backend:', error);
      console.error('❌ Error details:', {
        status: error.status,
        message: error.message,
        response: error.response
      });
      
      setUserBookings([]);
      
      // Show detailed error message
      let errorMessage = 'Unable to load your bookings. ';
      if (error.message?.includes('User ID is required')) {
        errorMessage += 'Please log in again.';
        setTimeout(() => navigate('/login'), 2000);
      } else if (error.message?.includes('Network Error') || error.message?.includes('ECONNREFUSED')) {
        errorMessage += 'Please check if the server is running and try again.';
      } else if (error.status === 401 || error.message?.includes('Authentication')) {
        errorMessage += 'Please log in again.';
        setTimeout(() => navigate('/login'), 2000);
      } else if (error.status === 403) {
        errorMessage += 'Access denied. Please contact support.';
      } else {
        errorMessage += 'Please try again. If the problem persists, contact support.';
      }
      
      alert(errorMessage);
    }
  };

  const handleRefresh = () => {
    loadBookings();
    alert('Data refreshed successfully!');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        console.log('🗑️ Deleting booking from backend:', id);
        await bookingService.deleteBooking(id);
        console.log('✅ Booking deleted successfully from backend');
        
        // Refresh bookings from backend
        await loadBookings();
        alert('Booking deleted successfully!');
      } catch (error) {
        console.error('❌ Failed to delete booking:', error);
        alert(`Failed to delete booking: ${error.message || 'Unknown error'}`);
      }
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
      console.log('⭐ Submitting review to backend:', {
        bookingId: selectedBooking.id,
        rating: reviewData.rating,
        feedback: reviewData.review
      });

      // Create review using the new review service
      await reviewService.createReview({
        bookingId: selectedBooking.id,
        rating: reviewData.rating,
        feedback: reviewData.review
      });

      console.log('✅ Review submitted successfully to backend');
      
      // Refresh bookings from backend to show updated review
      await loadBookings();
      setShowReviewModal(false);
      alert('Thank you for your review! It will be displayed on our website.');
    } catch (error) {
      console.error('❌ Failed to submit review:', error);
      alert(`Failed to submit review: ${error.message || 'Unknown error'}`);
    }
  };

  const pendingBookings = userBookings.filter(b => b.status === 'Pending' || b.status === 'Confirmed');
  const completedBookings = userBookings.filter(b => b.status === 'Completed');

  // Show loading state
  if (isLoading || !device.isInitialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
          <p className="text-gray-400 text-sm mt-2">Detecting device type...</p>
        </div>
      </div>
    );
  }

  // Use mobile version for mobile devices (only after device detection is initialized)
  if (isMobile && device.isInitialized) {
    console.log('Switching to mobile dashboard for mobile device');
    return <MobileUserDashboard />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold" style={{ color: '#dc2626' }}>
                My Dashboard
              </h1>
              <p className="text-gray-600">Welcome back, {userName}!</p>
              <p className="text-xs text-gray-400">{userEmail}</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleRefresh}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                🔄 Refresh
              </button>
              <button
                onClick={() => navigate('/booking')}
                className="px-4 py-2 rounded-md text-white hover:opacity-90"
                style={{ backgroundColor: '#dc2626' }}
              >
                New Booking
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Total Bookings</h3>
            <p className="text-3xl font-bold" style={{ color: '#dc2626' }}>{userBookings.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Pending Works</h3>
            <p className="text-3xl font-bold text-yellow-600">{pendingBookings.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Completed</h3>
            <p className="text-3xl font-bold text-green-600">{completedBookings.length}</p>
          </div>
        </div>

        {/* Pending Works Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">⏳ Pending Works</h2>
          </div>
          
          {pendingBookings.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 mb-4">No pending works</p>
            </div>
          ) : (
            <div className="overflow-x-auto text-xs md:text-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Services</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Technician</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap font-medium text-primary-600">
                        {booking.bookingId || `#${booking.id}`}
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        {booking.services ? (
                          <div className="space-y-1">
                            {booking.services.map((service, index) => (
                              <div key={index} className="text-sm text-gray-900 bg-gray-50 px-2 py-1 rounded">
                                {service}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-900">{booking.service}</span>
                        )}
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-gray-500">
                        <div>
                          <div>{booking.preferredDate || booking.date}</div>
                          {booking.preferredTime && (
                            <div className="text-xs text-gray-400">{booking.preferredTime}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          booking.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                        {booking.technician?.name ? (
                          <div>
                            <p className="font-medium text-gray-900">{booking.technician.name}</p>
                            {booking.technician.phone && (
                              <a href={`tel:${booking.technician.phone}`} className="text-blue-600 hover:underline">
                                📞 {booking.technician.phone}
                              </a>
                            )}
                            {booking.technician.email && (
                              <div className="text-sm text-gray-600">
                                📧 {booking.technician.email}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">Waiting for assignment</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleDelete(booking.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Tracking List / Completed Works */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">✅ Completed Works</h2>
          </div>
          
          {completedBookings.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No completed works yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Services</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Preferred Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Technician</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {completedBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-600">
                        {booking.bookingId || `#${booking.id}`}
                      </td>
                      <td className="px-6 py-4">
                        {booking.services ? (
                          <div className="space-y-1">
                            {booking.services.map((service, index) => (
                              <div key={index} className="text-sm text-gray-900 bg-gray-50 px-2 py-1 rounded">
                                {service}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-900">{booking.service}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>
                          <div>{booking.preferredDate || booking.date}</div>
                          {booking.preferredTime && (
                            <div className="text-xs text-gray-400">{booking.preferredTime}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Completed
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {booking.technician?.name ? (
                          <div>
                            <p className="font-medium text-gray-900">{booking.technician.name}</p>
                            {booking.technician.phone && (
                              <a href={`tel:${booking.technician.phone}`} className="text-blue-600 hover:underline">
                                📞 {booking.technician.phone}
                              </a>
                            )}
                            {booking.technician.email && (
                              <div className="text-sm text-gray-600">
                                📧 {booking.technician.email}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">Not assigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex flex-col gap-2">
                          {booking.userRating ? (
                            <div className="text-sm">
                              <div className="flex items-center gap-1 mb-1">
                                <span className="text-yellow-500">
                                  {[...Array(5)].map((_, i) => (
                                    <span key={i}>{i < booking.userRating ? '⭐' : '☆'}</span>
                                  ))}
                                </span>
                                <span className="text-gray-600">({booking.userRating}/5)</span>
                              </div>
                              <p className="text-xs text-gray-500 italic">"{booking.userReview}"</p>
                              <p className="text-xs text-gray-400">Reviewed on {booking.reviewDate}</p>
                              {booking.adminReply && (
                                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                                  <p className="text-xs text-red-700 font-medium mb-1">AX Team Reply:</p>
                                  <p className="text-xs text-red-600">"{booking.adminReply}"</p>
                                  {booking.adminReplyDate && (
                                    <p className="text-xs text-red-500 mt-1">
                                      Replied on {booking.adminReplyDate}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          ) : (
                            <button
                              onClick={() => handleReview(booking)}
                              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                            >
                              ⭐ Rate & Review
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(booking.id)}
                            className="text-red-600 hover:text-red-800 font-medium text-sm"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl">
            <div className="flex items-center justify-between border-b p-5">
              <h3 className="text-2xl font-bold text-gray-800">Rate & Review</h3>
              <button onClick={() => setShowReviewModal(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <p className="text-lg font-semibold text-gray-800 mb-2">{selectedBooking.service}</p>
                <p className="text-sm text-gray-600">Completed on {selectedBooking.date}</p>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <div className="flex gap-2">
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
                <p className="text-sm text-gray-500 mt-1">{reviewData.rating} out of 5 stars</p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
                <textarea
                  value={reviewData.review}
                  onChange={(e) => setReviewData({ ...reviewData, review: e.target.value })}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Tell us about your experience. What went well? What could be improved?"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={submitReview}
                  className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                >
                  Submit Review
                </button>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
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

export default UserDashboard;


