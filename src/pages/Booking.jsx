import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sessionManager } from '../utils/sessionManager';
import { generateBookingId } from '../utils/bookingIdGenerator';
import { bookingService } from '../services/bookingService';

const Booking = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [formData, setFormData] = useState({
    services: [], // Changed to array for multiple services
    name: '',
    email: '',
    phone: '',
    address: '',
    city: 'Hyderabad',
    area: '',
    pincode: '',
    landmark: '',
    googleLocation: '',
    workDescription: '',
    preferredDate: '',
    preferredTime: '',
  });
  
  const [selectedService, setSelectedService] = useState(''); // For adding new services

  const [isSubmitted, setIsSubmitted] = useState(false);

  // Expanded services reflecting Services page sections/categories
  const services = [
    // Appliance Services
    'Washing Machine - Top Load Fully Automatic - Repair & Service',
    'Washing Machine - Front Load Fully Automatic - Repair & Service',
    'Washing Machine - Semi Automatic - Repair & Service',
    'Washing Machine - Installation & Uninstallation',
    'Refrigerator - Double Door - Repair & Service',
    'Refrigerator - Single Door - Repair & Service',
    'Refrigerator - Side by Side Door - Repair & Service',
    'Geyser - Repair & Service',
    'Geyser - Installation & Uninstallation',
    'Water Purifier - Repair & Service',
    'Water Purifier - Installation & Uninstallation',
    'Microven - Repair & Service',
    'AC - Repair & Service',
    'AC - Gas Fill Service',
    'AC - Installation & Uninstallation',
    'AC - Advanced Piping Repair & Service',
    // Home Services & Repair
    'Interior - Full Building/Flat Interior Work',
    'Interior - Interior Repair & Service (Existing Work)',
    'Interior - Interior Work Adjustments/Changes',
    'Electrical Service - Complete Wiring (New/Old Buildings & Flats)',
    'Electrical Service - Commercial Electrical Works',
    'Electrical Service - Electrical Repair & Maintenance',
    'Home Maintenance & Services - Wall Paneling (Flats & Buildings)',
    'Home Maintenance & Services - Piping for New Buildings/Flats (Complete Work)',
    'Home Maintenance & Services - Cleaning (Entire Building or Flat)',
    'Home Maintenance & Services - General Home Repairs',
    'Wall Painting - Wall Painting & Touch-up',
    'Wall Painting - Complete Building Painting',
    'Wall Painting - Texture & Designer Painting',
    'Advanced Pipelining - Advanced Pipeline Installation',
    'Advanced Pipelining - Pipeline Repair & Maintenance',
    'CCTV - Installation & Uninstallation',
    'CCTV - Repair & Maintenance',
    'CCTV - Security System Setup',
  ];

  useEffect(() => {
    // Check session validity
    if (!sessionManager.checkAndAutoLogout(navigate)) {
      return;
    }
    
    // Check for pre-selected service from URL or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const preSelectedService = urlParams.get('service') || localStorage.getItem('pendingServiceSelection');
    
    const userType = localStorage.getItem('userType');
    const name = localStorage.getItem('userName');
    const email = localStorage.getItem('userEmail');
    const phone = localStorage.getItem('userPhone');
    const userId = localStorage.getItem('userId');
    
    // Only set data if user is logged in (not admin)
    if (userType === 'user' && name && email && userId) {
      setUserName(name);
      setUserEmail(email);
      
      // Auto-fill basic user data from session
      setFormData(prev => ({
        ...prev,
        name,
        email,
        phone: phone || '',
      }));
      
      // Fetch user's latest booking data from backend to auto-fill address
      fetchUserProfileFromBackend(userId);
    }
    
    // Handle pre-selected service from URL or localStorage
    if (preSelectedService) {
      console.log('Pre-selected service found:', preSelectedService);
      
      // Create a mapping for our service names to match the simpler names from Our Services
      const serviceMapping = {
        'Top Load WM': 'Washing Machine - Top Load Fully Automatic - Repair & Service',
        'Top Load Washing Machine': 'Washing Machine - Top Load Fully Automatic - Repair & Service',
        'Front Load WM': 'Washing Machine - Front Load Fully Automatic - Repair & Service', 
        'Front Load Washing Machine': 'Washing Machine - Front Load Fully Automatic - Repair & Service',
        'Semi Auto WM': 'Washing Machine - Semi Automatic - Repair & Service',
        'Semi Automatic Washing Machine': 'Washing Machine - Semi Automatic - Repair & Service',
        'WM Installation': 'Washing Machine - Installation & Uninstallation',
        'Washing Machine Installation': 'Washing Machine - Installation & Uninstallation',
        'Double Door Fridge': 'Refrigerator - Double/Single Door - Repair & Service',
        'Double Door Refrigerator': 'Refrigerator - Double/Single Door - Repair & Service',
        'Single Door Fridge': 'Refrigerator - Single Door - Repair & Service',
        'Single Door Refrigerator': 'Refrigerator - Single Door - Repair & Service',
        'Side by Side Fridge': 'Refrigerator - Side by Side Door - Repair & Service',
        'Side by Side Refrigerator': 'Refrigerator - Side by Side Door - Repair & Service',
        'Geyser Repair': 'Geyser - Repair & Service',
        'Geyser Install': 'Geyser - Installation & Uninstallation',
        'Geyser Installation': 'Geyser - Installation & Uninstallation',
        'Purifier Repair': 'Water Purifier - Repair & Service',
        'Water Purifier Repair': 'Water Purifier - Repair & Service',
        'Purifier Install': 'Water Purifier - Installation & Uninstallation',
        'Water Purifier Installation': 'Water Purifier - Installation & Uninstallation',
        'Microven Repair': 'Microven - Repair & Service',
        'AC Repair': 'AC - Repair & Service',
        'AC Gas Fill': 'AC - Gas Fill Service',
        'AC Installation': 'AC - Installation & Uninstallation',
        'AC Piping': 'AC - Advanced Pipelining Repair & Service',
        'AC Advanced Piping': 'AC - Advanced Pipelining Repair & Service',
        'Full Interior': 'Interior - Full Building/Flat Interior Work',
        'Full Building Interior': 'Interior - Full Building/Flat Interior Work',
        'Interior Repair': 'Interior - Interior Repair & Service (Existing Work)',
        'Interior Changes': 'Wall Painting - Interior Work Adjustments/Changes',
        'Interior Adjustments': 'Wall Painting - Interior Work Adjustments/Changes',
        'Complete Wiring': 'Electrical Service - Complete Wiring (New/Old Buildings & Flats)',
        'Commercial Electric': 'Electrical Service - Commercial Electrical Works',
        'Commercial Electrical': 'Electrical Service - Commercial Electrical Works',
        'Wall Paneling': 'Wall Painting - Wall Paneling (Flats & Buildings)',
        'Piping Work': 'Advanced Pipelining - Pipelining for New Buildings/Flats (Complete Work)',
        'Complete Piping Work': 'Advanced Pipelining - Pipelining for New Buildings/Flats (Complete Work)',
        'Wall Painting': 'Wall Painting - Interior Work Adjustments/Changes',
        'Wall Painting & Touch-up': 'Wall Painting - Interior Work Adjustments/Changes',
        'CCTV Install': 'CCTV - Installation & Uninstallation',
        'CCTV Installation': 'CCTV - Installation & Uninstallation'
      };

      // First try exact mapping
      let matchingService = serviceMapping[preSelectedService];
      
      // If no exact mapping, try partial matching
      if (!matchingService) {
        matchingService = services.find(service => 
          service.toLowerCase().includes(preSelectedService.toLowerCase()) ||
          preSelectedService.toLowerCase().includes(service.toLowerCase().split(' - ')[0])
        );
      }
      
      console.log('Matching service found:', matchingService);
      
      if (matchingService) {
        // Use setTimeout to ensure state is updated after component renders
        setTimeout(() => {
          setFormData(prev => {
            if (!prev.services.includes(matchingService)) {
              const newServices = [...prev.services, matchingService];
              console.log('Updated services:', newServices);
              return {
                ...prev,
                services: newServices
              };
            }
            return prev;
          });
        }, 100);
      }
      
      // Clear the URL parameter and localStorage
      window.history.replaceState({}, document.title, window.location.pathname);
      localStorage.removeItem('pendingServiceSelection');
      localStorage.removeItem('redirectAfterLogin');
    }
  }, [navigate]);

  // Fetch user's latest booking to auto-fill address data from backend
  const fetchUserProfileFromBackend = async (userId) => {
    try {
      console.log('🔍 Fetching user profile for auto-fill from backend...');
      const response = await bookingService.getUserBookings(userId);
      
      if (response.success && response.data.bookings.length > 0) {
        const latestBooking = response.data.bookings[0]; // Most recent booking
        console.log('✅ Auto-filling address from latest booking:', latestBooking.bookingId);
        
        setFormData(prev => ({
          ...prev,
          phone: latestBooking.phone || prev.phone,
          address: latestBooking.address?.street || '',
          city: latestBooking.address?.city || 'Hyderabad',
          area: latestBooking.address?.area || '',
          pincode: latestBooking.address?.pincode || '',
          // Note: landmark and googleLocation not stored in current backend model
        }));
      } else {
        console.log('📝 No previous bookings found - user will enter data manually');
      }
    } catch (error) {
      console.log('⚠️ Could not fetch user profile for auto-fill:', error.message);
      // Silently fail - user can still fill manually
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Add service to the list
  const addService = async () => {
    if (selectedService && !formData.services.includes(selectedService)) {
      // Check if user already has pending booking for this service from backend
      const userId = localStorage.getItem('userId');
      if (userId) {
        try {
          const response = await bookingService.getUserBookings(userId);
          if (response.success && response.data.bookings) {
            const pendingBookings = response.data.bookings.filter(b => 
              b.status === 'Pending' || b.status === 'Confirmed'
            );
            
            const hasPendingService = pendingBookings.some(booking => 
              booking.services.some(s => s.serviceName === selectedService)
            );
            
            if (hasPendingService) {
              alert(`You already have a pending booking for "${selectedService}". Please wait for the current booking to complete before booking again.`);
              return;
            }
          }
        } catch (error) {
          console.log('Could not check existing bookings:', error.message);
          // Continue with adding service if check fails
        }
      }
      
      setFormData(prev => ({
        ...prev,
        services: [...prev.services, selectedService]
      }));
      setSelectedService('');
    }
  };

  // Remove service from the list
  const removeService = (serviceToRemove) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter(service => service !== serviceToRemove)
    }));
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const validateIndianPhone = (phone) => {
    // Remove spaces, dashes, and plus signs
    const cleaned = phone.replace(/[\s\-+]/g, '');
    // Indian phone numbers should be 10 digits
    return /^(\+91)?[6-9]\d{9}$/.test(cleaned);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check session validity
    if (!sessionManager.checkAndAutoLogout(navigate)) {
      return;
    }
    
    // Check if user is logged in
    const userType = localStorage.getItem('userType');
    const name = localStorage.getItem('userName');
    const email = localStorage.getItem('userEmail');
    const userId = localStorage.getItem('userId');
    
    if (userType !== 'user' || !name || !userId) {
      alert('Please login first to book a service');
      navigate('/login');
      return;
    }
    
    // Validate at least one service is selected
    if (formData.services.length === 0) {
      alert('Please select at least one service');
      return;
    }
    
    // Validate preferred date
    if (!formData.preferredDate) {
      alert('Please select a preferred date');
      return;
    }
    
    // Validate Indian phone number
    if (!validateIndianPhone(formData.phone)) {
      alert('Please enter a valid Indian mobile number (10 digits starting with 6-9)');
      return;
    }
    
    // Refresh session on activity
    sessionManager.refreshSession();
    
    try {
      // Prepare booking data for backend API
      const bookingData = {
        userId: userId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: {
          street: formData.address,
          city: formData.city,
          state: 'Telangana', // Default for Hyderabad
          pincode: formData.pincode,
          googleMapsLink: formData.googleLocation || '' // Include Google Maps link if provided
        },
        services: formData.services.map(serviceName => ({
          serviceName: serviceName,
          category: serviceName.split(' - ')[0] || 'General', // Extract category from service name
          estimatedPrice: 'To be determined'
        })),
        date: formData.preferredDate,
        time: formData.preferredTime || '9:00 AM - 12:00 PM',
        workDescription: formData.workDescription
      };

      console.log('🚀 Submitting booking to backend:', bookingData);

      // Call backend API
      const response = await bookingService.createBooking(bookingData);
      
      console.log('✅ Backend response:', response);

      if (response.success) {
        const backendBooking = response.data.booking;
        
        // No localStorage saving - everything stored in MongoDB only
        
        setIsSubmitted(true);
        
        // Show success message with backend booking ID
        alert(`Booking submitted successfully!\nYour Booking ID: ${backendBooking.bookingId}\nPlease save this ID for future reference.`);
        
        // Reset form
        const userName = localStorage.getItem('userName');
        const userEmail = localStorage.getItem('userEmail');
        setFormData({
          services: [],
          name: userName || '',
          email: userEmail || '',
          phone: '',
          address: '',
          city: 'Hyderabad',
          area: '',
          pincode: '',
          landmark: '',
          googleLocation: '',
          workDescription: '',
          preferredDate: '',
          preferredTime: '',
        });
        setSelectedService('');

        setTimeout(() => {
          setIsSubmitted(false);
          navigate('/user/dashboard');
        }, 2000);
      } else {
        throw new Error(response.message || 'Failed to create booking');
      }
      
    } catch (error) {
      console.error('❌ Booking submission failed:', error);
      
      // Show specific error message
      let errorMessage = 'Failed to submit booking. ';
      if (error.message) {
        errorMessage += error.message;
      } else if (error.errors && Array.isArray(error.errors)) {
        errorMessage += error.errors.join(', ');
      } else {
        errorMessage += 'Please check your internet connection and try again.';
      }
      
      alert(errorMessage);
      
      // Don't reset form on error, let user retry
    }
  };

  // Preselect service from Services page flow
  useEffect(() => {
    const handlePreselectedService = async () => {
      try {
        const pre = localStorage.getItem('preSelectedService');
        if (pre) {
          // Check if user already has pending booking for this service from backend
          const userId = localStorage.getItem('userId');
          if (userId) {
            // Use non-async approach to avoid syntax error
            bookingService.getUserBookings(userId)
              .then(response => {
                if (response.success && response.data.bookings) {
                  const pendingBookings = response.data.bookings.filter(b => 
                    b.status === 'Pending' || b.status === 'Confirmed'
                  );
                  
                  const hasPendingService = pendingBookings.some(booking => 
                    booking.services.some(s => s.serviceName === pre)
                  );
                
                  if (hasPendingService) {
                    alert(`You already have a pending booking for "${pre}". Please check your dashboard or wait for the current booking to complete before booking again.`);
                    navigate('/user/dashboard');
                    localStorage.removeItem('preSelectedService');
                    return;
                  }
                }
                
                // Safe to add the service if no pending booking found
                addServiceToBooking(pre);
                localStorage.removeItem('preSelectedService');
              })
              .catch(error => {
                console.log('Could not check existing bookings:', error.message);
                // Continue with adding service if check fails
                addServiceToBooking(pre);
                localStorage.removeItem('preSelectedService');
              });
          } else {
            // No userId, just add the service
            addServiceToBooking(pre);
            localStorage.removeItem('preSelectedService');
          }
        }
      } catch (e) {
        console.error('Error handling preselected service:', e);
      }
    };

    handlePreselectedService();
  }, [navigate]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">📋 Book a Service</h1>
          <p className="text-xl text-gray-100">Fill out the form below and we'll get back to you soon</p>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Service Availability Notice */}
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-8 rounded">
            <div className="flex items-center">
              <div className="text-yellow-600 text-2xl mr-3">📍</div>
              <div>
                <p className="font-semibold text-yellow-800">Currently Serving: Hyderabad Only</p>
                <p className="text-yellow-700 text-sm">We are expanding to more cities soon!</p>
              </div>
            </div>
          </div>

          {isSubmitted && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 fade-in">
              Booking request submitted successfully! Our team will contact you soon.
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 space-y-6">
            {/* Multiple Service Selection - Mobile Optimized */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Services * (You can add multiple services)
              </label>
              
              {/* Service Selection - Mobile Responsive */}
              <div className="space-y-3 mb-4">
                {/* Dropdown - Full width on mobile */}
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full px-4 py-4 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                >
                  <option value="">Choose a service to add...</option>
                  {services.filter(service => !formData.services.includes(service)).map((service, index) => (
                    <option key={index} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
                
                {/* Add Button - Full width on mobile */}
                <button
                  type="button"
                  onClick={addService}
                  disabled={!selectedService}
                  className="w-full px-6 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium text-base transition-colors active:bg-primary-800 disabled:opacity-50"
                >
                  {selectedService ? `+ Add "${selectedService}"` : '+ Add Service'}
                </button>
              </div>

              {/* Selected Services List - Mobile Optimized */}
              {formData.services.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs font-semibold">
                      {formData.services.length}
                    </span>
                    Selected Services:
                  </h4>
                  <div className="space-y-2">
                    {formData.services.map((service, index) => (
                      <div key={index} className="bg-primary-50 border border-primary-200 rounded-lg p-4 shadow-sm">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <span className="text-sm font-medium text-gray-800 leading-relaxed block">
                              {service}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeService(service)}
                            className="flex-shrink-0 bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-700 px-3 py-2 rounded-lg font-medium text-sm transition-colors active:bg-red-300"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Clear All Services Button */}
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, services: [] }))}
                    className="w-full py-2 text-red-600 hover:text-red-700 font-medium text-sm border border-red-200 hover:border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Clear All Services
                  </button>
                </div>
              )}
            </div>

            {/* Date and Time Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Date *
                </label>
                <input
                  type="date"
                  id="preferredDate"
                  name="preferredDate"
                  required
                  min={getMinDate()}
                  value={formData.preferredDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="preferredTime" className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Time (Optional)
                </label>
                <select
                  id="preferredTime"
                  name="preferredTime"
                  value={formData.preferredTime}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select time slot</option>
                  <option value="9:00 AM - 12:00 PM">Morning (9:00 AM - 12:00 PM)</option>
                  <option value="12:00 PM - 3:00 PM">Afternoon (12:00 PM - 3:00 PM)</option>
                  <option value="3:00 PM - 6:00 PM">Evening (3:00 PM - 6:00 PM)</option>
                  <option value="6:00 PM - 9:00 PM">Night (6:00 PM - 9:00 PM)</option>
                </select>
              </div>
            </div>

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="John Doe"
              />
            </div>

            {/* Email and Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number (Indian) *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="+91 9876543210"
                  pattern="(\+91)?[6-9]\d{9}"
                />
                <p className="text-xs text-gray-500 mt-1">Format: +91 followed by 10-digit mobile number</p>
              </div>
            </div>

            {/* Detailed Address Section */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">📍 Full Address Details (Hyderabad Only)</h3>
              
              {/* House/Street Address */}
              <div className="mb-4">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  House/Apartment Number & Street *
                </label>
                <textarea
                  id="address"
                  name="address"
                  rows="2"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="House No. 123, Street Name, Colony Name"
                ></textarea>
              </div>

              {/* Area and Pincode */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-2">
                    Area/Locality *
                  </label>
                  <input
                    type="text"
                    id="area"
                    name="area"
                    required
                    value={formData.area}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., Hitech City, Gachibowli"
                  />
                </div>
                <div>
                  <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-2">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    id="pincode"
                    name="pincode"
                    required
                    value={formData.pincode}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="500032"
                    pattern="[0-9]{6}"
                  />
                </div>
              </div>

              {/* Landmark */}
              <div className="mb-4">
                <label htmlFor="landmark" className="block text-sm font-medium text-gray-700 mb-2">
                  Nearby Landmark (Optional)
                </label>
                <input
                  type="text"
                  id="landmark"
                  name="landmark"
                  value={formData.landmark}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Near Metro Station, Opposite Park"
                />
              </div>

              {/* City (Hyderabad - Read Only) */}
              <div className="mb-4">
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  required
                  value={formData.city}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                />
              </div>

              {/* Google Maps Location Link */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
                <label htmlFor="googleLocation" className="block text-sm font-medium text-blue-800 mb-2">
                  🔗 Google Maps Location Link (Optional but Recommended)
                </label>
                <p className="text-xs text-blue-600 mb-2">
                  Share your Google Maps link to help us find your location easily
                </p>
                <input
                  type="url"
                  id="googleLocation"
                  name="googleLocation"
                  value={formData.googleLocation}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-blue-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Paste your Google Maps link here..."
                />
              </div>
            </div>

            {/* Work Description */}
            <div className="border-t pt-6">
              <label htmlFor="workDescription" className="block text-sm font-medium text-gray-700 mb-2">
                🔧 Describe the Work You Need Done *
              </label>
              <textarea
                id="workDescription"
                name="workDescription"
                rows="4"
                required
                value={formData.workDescription}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Please provide details about the work you need. For example: AC not cooling properly, needs repair. Room temperature not reaching below 28°C. Last serviced 6 months ago."
              ></textarea>
              <p className="text-xs text-gray-500 mt-1">
                Be specific about your requirements, problem description, or timeline
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-primary-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors duration-200 text-lg shadow-md"
            >
              Submit Booking Request
            </button>

            <p className="text-sm text-gray-500 text-center">
              By submitting this form, you agree to our terms and conditions
            </p>
          </form>

          {/* Quick Contact Info */}
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Need Immediate Help?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">📞</span>
                <div>
                  <p className="font-semibold text-gray-800">Call Us</p>
                  <p className="text-primary-600">+919505909059</p>
                  <p className="text-primary-600">9848631343</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">💬</span>
                <div>
                  <p className="font-semibold text-gray-800">WhatsApp</p>
                  <p className="text-primary-600">Chat Now</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Booking;

