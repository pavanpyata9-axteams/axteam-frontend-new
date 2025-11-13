import api from '../api/axios';

// Get all gallery images
export const getGallery = () => api.get("/gallery");

// Upload new image
export const uploadImage = (formData) =>
  api.post("/gallery/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// Delete image
export const deleteImage = (imageId) => api.delete(`/gallery/${imageId}`);

export default {
  getGallery,
  uploadImage,
  deleteImage
};