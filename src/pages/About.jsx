import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">About AX Team</h1>
          <p className="text-xl text-gray-100 max-w-3xl mx-auto">
            Your trusted partner for professional home and business services in Hyderabad
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6" style={{ color: '#dc2626' }}>
                Our Mission
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Established in 2023, AX Services has rapidly become a premier provider of essential home solutions
                across Hyderabad. We specialize in comprehensive AC repair, installation, meticulous wall painting,
                interior, and expert electrical wiring services for both residential and commercial. We are expertise
                in home maintenance services and appliances repair for residential homes. Our unwavering
                commitment to safety, efficiency, and unparalleled craftsmanship has enabled us to achieve a remarkable
                98% customer satisfaction rate across more than 200 completed projects.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                We combine years of experience with modern techniques to ensure every project 
                is completed to the highest standards of quality and craftsmanship.
              </p>
            </div>
            <div className="bg-primary-50 rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-4" style={{ color: '#dc2626' }}>
                Why Choose Us?
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-2xl mr-3">✓</span>
                  <p className="text-gray-700">Licensed and insured professionals</p>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">✓</span>
                  <p className="text-gray-700">Competitive pricing with no hidden fees</p>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">✓</span>
                  <p className="text-gray-700">100% customer satisfaction guarantee</p>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">✓</span>
                  <p className="text-gray-700">24/7 customer support</p>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">✓</span>
                  <p className="text-gray-700">Emergency service available</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12" style={{ color: '#dc2626' }}>
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md text-center">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Excellence</h3>
              <p className="text-gray-600">
                We strive for perfection in every project we undertake, 
                ensuring the highest quality of workmanship in all our services.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md text-center">
              <div className="text-6xl mb-4">🤝</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Integrity</h3>
              <p className="text-gray-600">
                Honest communication, transparent pricing, and ethical business 
                practices form the foundation of our relationships.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md text-center">
              <div className="text-6xl mb-4">⚡</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Reliability</h3>
              <p className="text-gray-600">
                You can count on us to be there when you need us, 
                delivering consistent and dependable service every time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6" style={{ color: '#dc2626' }}>
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Contact us today to learn more about our services and get a free quote
          </p>
          <Link
            to="/login"
            className="inline-block bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-700 transition-colors duration-200 shadow-md"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;



