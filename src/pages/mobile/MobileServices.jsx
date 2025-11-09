import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getServiceIcon } from '../../utils/serviceIcons';
import { sessionManager } from '../../utils/sessionManager';

// Import logos for appliance services (referencing public directory)
const acRepairLogo = '/AC - Repair & Service.png';
const acInstallationLogo = '/AC - Installation & Uninstallation.png';
const acAdvancedPipingLogo = '/AC Advanced piping .png';
const acGasFillingLogo = '/AC GAS FILLING.png';
const geyserRepairLogo = '/Geyser - Repair & Service.png';
const geyserInstallationLogo = '/Geyser - Installation & Uninstallation.png';
const waterPurifierRepairLogo = '/Water Purifier - Repair & Service.png';
const waterPurifierInstallationLogo = '/Water Purifier - Installation & Uninstallation.png';
const microvenRepairLogo = '/Microven - Repair & Service.png';
const washingMachineInstallationLogo = '/Washing Machine - Installation & Uninstallation.png';
const topLoadFullyAutomaticLogo = '/Top Load Fully Automatic - Repair & Service.png';
const frontLoadFullyAutomaticLogo = '/Front Load Fully Automatic - Repair & Service.png';
const semiAutomaticLogo = '/Semi Automatic - Repair & Service.png';
const doubleSingleDoorLogo = '/DoubleSingle Door - Repair & Service.png';
const singleDoorLogo = '/Single Door - Repair & Service.png';
const sideBySideDoorLogo = '/ide by Side Door - Repair & Service.png';

// Logo paths for home repair & service categories (referencing public directory)
const interiorWorkLogo = '/Full BuildingFlat Interior Work.png';
const interiorRepairLogo = '/Interior Repair & Service (Existing Work).png';
const interiorAdjustmentsLogo = '/Interior Work AdjustmentsChanges.png';
const completeWiringLogo = '/Complete Wiring - NewOld Buildings & Flats.png';
const commercialElectricalLogo = '/Commercial Electrical Works.png';
const electricalRepairLogo = '/Electrical Repair & Maintenance.png';
const wallPanelingLogo = '/Wall Paneling - Flats & Buildings.png';
const pipingWorkLogo = '/Piping for New BuildingsFlats (Complete Work).png';
const cleaningLogo = '/Cleaning - Entire Building or Flat.png';
const generalRepairsLogo = '/General Home Repairs.png';
const wallPaintingLogo = '/Wall Painting & Touch-up.png';
const buildingPaintingLogo = '/Complete Building Painting.png';
const texturePaintingLogo = '/Texture & Designer Painting.png';
const advancedPipingInstallationLogo = '/AC - Advanced Piping Installation.png';
const advancedPipingRepairLogo = '/AC - Advanced Piping Repair & Service.png';
const copperPipeInstallationLogo = '/AC - Copper Pipe Installation.png';
const refrigerantLineInstallationLogo = '/AC - Refrigerant Line Installation.png';
const cctvInstallationLogo = '/CCTV - Installation & Uninstallation.png';
const cctvRepairLogo = '/CCTV - Repair & Maintenance.png';
const securitySystemLogo = '/Security System Setup.png';

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

