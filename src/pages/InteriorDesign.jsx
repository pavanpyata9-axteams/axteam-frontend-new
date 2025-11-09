import { Link } from 'react-router-dom';

const InteriorDesign = () => {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">🏠 Interior Design</h1>
          <p className="text-xl text-gray-100">Transform your space beautifully</p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-4xl font-bold mb-6">Creative Interior Design</h2>
              <p className="text-lg text-gray-700 mb-4">Transform your living space with our expert design team.</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start"><span className="text-primary-600 text-xl mr-3">✓</span> Space Planning</li>
                <li className="flex items-start"><span className="text-primary-600 text-xl mr-3">✓</span> Color Consultation</li>
                <li className="flex items-start"><span className="text-primary-600 text-xl mr-3">✓</span> Furniture Selection</li>
              </ul>
              <Link to="/login" className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors inline-block">
                Book Now
              </Link>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg text-center relative overflow-hidden">
              <div 
                className="w-full h-64 bg-cover bg-center rounded-lg mb-6"
                style={{
                  backgroundImage: 'url("/assets/services/interior.jpg")',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              ></div>
              <h3 className="text-2xl font-bold text-center">Creative Designs</h3>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InteriorDesign;

