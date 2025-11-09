import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [galleryItems, setGalleryItems] = useState([]);

  const [categories, setCategories] = useState(['All']);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    // Load images and videos from localStorage
    const savedMedia = JSON.parse(localStorage.getItem('galleryImages') || '[]');
    setGalleryItems(savedMedia);
    
    // Get unique categories from uploaded items
    const uniqueCategories = ['All', ...new Set(savedMedia.map(item => item.category).filter(Boolean))];
    setCategories(uniqueCategories);
  }, []);

  const filteredItems = activeCategory === 'All' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeCategory);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">Our Gallery</h1>
          <p className="text-xl text-gray-100">Showcasing our best work and completed projects</p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white sticky top-20 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  activeCategory === category
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl overflow-hidden shadow-md hover-lift cursor-pointer group"
                onClick={() => setSelectedImage(item)}
              >
                {/* Display uploaded image or video */}
                {item.mediaType === 'video' ? (
                  <video 
                    src={item.mediaData} 
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                    muted
                  />
                ) : item.mediaData || item.imageData ? (
                  <img 
                    src={item.mediaData || item.imageData} 
                    alt={item.title} 
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="bg-gradient-to-br from-primary-100 to-primary-200 h-64 flex items-center justify-center text-8xl group-hover:scale-110 transition-transform duration-300">
                    {item.emoji || '📸'}
                  </div>
                )}
                <div className="p-6">
                  <span className="text-primary-600 font-semibold text-sm uppercase">{item.category}</span>
                  <h3 className="text-xl font-semibold mt-2 text-gray-800">{item.title || item.description}</h3>
                </div>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-600 text-xl">No projects found in this category</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6 text-gray-800">Want to See Your Project Here?</h2>
          <p className="text-xl mb-8 text-gray-600">
            Let's work together to create something amazing
          </p>
          <Link
            to="/login"
            className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors duration-200 inline-block text-lg"
          >
            Start Your Project
          </Link>
        </div>
      </section>

      {/* Modal for Image Enlargement */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="bg-white rounded-xl max-w-4xl w-full p-6">
            {selectedImage.mediaType === 'video' ? (
              <video 
                src={selectedImage.mediaData} 
                className="w-full h-96 object-contain rounded-lg mb-4"
                controls
              />
            ) : selectedImage.mediaData || selectedImage.imageData ? (
              <img 
                src={selectedImage.mediaData || selectedImage.imageData} 
                alt={selectedImage.title} 
                className="w-full h-96 object-contain rounded-lg mb-4"
              />
            ) : (
              <div className="bg-gradient-to-br from-primary-100 to-primary-200 h-96 flex items-center justify-center text-9xl rounded-lg mb-4">
                {selectedImage.emoji || '📸'}
              </div>
            )}
            <h3 className="text-2xl font-bold mb-2">{selectedImage.title || selectedImage.description}</h3>
            <p className="text-gray-600 mb-4">Category: {selectedImage.category}</p>
            <button
              onClick={() => setSelectedImage(null)}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;

