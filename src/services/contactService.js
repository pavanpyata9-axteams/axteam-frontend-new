import api from '../api/axios';

export const contactService = {
  // Submit contact form
  submitContactForm: async (formData) => {
    try {
      const response = await api.post('/api/contact', formData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to submit contact form' };
    }
  },

  // Get all contact submissions (admin only)
  getAllContacts: async () => {
    try {
      const response = await api.get('/api/admin/contacts');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get contacts' };
    }
  }
};