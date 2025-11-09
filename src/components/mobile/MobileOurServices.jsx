import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const MobileOurServices = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);
  // Function to get the correct image path for each service - Force load images
  const getServiceImage = (serviceId) => {
    const imageMap = {
      // Appliance services - same as desktop
      'washing': '/assets/appliance/washing-machine-repair.jpg',
      'refrigerator': '/assets/appliance/Refrigerator.jpg', 
      'geyser': '/assets/appliance/geyser.jpg',
      'purifier': '/assets/appliance/water-purifier.jpg',
      'microwave': '/assets/appliance/microwave.jpg',
      'ac': '/assets/appliance/ac.jpg',
      // Home services - same as desktop
      'interior': '/assets/services/interior.jpg',
      'electrical': '/assets/services/Electrical-Service.png',
      'maintenance': '/assets/services/Home-Maintenance-and-Services.png',
      'painting': '/assets/services/Wall-Painting.png',
      'cctv': '/assets/services/cctv.png',
      'piping': '/assets/services/Advanced-Pipelining.png'
    };
    const imagePath = imageMap[serviceId] || '';
    console.log('🔍 Mobile service image requested:', serviceId, '→', imagePath);
    return imagePath;
  };
  // Define appliance services categories (Mobile - same as desktop)
  const applianceCategories = [
    {
      id: 'washing',
      name: 'Washing Machine',
      icon: 'washing',
      description: 'All types of washing machine services',
      services: [
        'Top Load Fully Automatic - Repair & Service',
        'Front Load Fully Automatic - Repair & Service', 
        'Semi Automatic - Repair & Service',
        'Washing Machine - Installation & Uninstallation'
      ]
    },
    {
      id: 'refrigerator',
      name: 'Refrigerator',
      icon: 'fridge',
      description: 'All refrigerator repair and maintenance',
      services: [
        'Double Door - Repair & Service',
        'Single Door - Repair & Service',
        'Side by Side Door - Repair & Service'
      ]
    },
    {
      id: 'geyser',
      name: 'Geyser',
      icon: 'geyser',
      description: 'Water heating solutions',
      services: [
        'Geyser - Repair & Service',
        'Geyser - Installation & Uninstallation'
      ]
    },
    {
      id: 'purifier',
      name: 'Water Purifier',
      icon: 'purifier',
      description: 'Water purification services',
      services: [
        'Water Purifier - Repair & Service',
        'Water Purifier - Installation & Uninstallation'
      ]
    },
    {
      id: 'microwave',
      name: 'Microven',
      icon: 'microwave',
      description: 'Microven repair and maintenance',
      services: [
        'Microven - Repair & Service'
      ]
    },
    {
      id: 'ac',
      name: 'Air Conditioner',
      icon: 'ac',
      description: 'Complete AC solutions',
      services: [
        'AC - Repair & Service',
        'AC - Gas Fill Service',
        'AC - Installation & Uninstallation',
        'AC - Advanced piping Repair & Service'
      ]
    }
  ];

  // Define home services categories (Mobile - same as desktop)
  const homeServicesCategories = [
    {
      id: 'interior',
      name: 'Interior',
      icon: 'interior',
      description: 'Complete interior design and work',
      services: [
        'Full Building/Flat Interior Work',
        'Interior Repair & Service (Existing Work)',
        'Interior Work Adjustments/Changes'
      ]
    },
    {
      id: 'electrical',
      name: 'Electrical Service',
      icon: 'electrical',
      description: 'All electrical work and installations',
      services: [
        'Complete Wiring - New/Old Buildings & Flats',
        'Commercial Electrical Works',
        'Electrical Repair & Maintenance'
      ]
    },
    {
      id: 'maintenance',
      name: 'Home Maintenance & Services',
      icon: 'maintenance',
      description: 'General home maintenance and repairs',
      services: [
        'Wall Paneling - Flats & Buildings',
        'Piping for New Buildings/Flats (Complete Work)',
        'Cleaning - Entire Building or Flat',
        'General Home Repairs'
      ]
    },
    {
      id: 'painting',
      name: 'Wall Painting',
      icon: 'painting',
      description: 'Professional wall painting services',
      services: [
        'Wall Painting & Touch-up',
        'Complete Building Painting',
        'Texture & Designer Painting'
      ]
    },
    {
      id: 'cctv',
      name: 'CCTV',
      icon: 'security',
      description: 'Security camera installation and maintenance',
      services: [
        'CCTV - Installation & Uninstallation',
        'CCTV - Repair & Maintenance',
        'Security System Setup'
      ]
    },
    {
      id: 'piping',
      name: 'AC Advanced Piping',
      icon: 'maintenance',
      description: 'Professional AC piping installation and repair services',
      services: [
        'AC - Advanced Piping Installation',
        'AC - Advanced Piping Repair & Service',
        'AC - Copper Pipe Installation',
        'AC - Refrigerant Line Installation'
      ]
    }
  ];


  // Handle category click to show popup (same as desktop)
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setShowModal(true);
  };

  // Handle service selection from popup (same as desktop)
  const handleServiceSelect = (serviceName) => {
    setShowModal(false);
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('userToken') && localStorage.getItem('userName');
    
    if (isLoggedIn) {
      // User is logged in, go directly to booking with selected service
      window.location.href = `/booking?service=${encodeURIComponent(serviceName)}`;
    } else {
      // User not logged in, store selected service and redirect to login
      localStorage.setItem('pendingServiceSelection', serviceName);
      localStorage.setItem('redirectAfterLogin', '/booking');
      window.location.href = '/login';
    }
  };

  // Close modal (same as desktop)
  const closeModal = () => {
    setShowModal(false);
    setSelectedCategory(null);
  };

  return (
    <section id="our-services" className="py-12 bg-gray-50 px-4">
      <div className="max-w-sm mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Our Services</h2>
          <p className="text-base text-gray-600 leading-relaxed">
            Expert Solutions for Every Home & Appliance
          </p>
        </div>

        {/* Services Animation Container - 2 Sections with Seamless Loop Mobile */}
        <div className="space-y-16">
          {/* Appliance Services Section - Seamless Loop (Top Load → 2 → 3... → 16 → Top Load...) */}
          <div className="text-center mb-6">
            <div className="mb-6">
              <img 
                src="/assets/hero/appliance-services-header.png" 
                alt="Appliance Services"
                className="w-full max-w-xs mx-auto h-auto object-contain"
                onError={(e) => {
                  // Fallback to text if image not found
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <h3 className="text-lg font-bold text-gray-800 hidden">
                Appliance Services
              </h3>
            </div>
            <div className="relative overflow-hidden h-56">
              <div className="flex animate-scroll-right-mobile space-x-10 whitespace-nowrap">
                {/* Create seamless continuous loop with appliance categories */}
                {Array(8).fill(applianceCategories).flat().map((category, index) => (
                  <div
                    key={`mobile-appliance-${index}`}
                    className="flex-shrink-0 text-center group active:scale-95 transition-transform duration-200 cursor-pointer"
                    onClick={() => handleCategoryClick(category)}
                    style={{ minWidth: '160px' }}
                  >
                    <div className="w-36 h-36 bg-white rounded-none shadow-xl flex items-center justify-center mb-6 mx-auto group-active:shadow-2xl transition-shadow duration-300 border-4 border-gray-200 overflow-hidden">
                      <img 
                        src={getServiceImage(category.id)} 
                        alt={category.name}
                        className="w-full h-full object-cover group-active:scale-125 transition-transform duration-300"
                        onError={(e) => {
                          console.log('Image failed to load:', e.target.src);
                          // Fallback to gradient background with icon if image fails to load
                          e.target.style.display = 'none';
                          e.target.parentElement.style.background = 'linear-gradient(135deg, #3b82f6, #8b5cf6)';
                          e.target.parentElement.innerHTML = '<div class="w-16 h-16 text-white flex items-center justify-center text-2xl">📱</div>';
                        }}
                      />
                    </div>
                    <div className="w-36 mx-auto">
                      <p className="text-xs font-semibold text-gray-800 leading-tight text-center">
                        {category.name.split(' ').length > 2 ? (
                          <>
                            {category.name.split(' ').slice(0, Math.ceil(category.name.split(' ').length / 2)).join(' ')}<br/>
                            {category.name.split(' ').slice(Math.ceil(category.name.split(' ').length / 2)).join(' ')}
                          </>
                        ) : (
                          category.name
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Home Services Section - Seamless Loop (Full Building Interior → 2 → 3... → 9 → Full Building Interior...) */}
          <div className="text-center mb-6">
            <div className="mb-6">
              <img 
                src="/assets/hero/home-services-header.png" 
                alt="Home Services & Repair"
                className="w-full max-w-xs mx-auto h-auto object-contain"
                onError={(e) => {
                  // Fallback to text if image not found
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <h3 className="text-lg font-bold text-gray-800 hidden">
                Home Services & Repair
              </h3>
            </div>
            <div className="relative overflow-hidden h-56">
              <div className="flex animate-scroll-left-mobile space-x-10 whitespace-nowrap">
                {/* Create seamless continuous loop with home service categories */}
                {Array(8).fill(homeServicesCategories).flat().map((category, index) => (
                  <div
                    key={`mobile-home-${index}`}
                    className="flex-shrink-0 text-center group active:scale-95 transition-transform duration-200 cursor-pointer"
                    onClick={() => handleCategoryClick(category)}
                    style={{ minWidth: '160px' }}
                  >
                    <div className="w-36 h-36 bg-white rounded-none shadow-xl flex items-center justify-center mb-6 mx-auto group-active:shadow-2xl transition-shadow duration-300 border-4 border-gray-200 overflow-hidden">
                      <img 
                        src={getServiceImage(category.id)} 
                        alt={category.name}
                        className="w-full h-full object-cover group-active:scale-125 transition-transform duration-300"
                        onError={(e) => {
                          console.log('Home service image failed to load:', e.target.src);
                          // Fallback to gradient background with icon if image fails to load
                          e.target.style.display = 'none';
                          e.target.parentElement.style.background = 'linear-gradient(135deg, #ef4444, #f97316)';
                          e.target.parentElement.innerHTML = '<div class="w-16 h-16 text-white flex items-center justify-center text-2xl">🏠</div>';
                        }}
                      />
                    </div>
                    <div className="w-36 mx-auto">
                      <p className="text-xs font-semibold text-gray-800 leading-tight text-center">
                        {category.name.split(' ').length > 2 ? (
                          <>
                            {category.name.split(' ').slice(0, Math.ceil(category.name.split(' ').length / 2)).join(' ')}<br/>
                            {category.name.split(' ').slice(Math.ceil(category.name.split(' ').length / 2)).join(' ')}
                          </>
                        ) : (
                          category.name
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Mobile Service Selection Modal */}
        {showModal && selectedCategory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-sm w-full max-h-[80vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border-2 border-gray-200 overflow-hidden">
                    <img 
                      src={getServiceImage(selectedCategory.id)} 
                      alt={selectedCategory.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to gradient background with icon if image fails to load
                        e.target.style.display = 'none';
                        e.target.parentElement.style.background = 'linear-gradient(135deg, #3b82f6, #8b5cf6)';
                        e.target.parentElement.innerHTML = '<div class="w-6 h-6 text-white flex items-center justify-center text-lg">⚙️</div>';
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{selectedCategory.name}</h3>
                    <p className="text-sm text-gray-600">{selectedCategory.description}</p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              {/* Modal Body - Services List */}
              <div className="p-4">
                <h4 className="text-base font-semibold text-gray-800 mb-3">Select a service:</h4>
                <div className="space-y-2">
                  {selectedCategory.services.map((service, index) => (
                    <button
                      key={index}
                      onClick={() => handleServiceSelect(service)}
                      className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors duration-200 group active:scale-95"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-800 group-hover:text-blue-700">
                          {service}
                        </span>
                        <span className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs">
                          Book →
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={closeModal}
                  className="w-full px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200 active:scale-95"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View All Services Button */}
        <div className="text-center mt-8">
          <Link
            to="/services"
            className="block w-full px-6 py-3 rounded-xl font-semibold text-white hover:opacity-90 active:scale-95 transition-all duration-200 shadow-lg"
            style={{ backgroundColor: '#dc2626' }}
          >
            View All Services
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MobileOurServices;