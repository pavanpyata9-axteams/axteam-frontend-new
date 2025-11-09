import { Link } from 'react-router-dom';

const ACRepair = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">❄️ AC Repair & Installation</h1>
          <p className="text-xl text-gray-100">Professional cooling solutions for your comfort</p>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">Expert AC Services</h2>
              <p className="text-lg text-gray-700 mb-4">
                Keep your space cool and comfortable year-round with our professional AC repair and installation services. 
                Our certified technicians provide fast, reliable solutions for all your cooling needs.
              </p>
              <ul className="space-y-3 text-gray-700 mb-8">
                <li className="flex items-start">
                  <span className="text-primary-600 text-2xl mr-3">✓</span>
                  <span>Professional AC installation for all makes and models</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 text-2xl mr-3">✓</span>
                  <span>Quick and efficient repair services</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 text-2xl mr-3">✓</span>
                  <span>Regular maintenance to keep your system running smoothly</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 text-2xl mr-3">✓</span>
                  <span>Duct cleaning and air quality services</span>
                </li>
              </ul>
              <Link
                to="/login"
                className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-primary-700 transition-colors duration-200 inline-block"
              >
                Book Now
              </Link>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg relative overflow-hidden">
              <div 
                className="w-full h-64 bg-cover bg-center rounded-lg mb-6"
                style={{
                  backgroundImage: 'url("/assets/appliance/ac.jpg")',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              ></div>
              <h3 className="text-2xl font-bold text-center mt-6">Get Started Today</h3>
              <p className="text-gray-600 text-center mt-2">Call us for a free consultation</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ACRepair;

