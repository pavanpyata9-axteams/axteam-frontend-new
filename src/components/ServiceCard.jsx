import { useNavigate } from 'react-router-dom';

const ServiceCard = ({ service }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Navigate to specific service page based on title
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
    <div className="bg-white rounded-xl shadow-md p-6 hover-lift cursor-pointer" onClick={handleClick}>
      <div className="text-5xl mb-4">{service.icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-gray-800">{service.title}</h3>
      <p className="text-gray-600 mb-4">{service.description}</p>
      <button className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200 w-full">
        Book Now
      </button>
    </div>
  );
};

export default ServiceCard;

