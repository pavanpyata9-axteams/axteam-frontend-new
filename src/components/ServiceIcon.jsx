import React from 'react';

const ServiceIcon = ({ type, className = "w-8 h-8" }) => {
  // Service image paths - add your actual images to public/service-images/
  const serviceImages = {
    'washing': '/service-images/washing-machine.png',
    'fridge': '/service-images/refrigerator.png',
    'geyser': '/service-images/geyser.png',
    'purifier': '/service-images/water-purifier.png',
    'microwave': '/service-images/microwave.png',
    'ac': '/service-images/air-conditioner.png',
    'interior': '/service-images/interior-design.png',
    'electrical': '/service-images/electrical.png',
    'maintenance': '/service-images/maintenance.png',
    'painting': '/service-images/painting.png',
    'security': '/service-images/cctv.png'
  };

  const imagePath = serviceImages[type] || serviceImages['maintenance'];

  return (
    <img 
      src={imagePath}
      alt={`${type} service icon`}
      className={`${className} object-contain`}
      onError={(e) => {
        // If image fails to load, hide it (shows empty circle)
        e.target.style.display = 'none';
      }}
    />
  );
};

export default ServiceIcon;