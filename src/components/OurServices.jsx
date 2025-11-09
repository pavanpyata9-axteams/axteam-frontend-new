import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const OurServices = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Function to get the correct image path for each service
  const getServiceImage = (serviceId) => {
    const imageMap = {
      // Appliance services
      'washing': '/assets/appliance/washing-machine-repair.jpg',
      'refrigerator': '/assets/appliance/Refrigerator.jpg',
      'geyser': '/assets/appliance/geyser.jpg',
      'purifier': '/assets/appliance/water-purifier.jpg',
      'microwave': '/assets/appliance/microwave.jpg',
      'ac': '/assets/appliance/ac.jpg',
      // Home services
      'interior': '/assets/services/interior.jpg',
      'electrical': '/assets/services/Electrical-Service.png',
      'maintenance': '/assets/services/Home-Maintenance-and-Services.png',
      'painting': '/assets/services/Wall-Painting.png',
      'cctv': '/assets/services/cctv.png',
      'piping': '/assets/services/Advanced-Pipelining.png'
    };
    return imageMap[serviceId] || '';
  };

  // Function to get the correct logo path for each individual service
  const getServiceLogo = (serviceName) => {
    const logoMap = {
      // AC Services
      'AC - Repair & Service': '/assets/gallery/AC-Repair-and-Service.png',
      'AC - Gas Fill Service': '/assets/gallery/AC-GAS-FILLING.png',
      'AC - Installation & Uninstallation': '/assets/gallery/AC-Installation-and-Uninstallation.png',
      'AC - Advanced piping Repair & Service': '/assets/gallery/AC-Advanced-piping.png',
      
      // Washing Machine Services
      'Top Load Fully Automatic - Repair & Service': '/assets/gallery/Top-Load-Fully-Automatic-Repair-and-Service.png',
      'Front Load Fully Automatic - Repair & Service': '/assets/gallery/Front-Load-Fully-Automatic-Repair-and-Service.png',
      'Semi Automatic - Repair & Service': '/assets/gallery/Semi-Automatic-Repair-and-Service.png',
      'Washing Machine - Installation & Uninstallation': '/assets/gallery/Washing-Machine-Installation-and-Uninstallation.png',
      
      // Refrigerator Services
      'Double Door - Repair & Service': '/assets/gallery/DoubleSingle-Door-Repair-and-Service.png',
      'Single Door - Repair & Service': '/assets/gallery/Single-Door-Repair-and-Service.png',
      'Side by Side Door - Repair & Service': '/assets/gallery/ide-by-Side-Door-Repair-and-Service.png',
      
      // Geyser Services
      'Geyser - Repair & Service': '/assets/gallery/Geyser-Repair-and-Service.png',
      'Geyser - Installation & Uninstallation': '/assets/gallery/Geyser-Installation-and-Uninstallation.png',
      
      // Water Purifier Services
      'Water Purifier - Repair & Service': '/assets/gallery/Water-Purifier-Repair-and-Service.png',
      'Water Purifier - Installation & Uninstallation': '/assets/gallery/Water-Purifier-Installation-and-Uninstallation.png',
      
      // Microwave Services
      'Microven - Repair & Service': '/assets/gallery/Microven-Repair-and-Service.png'
    };
    return logoMap[serviceName] || '';
  };

  // Define appliance services categories (Row 1 - moving right →)
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

  // Define home services categories (Row 2 - moving left ←)
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

  // Handle category click to show popup
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setShowModal(true);
  };

  // Handle service selection from popup
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

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedCategory(null);
  };

  return (
    <section id="our-services" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Services</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Expert Solutions for Every Home & Appliance
          </p>
        </div>

        {/* Services Animation Container - 2 Sections with Seamless Loop */}
        <div className="space-y-20">
          {/* Appliance Services Section - Seamless Loop (Moving Right →) */}
          <div className="text-center mb-8">
            <div className="mb-8">
              <img 
                src="/assets/hero/appliance-services-header.png" 
                alt="Appliance Services"
                className="w-full max-w-md mx-auto h-auto object-contain"
                onError={(e) => {
                  // Fallback to text if image not found
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <h3 className="text-2xl font-bold text-gray-800 hidden">
                Appliance Services
              </h3>
            </div>
            <div className="relative overflow-hidden h-56">
              <div className="flex animate-scroll-right space-x-20 whitespace-nowrap">
                {/* Create seamless continuous loop with 6 appliance categories */}
                {Array(12).fill(applianceCategories).flat().map((category, index) => (
                  <div
                    key={`appliance-${index}`}
                    className="flex-shrink-0 text-center group hover:scale-105 transition-transform duration-300 cursor-pointer"
                    onClick={() => handleCategoryClick(category)}
                    style={{ minWidth: '160px' }}
                  >
                    <div className="w-36 h-36 bg-white rounded-none shadow-xl flex items-center justify-center mb-6 mx-auto group-hover:shadow-2xl transition-shadow duration-300 border-4 border-gray-200 overflow-hidden">
                      <img 
                        src={getServiceImage(category.id)} 
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          // Fallback to gradient background with icon if image fails to load
                          e.target.style.display = 'none';
                          e.target.parentElement.style.background = 'linear-gradient(135deg, #3b82f6, #8b5cf6)';
                          e.target.parentElement.innerHTML = '<div class="w-20 h-20 text-white flex items-center justify-center text-4xl">📱</div>';
                        }}
                      />
                    </div>
                    <div className="w-36 mx-auto">
                      <p className="text-sm font-semibold text-gray-800 leading-tight text-center">
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

          {/* Home Services Section - Seamless Loop (Moving Left ←) */}
          <div className="text-center mb-8">
            <div className="mb-8">
              <img 
                src="/assets/hero/home-services-header.png" 
                alt="Home Services & Repair"
                className="w-full max-w-md mx-auto h-auto object-contain"
                onError={(e) => {
                  // Fallback to text if image not found
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <h3 className="text-2xl font-bold text-gray-800 hidden">
                Home Services & Repair
              </h3>
            </div>
            <div className="relative overflow-hidden h-56">
              <div className="flex animate-scroll-left space-x-20 whitespace-nowrap">
                {/* Create seamless continuous loop with 6 home service categories */}
                {Array(12).fill(homeServicesCategories).flat().map((category, index) => (
                  <div
                    key={`home-${index}`}
                    className="flex-shrink-0 text-center group hover:scale-105 transition-transform duration-300 cursor-pointer"
                    onClick={() => handleCategoryClick(category)}
                    style={{ minWidth: '160px' }}
                  >
                    <div className="w-36 h-36 bg-white rounded-none shadow-xl flex items-center justify-center mb-6 mx-auto group-hover:shadow-2xl transition-shadow duration-300 border-4 border-gray-200 overflow-hidden">
                      <img 
                        src={getServiceImage(category.id)} 
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-300"
                        onError={(e) => {
                          // Fallback to gradient background with icon if image fails to load
                          e.target.style.display = 'none';
                          e.target.parentElement.style.background = 'linear-gradient(135deg, #ef4444, #f97316)';
                          e.target.parentElement.innerHTML = '<div class="w-20 h-20 text-white flex items-center justify-center text-4xl">🏠</div>';
                        }}
                      />
                    </div>
                    <div className="w-36 mx-auto">
                      <p className="text-sm font-semibold text-gray-800 leading-tight text-center">
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

        {/* Service Selection Modal */}
        {showModal && selectedCategory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center border-2 border-gray-200 overflow-hidden">
                    <img 
                      src={getServiceImage(selectedCategory.id)} 
                      alt={selectedCategory.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to gradient background with icon if image fails to load
                        e.target.style.display = 'none';
                        e.target.parentElement.style.background = 'linear-gradient(135deg, #3b82f6, #8b5cf6)';
                        e.target.parentElement.innerHTML = '<div class="w-8 h-8 text-white flex items-center justify-center text-2xl">⚙️</div>';
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">{selectedCategory.name}</h3>
                    <p className="text-gray-600">{selectedCategory.description}</p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 text-3xl font-bold"
                >
                  ×
                </button>
              </div>

              {/* Modal Body - Services List */}
              <div className="p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Select a service:</h4>
                <div className="space-y-3">
                  {selectedCategory.services.map((service, index) => (
                    <button
                      key={index}
                      onClick={() => handleServiceSelect(service)}
                      className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors duration-200 group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 md:w-14 md:h-14 rounded bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400 flex items-center justify-center text-lg md:text-xl flex-shrink-0 group-hover:from-primary-50 group-hover:to-primary-100 group-hover:text-primary-600 transition-all duration-300 overflow-hidden">
                            {getServiceLogo(service) ? (
                              <img 
                                src={getServiceLogo(service)} 
                                alt={service}
                                className="w-10 h-10 md:w-12 md:h-12 object-contain"
                                onError={(e) => {
                                  console.log('Logo failed to load for service:', service, 'Path:', getServiceLogo(service));
                                  e.target.style.display = 'none';
                                  e.target.parentElement.innerHTML = '<span class="text-2xl">⚙️</span>';
                                }}
                              />
                            ) : (
                              <span className="text-2xl">⚙️</span>
                            )}
                          </div>
                          <span className="font-medium text-gray-800 group-hover:text-blue-700">
                            {service}
                          </span>
                        </div>
                        <span className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          Book Now →
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={closeModal}
                  className="w-full px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View All Services Button */}
        <div className="text-center mt-12">
          <Link
            to="/services"
            className="inline-block px-8 py-3 rounded-lg font-semibold text-white hover:opacity-90 transition-opacity duration-200 shadow-lg"
            style={{ backgroundColor: '#dc2626' }}
          >
            View All Services
          </Link>
        </div>
      </div>
    </section>
  );
};

export default OurServices;