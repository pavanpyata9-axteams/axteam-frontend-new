import api from '../api/axios';

export const serviceService = {
  // Get all services
  getAllServices: async () => {
    try {
      const response = await api.get('/services/list');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get services' };
    }
  },

  // Get service by ID
  getServiceById: async (serviceId) => {
    try {
      const response = await api.get(`/services/${serviceId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get service' };
    }
  },

  // Create service (admin only)
  createService: async (serviceData) => {
    try {
      const response = await api.post('/services/add', serviceData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create service' };
    }
  },

  // Update service (admin only)
  updateService: async (serviceId, serviceData) => {
    try {
      const response = await api.patch(`/services/update/${serviceId}`, serviceData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update service' };
    }
  },

  // Delete service (admin only)
  deleteService: async (serviceId) => {
    try {
      const response = await api.delete(`/services/delete/${serviceId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete service' };
    }
  }
};