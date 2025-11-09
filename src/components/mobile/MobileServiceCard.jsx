import { useNavigate } from 'react-router-dom';

const MobileServiceCard = ({ service }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    const routeMap = {
      'AC Repair & Installation': '/ac-repair',
      'Wall Painting': '/wall-painting',
      'Electrical Work': '/electrical-work',
      'Interior Design': '/interior-design',
      'Home Maintenance': '/home-maintenance'
    };
    const route = routeMap[service.title] || '/services';
    navigate(route);
  };

  return (
    <div 
      className="bg-white rounded-2xl shadow-md p-4 active:shadow-lg active:scale-95 transition-all duration-200 cursor-pointer border border-gray-100" 
      onClick={handleClick}
    >
      {/* Icon - Larger for touch */}
      <div className="text-4xl mb-3 text-center">{service.icon}</div>
      
      {/* Title - Optimized for mobile reading */}
      <h3 className="text-lg font-semibold mb-2 text-gray-800 text-center leading-tight">
        {service.title}
      </h3>
      
      {/* Description - Shorter for mobile */}
      <p className="text-gray-600 mb-4 text-sm text-center leading-relaxed">
        {service.description.length > 80 
          ? service.description.substring(0, 80) + '...' 
          : service.description
        }
      </p>
      
      {/* Button - Touch-optimized */}
      <button className="bg-primary-600 text-white px-4 py-3 rounded-xl font-medium hover:bg-primary-700 active:bg-primary-800 transition-colors duration-200 w-full text-sm">
        Book Now
      </button>
    </div>
  );
};

export default MobileServiceCard;