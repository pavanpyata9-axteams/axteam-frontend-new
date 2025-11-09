import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getServiceIcon } from '../utils/serviceIcons';
import { sessionManager } from '../utils/sessionManager';

// Logo paths for appliance services (referencing public directory)
const acRepairLogo = '/assets/gallery/AC-Repair-and-Service.png';
const acInstallationLogo = '/assets/gallery/AC-Installation-and-Uninstallation.png';
const acAdvancedPipingLogo = '/assets/gallery/AC-Advanced-piping.png';
const acGasFillingLogo = '/assets/gallery/AC-GAS-FILLING.png';
const geyserRepairLogo = '/assets/gallery/Geyser-Repair-and-Service.png';
const geyserInstallationLogo = '/assets/gallery/Geyser-Installation-and-Uninstallation.png';
const waterPurifierRepairLogo = '/assets/gallery/Water-Purifier-Repair-and-Service.png';
const waterPurifierInstallationLogo = '/assets/gallery/Water-Purifier-Installation-and-Uninstallation.png';
const microvenRepairLogo = '/assets/gallery/Microven-Repair-and-Service.png';
const washingMachineInstallationLogo = '/assets/gallery/Washing-Machine-Installation-and-Uninstallation.png';
const topLoadFullyAutomaticLogo = '/assets/gallery/Top-Load-Fully-Automatic-Repair-and-Service.png';
const frontLoadFullyAutomaticLogo = '/assets/gallery/Front-Load-Fully-Automatic-Repair-and-Service.png';
const semiAutomaticLogo = '/assets/gallery/Semi-Automatic-Repair-and-Service.png';
const doubleSingleDoorLogo = '/assets/gallery/DoubleSingle-Door-Repair-and-Service.png';
const singleDoorLogo = '/assets/gallery/Single-Door-Repair-and-Service.png';
const sideBySideDoorLogo = '/assets/gallery/ide-by-Side-Door-Repair-and-Service.png';

// Logo paths for home repair & service categories (referencing public directory)
const interiorWorkLogo = '/assets/gallery/Full-BuildingFlat-Interior-Work.png';
const interiorRepairLogo = '/assets/gallery/Interior-Repair-and-Service-Existing-Work.png';
const interiorAdjustmentsLogo = '/assets/gallery/Interior-Work-AdjustmentsChanges.png';
const completeWiringLogo = '/assets/gallery/Complete-Wiring-NewOld-Buildings-and-Flats.png';
const commercialElectricalLogo = '/assets/gallery/Commercial-Electrical-Works.png';
const electricalRepairLogo = '/assets/gallery/Electrical-Repair-and-Maintenance.png';
const wallPanelingLogo = '/assets/gallery/Wall-Paneling-Flats-and-Buildings.png';
const pipingWorkLogo = '/assets/gallery/Piping-for-New-BuildingsFlats-Complete-Work.png';
const cleaningLogo = '/assets/gallery/Cleaning-Entire-Building-or-Flat.png';
const generalRepairsLogo = '/assets/gallery/General-Home-Repairs.png';
const wallPaintingLogo = '/assets/gallery/Wall-Painting-and-Touch-up.png';
const buildingPaintingLogo = '/assets/gallery/Complete-Building-Painting.png';
const texturePaintingLogo = '/assets/gallery/Texture-and-Designer-Painting.png';
const advancedPipingInstallationLogo = '/assets/gallery/AC-Advanced-Piping-Installation.png';
const advancedPipingRepairLogo = '/assets/gallery/AC-Advanced-Piping-Repair-and-Service.png';
const copperPipeInstallationLogo = '/assets/gallery/AC-Copper-Pipe-Installation.png';
const refrigerantLineInstallationLogo = '/assets/gallery/AC-Refrigerant-Line-Installation.png';
const cctvInstallationLogo = '/assets/gallery/CCTV-Installation-and-Uninstallation.png';
const cctvRepairLogo = '/assets/gallery/CCTV-Repair-and-Maintenance.png';
const securitySystemLogo = '/assets/gallery/Security-System-Setup.png';

