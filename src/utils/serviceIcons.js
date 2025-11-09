// Service icons mapping for different types of services
export const serviceIcons = {
  // Appliance Services Icons
  'Top Load Fully Automatic - Repair & Service': '🔧',
  'Front Load Fully Automatic - Repair & Service': '🔧',
  'Semi Automatic - Repair & Service': '🔧',
  'Washing Machine - Installation & Uninstallation': '🔌',
  'Double/Single Door - Repair & Service': '❄️',
  'Single Door - Repair & Service': '❄️',
  'Side by Side Door - Repair & Service': '❄️',
  'Geyser - Repair & Service': '🔧',
  'Geyser - Installation & Uninstallation': '🔌',
  'Water Purifier - Repair & Service': '🔧',
  'Water Purifier - Installation & Uninstallation': '🔌',
  'Microven - Repair & Service': '🔧',
  'AC - Repair & Service': '🔧',
  'AC - Gas Fill Service': '💨',
  'AC - Installation & Uninstallation': '🔌',
  'AC - Advanced piping Repair & Service': '🔧',

  // Home Repair Services Icons
  'Full Building/Flat Interior Work': '🏠',
  'Interior Repair & Service (Existing Work)': '🔨',
  'Complete Wiring - New/Old Buildings & Flats': '⚡',
  'Commercial Electrical Works': '⚡',
  'Cleaning - Entire Building or Flat': '🧹',
  'Interior Work Adjustments/Changes': '🎨',
  'Wall Paneling - Flats & Buildings': '🎨',
  'Piping for New Buildings/Flats (Complete Work)': '🔧',
  'CCTV - Installation & Uninstallation': '📹',
};


// Get service icon for a service item
export const getServiceIcon = (serviceName) => {
  return serviceIcons[serviceName] || '🔧'; // Default wrench icon
};

