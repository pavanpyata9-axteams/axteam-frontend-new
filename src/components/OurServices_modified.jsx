import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const OurServices = () => {

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
      'pipelining': '/assets/services/Advanced-Pipelining.png'
    };
    return imageMap[serviceId] || '';
  };

  // Appliance Services (Desktop - individual items like mobile)
  const applianceServices = [
    // Washing Machine Services
    { name: 'Top Load WM Repair', category: 'washing', fullName: 'Top Load Fully Automatic - Repair & Service' },
    { name: 'Front Load WM Repair', category: 'washing', fullName: 'Front Load Fully Automatic - Repair & Service' },
    { name: 'Semi Auto WM Repair', category: 'washing', fullName: 'Semi Automatic - Repair & Service' },
    { name: 'WM Installation', category: 'washing', fullName: 'Washing Machine - Installation & Uninstallation' },
    
    // Refrigerator Services
    { name: 'Double Door Fridge', category: 'refrigerator', fullName: 'Double Door - Repair & Service' },
    { name: 'Single Door Fridge', category: 'refrigerator', fullName: 'Single Door - Repair & Service' },
    { name: 'Side by Side Fridge', category: 'refrigerator', fullName: 'Side by Side Door - Repair & Service' },
    
    // Geyser Services
    { name: 'Geyser Repair', category: 'geyser', fullName: 'Geyser - Repair & Service' },
    { name: 'Geyser Install', category: 'geyser', fullName: 'Geyser - Installation & Uninstallation' },
    
    // Water Purifier Services
    { name: 'Purifier Repair', category: 'purifier', fullName: 'Water Purifier - Repair & Service' },
    { name: 'Purifier Install', category: 'purifier', fullName: 'Water Purifier - Installation & Uninstallation' },
    
    // Microwave Services
    { name: 'Microwave Repair', category: 'microwave', fullName: 'Microwave - Repair & Service' },
    
    // AC Services
    { name: 'AC Repair', category: 'ac', fullName: 'AC - Repair & Service' },
    { name: 'AC Gas Fill', category: 'ac', fullName: 'AC - Gas Fill Service' },
    { name: 'AC Installation', category: 'ac', fullName: 'AC - Installation & Uninstallation' },
    { name: 'AC Piping', category: 'ac', fullName: 'AC - Advanced piping Repair & Service' },
  ];

  // Home Services (Desktop - individual items like mobile)
  const homeServices = [
    // Interior Services
    { name: 'Full Interior', category: 'interior', fullName: 'Full Building/Flat Interior Work' },
    { name: 'Interior Repair', category: 'interior', fullName: 'Interior Repair & Service (Existing Work)' },
    { name: 'Interior Changes', category: 'interior', fullName: 'Interior Work Adjustments/Changes' },
    
    // Electrical Services
    { name: 'Complete Wiring', category: 'electrical', fullName: 'Complete Wiring - New/Old Buildings & Flats' },
    { name: 'Commercial Electric', category: 'electrical', fullName: 'Commercial Electrical Works' },
    { name: 'Electrical Repair', category: 'electrical', fullName: 'Electrical Repair & Maintenance' },
    
    // Home Maintenance
    { name: 'Wall Paneling', category: 'maintenance', fullName: 'Wall Paneling - Flats & Buildings' },
    { name: 'Piping Work', category: 'maintenance', fullName: 'Piping for New Buildings/Flats (Complete Work)' },
    { name: 'Building Cleaning', category: 'maintenance', fullName: 'Cleaning - Entire Building or Flat' },
    { name: 'General Repairs', category: 'maintenance', fullName: 'General Home Repairs' },
    
    // Wall Painting
    { name: 'Wall Painting', category: 'painting', fullName: 'Wall Painting & Touch-up' },
    { name: 'Building Painting', category: 'painting', fullName: 'Complete Building Painting' },
    { name: 'Texture Painting', category: 'painting', fullName: 'Texture & Designer Painting' },
    
    // CCTV
    { name: 'CCTV Install', category: 'cctv', fullName: 'CCTV - Installation & Uninstallation' },
    { name: 'CCTV Repair', category: 'cctv', fullName: 'CCTV - Repair & Maintenance' },
    { name: 'Security Setup', category: 'cctv', fullName: 'Security System Setup' },
    
    // Advanced Pipelining
    { name: 'Pipeline Install', category: 'pipelining', fullName: 'Advanced Pipeline Installation' },
    { name: 'Pipeline Repair', category: 'pipelining', fullName: 'Pipeline Repair & Maintenance' },
  ];

  // Handle service click for direct booking (like mobile)
  const handleServiceClick = (service) => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('userToken') && localStorage.getItem('userName');
    
    if (isLoggedIn) {
      // User is logged in, go directly to booking with selected service
      window.location.href = `/booking?service=${encodeURIComponent(service.fullName)}`;
    } else {
      // User not logged in, store selected service and redirect to login
      localStorage.setItem('pendingServiceSelection', service.fullName);
      localStorage.setItem('redirectAfterLogin', '/booking');
      window.location.href = '/login';
    }
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
                src="/header-images/appliance-services-header.png" 
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
                {/* Create seamless continuous loop with appliance services */}
                {Array(8).fill(applianceServices).flat().map((service, index) => (
                  <div
                    key={`appliance-${index}`}
                    className="flex-shrink-0 text-center group hover:scale-105 transition-transform duration-300 cursor-pointer"
                    onClick={() => handleServiceClick(service)}
                    style={{ minWidth: '160px' }}
                  >
                    <div className="w-36 h-36 bg-white rounded-none shadow-xl flex items-center justify-center mb-6 mx-auto group-hover:shadow-2xl transition-shadow duration-300 border-4 border-gray-200 overflow-hidden">
                      <img 
                        src={getServiceImage(service.category)} 
                        alt={service.name}
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
                        {service.name.split(' ').length > 2 ? (
                          <>
                            {service.name.split(' ').slice(0, Math.ceil(service.name.split(' ').length / 2)).join(' ')}<br/>
                            {service.name.split(' ').slice(Math.ceil(service.name.split(' ').length / 2)).join(' ')}
                          </>
                        ) : (
                          service.name
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
                src="/header-images/home-services-header.png" 
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
                {/* Create seamless continuous loop with home services */}
                {Array(6).fill(homeServices).flat().map((service, index) => (
                  <div
                    key={`home-${index}`}
                    className="flex-shrink-0 text-center group hover:scale-105 transition-transform duration-300 cursor-pointer"
                    onClick={() => handleServiceClick(service)}
                    style={{ minWidth: '160px' }}
                  >
                    <div className="w-36 h-36 bg-white rounded-none shadow-xl flex items-center justify-center mb-6 mx-auto group-hover:shadow-2xl transition-shadow duration-300 border-4 border-gray-200 overflow-hidden">
                      <img 
                        src={getServiceImage(service.category)} 
                        alt={service.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
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
                        {service.name.split(' ').length > 2 ? (
                          <>
                            {service.name.split(' ').slice(0, Math.ceil(service.name.split(' ').length / 2)).join(' ')}<br/>
                            {service.name.split(' ').slice(Math.ceil(service.name.split(' ').length / 2)).join(' ')}
                          </>
                        ) : (
                          service.name
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>


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