// Function to get the appropriate logo for each service item
const getServiceLogo = (serviceItem) => {
  const logoMap = {
    // Appliance Services
    'AC - Repair & Service': acRepairLogo,
    'AC - Gas Fill Service': acGasFillingLogo,
    'AC - Installation & Uninstallation': acInstallationLogo,
    'AC - Advanced piping Repair & Service': acAdvancedPipingLogo,
    'Geyser - Repair & Service': geyserRepairLogo,
    'Geyser - Installation & Uninstallation': geyserInstallationLogo,
    'Water Purifier - Repair & Service': waterPurifierRepairLogo,
    'Water Purifier - Installation & Uninstallation': waterPurifierInstallationLogo,
    'Microven - Repair & Service': microvenRepairLogo,
    'Washing Machine - Installation & Uninstallation': washingMachineInstallationLogo,
    'Top Load Fully Automatic - Repair & Service': topLoadFullyAutomaticLogo,
    'Front Load Fully Automatic - Repair & Service': frontLoadFullyAutomaticLogo,
    'Semi Automatic - Repair & Service': semiAutomaticLogo,
    'Double/Single Door - Repair & Service': doubleSingleDoorLogo,
    'Single Door - Repair & Service': singleDoorLogo,
    'Side by Side Door - Repair & Service': sideBySideDoorLogo,
    
    // Home Repair & Service - Interior
    'Full Building/Flat Interior Work': interiorWorkLogo,
    'Interior Repair & Service (Existing Work)': interiorRepairLogo,
    'Interior Work Adjustments/Changes': interiorAdjustmentsLogo,
    
    // Home Repair & Service - Electrical
    'Complete Wiring - New/Old Buildings & Flats': completeWiringLogo,
    'Commercial Electrical Works': commercialElectricalLogo,
    'Electrical Repair & Maintenance': electricalRepairLogo,
    
    // Home Repair & Service - Home Maintenance
    'Wall Paneling - Flats & Buildings': wallPanelingLogo,
    'Piping for New Buildings/Flats (Complete Work)': pipingWorkLogo,
    'Cleaning - Entire Building or Flat': cleaningLogo,
    'General Home Repairs': generalRepairsLogo,
    
    // Home Repair & Service - Wall Painting
    'Wall Painting & Touch-up': wallPaintingLogo,
    'Complete Building Painting': buildingPaintingLogo,
    'Texture & Designer Painting': texturePaintingLogo,
    
    // Home Repair & Service - AC Advanced Piping
    'AC - Advanced Piping Installation': advancedPipingInstallationLogo,
    'AC - Advanced Piping Repair & Service': advancedPipingRepairLogo,
    'AC - Copper Pipe Installation': copperPipeInstallationLogo,
    'AC - Refrigerant Line Installation': refrigerantLineInstallationLogo,
    
    // Home Repair & Service - CCTV
    'CCTV - Installation & Uninstallation': cctvInstallationLogo,
    'CCTV - Repair & Maintenance': cctvRepairLogo,
    'Security System Setup': securitySystemLogo
  };
  
  return logoMap[serviceItem] || null;
};

const categoryEmojis = {
  'Washing Machine': '🧺',
  'Refrigerator': '🧊',
  'Geyser': '🚿',
  'Water Purifier': '💧',
  'Microven': '🔆',
  'AC': '❄️',
  'Interior': '🏢',
  'Electrical Service': '⚡',
  'Home Maintenance & Services': '🧹',
  'Wall Painting': '🎨',
  'AC Advanced Piping': '❄️',
  'CCTV': '📹',
};

const applianceCategories = [
  {
    name: 'Washing Machine',
    items: [
      'Top Load Fully Automatic - Repair & Service',
      'Front Load Fully Automatic - Repair & Service',
      'Semi Automatic - Repair & Service',
      'Washing Machine - Installation & Uninstallation',
    ],
  },
  {
    name: 'Refrigerator',
    items: [
      'Double/Single Door - Repair & Service',
      'Single Door - Repair & Service',
      'Side by Side Door - Repair & Service',
    ],
  },
  {
    name: 'Geyser',
    items: [
      'Geyser - Repair & Service',
      'Geyser - Installation & Uninstallation',
    ],
  },
  {
    name: 'Water Purifier',
    items: [
      'Water Purifier - Repair & Service',
      'Water Purifier - Installation & Uninstallation',
    ],
  },
  {
    name: 'Microven',
    items: [
      'Microven - Repair & Service',
    ],
  },
  {
    name: 'AC',
    items: [
      'AC - Repair & Service',
      'AC - Gas Fill Service',
      'AC - Installation & Uninstallation',
      'AC - Advanced piping Repair & Service',
    ],
  },
];

