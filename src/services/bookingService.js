import api from '../api/axios';

export const bookingService = {
  // Delete booking
  deleteBooking: async (bookingId) => {
    try {
      console.log('🗑️ [bookingService] Deleting booking:', bookingId);
      const response = await api.delete(`/api/bookings/${bookingId}`);
      console.log('✅ [bookingService] Booking deleted:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ [bookingService] Delete booking error:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Failed to delete booking' };
    }
  },

  // Add feedback to booking
  addFeedback: async (bookingId, feedbackData) => {
    try {
      console.log('⭐ [bookingService] Adding feedback:', { bookingId, feedbackData });
      const response = await api.patch(`/api/bookings/feedback/${bookingId}`, feedbackData);
      console.log('✅ [bookingService] Feedback added:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ [bookingService] Add feedback error:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Failed to add feedback' };
    }
  },

  // Get all bookings (Admin only)
  getAllBookings: async (filters = {}) => {
    try {
      console.log('📋 [bookingService] Fetching all bookings:', filters);
      const queryParams = new URLSearchParams(filters).toString();
      const response = await api.get(`/api/bookings/all${queryParams ? `?${queryParams}` : ''}`);
      console.log('✅ [bookingService] All bookings fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ [bookingService] Get all bookings error:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Failed to get all bookings' };
    }
  },

  // Update booking status (Admin only)
  updateBookingStatus: async (bookingId, statusData) => {
    try {
      // Validate status before sending
      const validStatuses = ['Pending', 'Confirmed', 'Completed'];
      const status = statusData.status || statusData;
      
      if (!status || !validStatuses.includes(status)) {
        throw new Error(`Invalid status. Valid statuses are: ${validStatuses.join(', ')}`);
      }
      
      console.log('🔄 [bookingService] Updating booking status:', { bookingId, status });
      const response = await api.patch(`/api/bookings/status/${bookingId}`, { status });
      console.log('✅ [bookingService] Booking status updated:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ [bookingService] Update booking status error:', error.response?.data || error.message);
      throw error.response?.data || { message: error.message || 'Failed to update booking status' };
    }
  },
  // Create a new booking
  createBooking: async (bookingData) => {
    try {
      console.log('🚀 Sending booking request:', bookingData);
      const response = await api.post('/api/bookings/create', bookingData);
      console.log('✅ Booking response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Booking error:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Failed to create booking' };
    }
  },

  // Get user's bookings
  getUserBookings: async (userId) => {
    try {
      console.log('🔍 [bookingService] Fetching bookings for userId:', userId);
      console.log('🌐 [bookingService] API Base URL:', import.meta.env.VITE_API_URL);
      
      // FIXED: Get token from axteamAuth as per prompt requirements
      const axteamAuth = JSON.parse(localStorage.getItem('axteamAuth') || '{}');
      const token = axteamAuth.token || localStorage.getItem('authToken');
      
      console.log('🔑 [bookingService] Token from axteamAuth:', !!axteamAuth.token);
      console.log('🔑 [bookingService] Fallback token:', !!localStorage.getItem('authToken'));
      console.log('🔑 [bookingService] Final token present:', !!token);
      
      if (!userId) {
        console.error('❌ [bookingService] User ID is required');
        throw new Error('User ID is required');
      }
      
      if (!token) {
        console.error('❌ [bookingService] No auth token found');
        throw new Error('Authentication token required');
      }
      
      const apiUrl = `/api/bookings/user/${userId}`;
      console.log('🔗 [bookingService] Making request to:', apiUrl);
      
      const response = await api.get(apiUrl);
      
      console.log('✅ [bookingService] Response received:', response.status);
      console.log('📊 [bookingService] Response data:', response.data);
      console.log('📋 [bookingService] Bookings count:', response.data?.data?.bookings?.length || 0);
      
      return response.data;
    } catch (error) {
      console.error('❌ [bookingService] Error details:');
      console.error('  - Status:', error.response?.status);
      console.error('  - Data:', error.response?.data);
      console.error('  - Message:', error.message);
      console.error('  - URL:', error.config?.url);
      console.error('  - Method:', error.config?.method);
      
      throw error.response?.data || { message: 'Failed to get bookings' };
    }
  },


  // Cancel booking
  cancelBooking: async (bookingId) => {
    try {
      const response = await api.put(`/api/bookings/${bookingId}/cancel`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to cancel booking' };
    }
  }
};