// Function to provide category backgrounds - same as desktop
const getCategoryBackground = (categoryName) => {
  const imageMap = {
    // Appliance services
    'Washing Machine': '/assets/appliance/washing-machine-repair.jpg',
    'Refrigerator': '/assets/appliance/Refrigerator.jpg',
    'Geyser': '/assets/appliance/geyser.jpg',
    'Water Purifier': '/assets/appliance/water-purifier.jpg',
    'Microven': '/assets/appliance/microwave.jpg',
    'AC': '/assets/appliance/ac.jpg',
    // Home services
    'Interior': '/assets/services/interior.jpg',
    'Electrical Service': '/assets/services/Electrical-Service.png',
    'Home Maintenance & Services': '/assets/services/Home-Maintenance-and-Services.png',
    'Wall Painting': '/assets/services/Wall-Painting.png',
    'AC Advanced Piping': '/assets/services/Advanced-Pipelining.png',
    'CCTV': '/assets/services/cctv.png'
  };
  return imageMap[categoryName] || null;
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

const MobileServices = () => {
  const navigate = useNavigate();
  const [showApplianceModal, setShowApplianceModal] = useState(false);
  const [showHomeRepairModal, setShowHomeRepairModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Prevent too many animations on category switches
  useEffect(() => {
    const timer = setTimeout(() => setHasAnimated(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const openCategory = (section, category) => {
    setSelectedCategory(category);
    if (section === 'appliance') setShowApplianceModal(true);
    if (section === 'home') setShowHomeRepairModal(true);
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
    <div className="grid grid-cols-2 gap-3">
      {categories.map((cat, index) => {
        const backgroundImage = getCategoryBackground(cat.name);
        
        return (
          <button
            key={cat.name}
            onClick={() => openCategory(section, cat)}
            className={`bg-white rounded-2xl shadow-md p-4 text-center active:shadow-lg active:scale-95 transition-all duration-300 border border-gray-100 relative overflow-hidden group ${!hasAnimated ? 'animate-fadeIn' : ''}`}
            style={{
              backgroundImage: backgroundImage ? `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url("${backgroundImage}")` : 'linear-gradient(135deg, #f3f4f6, #e5e7eb)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              animationDelay: !hasAnimated ? `${index * 150}ms` : '0ms'
            }}
          >
            <div className={`relative z-10 ${backgroundImage ? 'text-white' : 'text-gray-800'}`}>
              {!backgroundImage && (
                <div className="text-3xl mb-2 transform group-active:scale-110 transition-transform duration-200">
                  {categoryEmojis[cat.name] || '🧰'}
                </div>
              )}
              <h3 className={`text-sm font-semibold leading-tight ${backgroundImage ? 'text-white drop-shadow-lg' : 'text-gray-800'}`}>
                {cat.name}
              </h3>
              <p className={`text-xs mt-1 opacity-90 ${backgroundImage ? 'text-gray-100' : 'text-gray-500'}`}>
                Tap to view services
              </p>
              <div className="mt-2 opacity-0 group-active:opacity-100 transition-opacity duration-200">
                <div className={`w-8 h-0.5 mx-auto ${backgroundImage ? 'bg-white' : 'bg-primary-600'}`}></div>
              </div>
            </div>
            {!backgroundImage && (
              <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-primary-100 opacity-0 group-active:opacity-30 transition-opacity duration-200"></div>
            )}
          </button>
        );
      })}
    </div>
  );

  const MobileModal = ({ open, onClose, category }) => {
    if (!open || !category) return null;
    
    let thumbMap = {};
    try {
      thumbMap = JSON.parse(localStorage.getItem('serviceThumbnails') || '{}') || {};
    } catch (e) {}

    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-end justify-center" onClick={onClose}>
        <div 
          className="bg-white rounded-t-3xl w-full max-h-[85vh] overflow-hidden shadow-xl animate-slide-up" 
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b p-4 bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{categoryEmojis[category.name] || '🧰'}</div>
              <h3 className="text-lg font-bold text-gray-800">{category.name}</h3>
            </div>
            <button 
              onClick={onClose} 
              className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-300 active:bg-gray-400 transition-colors"
            >
              ✕
            </button>
          </div>
          
          {/* Content - Scrollable */}
          <div className="p-4 overflow-y-auto max-h-[calc(85vh-80px)] space-y-3">
            {category.items.map((item, index) => {
              const key = `${category.name} - ${item}`;
              const thumb = thumbMap[key];
              const serviceIcon = getServiceIcon(item);
              
              return (
                <div 
                  key={item} 
                  className="border border-gray-200 rounded-2xl p-4 bg-gray-50 animate-slideInUp opacity-0"
                  style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
                >
                  <div className="flex items-start gap-3">
                    {thumb ? (
                      <img src={thumb} alt={item} className="w-12 h-12 rounded-xl object-cover flex-shrink-0 shadow-sm" />
                    ) : getServiceLogo(item) ? (
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 text-gray-400 flex items-center justify-center text-lg flex-shrink-0 p-1">
                        <img src={getServiceLogo(item)} alt={item} className="w-full h-full object-contain object-center" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 text-gray-400 flex items-center justify-center text-lg flex-shrink-0">🖼️</div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-start gap-2 mb-3">
                        <span className="text-lg flex-shrink-0 mt-0.5">{serviceIcon}</span>
                        <p className="font-semibold text-gray-800 text-sm leading-tight">{item}</p>
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
                        className="w-full bg-primary-600 text-white px-4 py-3 rounded-xl text-sm font-medium hover:bg-primary-700 active:bg-primary-800 active:scale-95 transition-all duration-200 shadow-sm active:shadow-md"
                      >
                        Book this service
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <section
        className="text-white py-8 px-4 bg-cover bg-center"
        style={{
          backgroundImage: (() => {
            const bg = localStorage.getItem('servicesHeaderBg');
            return bg ? `url(${bg})` : 'linear-gradient(90deg, #dc2626, #991b1b)';
          })(),
        }}
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Our Services</h1>
          <p className="text-sm text-gray-100">Select a section to view services</p>
        </div>
      </section>

      <div className="px-4 py-8 space-y-8">
        {/* Appliance Services */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Appliance Services</h2>
          <p className="text-gray-600 mb-4 text-sm">Repair, service, installation for home appliances</p>
          <CategoryGrid section="appliance" categories={applianceCategories} />
        </div>

        {/* Home Repair Services */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Home Repair & Service</h2>
          <p className="text-gray-600 mb-4 text-sm">Interior, electrical, maintenance, and painting services</p>
          <CategoryGrid section="home" categories={homeRepairCategories} />
        </div>
      </div>

      {/* Modals */}
      <MobileModal open={showApplianceModal} onClose={() => setShowApplianceModal(false)} category={selectedCategory} />
      <MobileModal open={showHomeRepairModal} onClose={() => setShowHomeRepairModal(false)} category={selectedCategory} />
    </div>
  );
};

export default MobileServices;