const homeRepairCategories = [
  {
    name: 'Interior',
    items: [
      'Full Building/Flat Interior Work',
      'Interior Repair & Service (Existing Work)',
      'Interior Work Adjustments/Changes',
    ],
  },
  {
    name: 'Electrical Service',
    items: [
      'Complete Wiring - New/Old Buildings & Flats',
      'Commercial Electrical Works',
      'Electrical Repair & Maintenance',
    ],
  },
  {
    name: 'Home Maintenance & Services',
    items: [
      'Wall Paneling - Flats & Buildings',
      'Piping for New Buildings/Flats (Complete Work)',
      'Cleaning - Entire Building or Flat',
      'General Home Repairs',
    ],
  },
  {
    name: 'Wall Painting',
    items: [
      'Wall Painting & Touch-up',
      'Complete Building Painting',
      'Texture & Designer Painting',
    ],
  },
  {
    name: 'AC Advanced Piping',
    items: [
      'AC - Advanced Piping Installation',
      'AC - Advanced Piping Repair & Service',
      'AC - Copper Pipe Installation',
      'AC - Refrigerant Line Installation',
    ],
  },
  {
    name: 'CCTV',
    items: [
      'CCTV - Installation & Uninstallation',
      'CCTV - Repair & Maintenance',
      'Security System Setup',
    ],
  },
];

