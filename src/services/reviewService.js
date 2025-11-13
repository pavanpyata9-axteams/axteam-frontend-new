import axios from '../api/axios';

export const reviewService = {
  // Create a new review
  createReview: async (reviewData) => {
    try {
      const response = await axios.post('/reviews/create', reviewData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create review' };
    }
  },

  // Get reviews for homepage
  getHomepageReviews: async (limit = 6) => {
    try {
      const response = await axios.get(`/reviews/homepage?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch reviews' };
    }
  },

  // Get all reviews (Admin)
  getAllReviews: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await axios.get(`/reviews/all?${queryParams}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch reviews' };
    }
  },

  // Reply to a review (Admin)
  replyToReview: async (reviewId, replyText) => {
    try {
      const response = await axios.patch(`/reviews/reply/${reviewId}`, {
        replyText
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to reply to review' };
    }
  },

  // Update review approval (Admin)
  updateReviewApproval: async (reviewId, status) => {
    try {
      const response = await axios.patch(`/reviews/approve/${reviewId}`, status);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update review status' };
    }
  },

  // Delete review (Admin)
  deleteReview: async (reviewId) => {
    try {
      const response = await axios.delete(`/reviews/${reviewId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete review' };
    }
  }
};