const Services = () => {
  const navigate = useNavigate();
  const [showApplianceModal, setShowApplianceModal] = useState(false);
  const [showHomeRepairModal, setShowHomeRepairModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Set hasAnimated after component mounts
  useEffect(() => {
    const timer = setTimeout(() => setHasAnimated(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Background image mapping for appliance categories
  const getApplianceBackground = (categoryName) => {
    const backgroundMap = {
      'Washing Machine': '/assets/appliance/washing-machine-backgound.png',
      'Refrigerator': '/assets/appliance/refrigerator-background.png',
      'Geyser': '/assets/appliance/geyser-backgound.png',
      'Water Purifier': '/assets/appliance/water-purefier-backgorud.png',
      'Microven': '/assets/appliance/microwave-oven-backgound.png',
      'AC': '/assets/appliance/ac-background.png'
    };
    return backgroundMap[categoryName] || '';
  };

  // Get specific background size for each category
  const getBackgroundSize = (categoryName) => {
    const sizeMap = {
      'Washing Machine': '70% auto', // Zoomed in more
      'Geyser': '70% auto', // Zoomed in more
      'Refrigerator': '60% auto',
      'Water Purifier': '60% auto',
      'Microven': '60% auto',
      'AC': '60% auto'
    };
    return sizeMap[categoryName] || '60% auto';
  };

  // Background image mapping for home repair & service categories
  const getHomeServiceBackground = (categoryName) => {
    const backgroundMap = {
      'Interior': '/assets/services/interior-background-image.png',
      'Electrical Service': '/assets/services/Electrical-Service-background-image.png',
      'Home Maintenance & Services': '/assets/services/Home-Maintenance-and-Services-background-image.png',
      'Wall Painting': '/assets/services/wall-painting-background-image.png',
      'CCTV': '/assets/services/cctv-background-image.png',
      'AC Advanced Piping': '/assets/services/Advanced-Pipelining-background-image.png'
    };
    return backgroundMap[categoryName] || '';
  };

  // Get specific background size for home service categories
  const getHomeServiceBackgroundSize = (categoryName) => {
    const sizeMap = {
      'Interior': '70% auto',
      'Electrical Service': '70% auto',
      'Home Maintenance & Services': '80% auto', // Zoomed in more
      'Wall Painting': '70% auto',
      'CCTV': '70% auto',
      'AC Advanced Piping': '70% auto'
    };
    return sizeMap[categoryName] || '70% auto';
  };

  const openCategory = (section, category) => {
    setSelectedCategory(category);
    if (section === 'appliance') setShowApplianceModal(true);
    if (section === 'homeRepair') setShowHomeRepairModal(true);
  };

  const bookItem = (itemLabel) => {
    try {
      // Safe to proceed with booking (duplicate check already done in button onClick)
      localStorage.setItem('preSelectedService', itemLabel);
      
      // Check if user is logged in with valid session
      if (sessionManager.isSessionValid()) {
        // User is logged in - go directly to booking
        navigate('/booking');
      } else {
        // User not logged in - redirect to login
        navigate('/login');
      }
    } catch (e) {
      console.error('Error in bookItem:', e);
      // Fallback - just navigate to login
      navigate('/login');
    }
  };

  const CategoryGrid = ({ section, categories }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((cat, index) => {
        const isAppliance = section === 'appliance';
        const isHomeService = section === 'homeRepair';
        const applianceBackground = isAppliance ? getApplianceBackground(cat.name) : '';
        const homeServiceBackground = isHomeService ? getHomeServiceBackground(cat.name) : '';
        const backgroundImage = applianceBackground || homeServiceBackground;
        const hasBackground = isAppliance || isHomeService;
        
        return (
          <button
            key={cat.name}
            onClick={() => openCategory(section, cat)}
            className={`bg-white rounded-xl shadow hover:shadow-xl transition-all duration-500 p-6 text-left group border border-gray-100 transform hover:-translate-y-2 hover:scale-105 relative overflow-hidden ${
              !hasAnimated ? 'animate-fadeIn' : ''
            }`}
            style={{
              animationDelay: !hasAnimated ? `${index * 150}ms` : '0ms',
              backgroundImage: hasBackground && backgroundImage ? `url('${backgroundImage}')` : 'none',
              backgroundSize: hasBackground && backgroundImage ? (isAppliance ? getBackgroundSize(cat.name) : getHomeServiceBackgroundSize(cat.name)) : 'auto',
              backgroundPosition: hasBackground && backgroundImage ? 'left center' : 'initial',
              backgroundRepeat: hasBackground && backgroundImage ? 'no-repeat' : 'repeat',
            }}
          >
            {/* Dark overlay for categories with background images to ensure text readability */}
            {hasBackground && backgroundImage && (
              <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-20 transition-all duration-300 z-0"></div>
            )}
            
            <div className={`relative z-10 ${hasBackground && backgroundImage ? 'text-white ml-auto w-1/2 text-right' : 'text-gray-800'}`}>
              {/* Hide emoji for categories with background images */}
              <div className={`text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300 ${
                hasBackground && backgroundImage ? 'opacity-0' : ''
              }`}>
                {categoryEmojis[cat.name] || '🧰'}
              </div>
              
              <h3 className={`text-xl font-semibold transition-all duration-500 ${
                hasBackground && backgroundImage
                  ? 'text-white group-hover:text-yellow-300 transform group-hover:-translate-x-8 group-hover:text-left' 
                  : 'text-gray-800 group-hover:text-primary-600'
              }`}>
                {cat.name}
              </h3>
              
              <p className={`text-sm mt-2 opacity-90 transition-all duration-500 ${
                hasBackground && backgroundImage
                  ? 'text-gray-100 group-hover:text-yellow-100 transform group-hover:-translate-x-8 group-hover:text-left' 
                  : 'text-gray-500'
              }`}>
                Tap to view available services
              </p>
              
              <div className={`mt-4 opacity-0 group-hover:opacity-100 transition-all duration-500 ${
                hasBackground && backgroundImage ? 'transform group-hover:-translate-x-8' : ''
              }`}>
                <div className={`w-16 h-0.5 ${
                  hasBackground && backgroundImage ? 'bg-yellow-300' : 'bg-primary-600'
                }`}></div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );

  const Modal = ({ open, onClose, category }) => {
    if (!open || !category) return null;
    // Optional thumbnails can be provided via localStorage key 'serviceThumbnails'
    // Format: { "Category - Item": "dataUrl or url" }
    let thumbMap = {};
    try {
      thumbMap = JSON.parse(localStorage.getItem('serviceThumbnails') || '{}') || {};
    } catch (e) {}
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between border-b p-5">
            <div className="flex items-center gap-3">
              <div className="text-3xl">{categoryEmojis[category.name] || '🧰'}</div>
              <h3 className="text-2xl font-bold text-gray-800">{category.name}</h3>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
          </div>
          <div className="p-4 md:p-5 grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            {category.items.map((item, index) => {
              const key = `${category.name} - ${item}`;
              const thumb = thumbMap[key];
              const serviceIcon = getServiceIcon(item);
              
              return (
                <div 
                  key={item} 
                  className="border rounded-xl p-4 hover:border-primary-300 hover:shadow-md transition-all duration-300 group animate-slideInUp opacity-0"
                  style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
                >
                  <div className="flex items-start gap-3">
                    {thumb ? (
                      <img src={thumb} alt={item} className="w-12 h-12 md:w-14 md:h-14 rounded object-cover flex-shrink-0 shadow-sm group-hover:shadow-md transition-shadow duration-300" />
                    ) : getServiceLogo(item) ? (
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center flex-shrink-0 group-hover:from-primary-50 group-hover:to-primary-100 transition-all duration-300 p-1">
                        <img src={getServiceLogo(item)} alt={item} className="w-full h-full object-contain" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400 flex items-center justify-center text-lg md:text-xl flex-shrink-0 group-hover:from-primary-50 group-hover:to-primary-100 group-hover:text-primary-600 transition-all duration-300">🖼️</div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-start gap-2 mb-2">
                        <span className="text-lg flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300">{serviceIcon}</span>
                        <p className="font-semibold text-gray-800 leading-tight">{item}</p>
                      </div>
                      <button
                        onClick={() => {
                          // Check for duplicate booking before proceeding
                          if (sessionManager.isSessionValid()) {
                            const userEmail = localStorage.getItem('userEmail');
                            if (userEmail) {
                              const allBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
                              const userBookings = allBookings.filter(b => b.email === userEmail);
                              const pendingBookings = userBookings.filter(b => b.status === 'Pending' || b.status === 'Confirmed');
                              
                              const hasPendingService = pendingBookings.some(booking => {
                                if (booking.services) {
                                  return booking.services.includes(key);
                                } else {
                                  return booking.service === key;
                                }
                              });
                              
                              if (hasPendingService) {
                                alert(`You already have a pending booking for "${key}". Your service is not complete yet. Please wait for the current booking to complete before booking this service again.`);
                                return;
                              }
                            }
                          }
                          bookItem(key);
                        }}
                        className="mt-2 md:mt-3 inline-block bg-primary-600 text-white px-3 md:px-4 py-2 rounded-lg text-sm hover:bg-primary-700 active:bg-primary-800 transition-all duration-200 transform hover:scale-105 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                      >
                        Book this service
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="p-5 border-t text-right">
            <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">Close</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      <section
        className="text-white py-12 md:py-16"
        style={{
          background: 'linear-gradient(90deg, #dc2626, #991b1b)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 md:mb-4">Our Services</h1>
          <p className="text-lg md:text-xl text-gray-100">Select a section to view categories and services</p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Appliance Services</h2>
            <p className="text-gray-600 mb-6">Repair, service, installation and uninstallation for home appliances</p>
            <CategoryGrid section="appliance" categories={applianceCategories} />
          </div>

          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Home Repair & Service</h2>
            <p className="text-gray-600 mb-6">Interior, electrical, maintenance, and painting services</p>
            <CategoryGrid section="homeRepair" categories={homeRepairCategories} />
          </div>
        </div>
      </section>

      <Modal open={showApplianceModal} onClose={() => setShowApplianceModal(false)} category={selectedCategory} />
      <Modal open={showHomeRepairModal} onClose={() => setShowHomeRepairModal(false)} category={selectedCategory} />
    </div>
  );
};

export default Services;