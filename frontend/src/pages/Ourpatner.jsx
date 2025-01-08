import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquareFacebook,
  faInstagram,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import Title from '../components/Title';
import Footer from '../components/Footer';

const Ourpatner = () => {




  const partners = [
    
    {
      id: 1,
      name: "Education Loan Partners",
      description: "Loan Partner is dedicated to help to students who are trying international studying. From education loan to till your education finished  we serve.",
      image: "/api/placeholder/600/400",
      type: "Loan Partner"
    },
    {
      id: 2,
      name: "Visa Prepration Partners",
      description: "We have a team of experienced educational advisors who specialize in helping students make informed decisions about their academic future.",
      image: "/api/placeholder/600/400",
      type: "Support Network"
    },
    {
      id: 3,
      name: "Global Edu Consult",
      description: "With a team of experienced educational advisors, we specialize in helping students make informed decisions about their academic future.",
      image: "/api/placeholder/600/400",
      type: "Education Partner"
    }
  ];

  return (
    <div className="min-h-screen bg-white">

      <div className='text-center'>
        <Title className="text-center text-2xl" text1={"OUR"} text2={"PARTNER"} />
      </div>


      {/* Hero Section */}
      <div className="bg-orange-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="w-full lg:w-1/2">
              <img
                src="/api/placeholder/600/400"
                alt="Hero"
                className="rounded-lg shadow-xl w-full h-[300px] sm:h-[400px] object-cover"
              />
            </div>
            <div className="w-full lg:w-1/2 space-y-4 text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl font-bold">We here with several international orgnaztion to make you international studies successful</h1>
              <p className="text-base sm:text-lg">
              Our partner Help Your from intial application to end of your educational from your country to USA
              </p>
              <button className="bg-white text-orange-500 px-6 py-2 rounded-full font-semibold hover:bg-orange-100 transition-colors duration-300">
                LEARN MORE
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Partners Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {partners.map((partner) => (
            <div key={partner.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative group">
                <img
                  src={partner.image}
                  alt={partner.name}
                  className="w-full h-64 object-cover"
                />
                {/* Social Icons */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <a href="#" className="bg-white/80 p-2 rounded-full hover:bg-white transition-colors duration-300">
                    <FontAwesomeIcon icon={faSquareFacebook} className="w-4 h-4 text-orange-500" />
                  </a>
                  <a href="#" className="bg-white/80 p-2 rounded-full hover:bg-white transition-colors duration-300">
                    <FontAwesomeIcon icon={faInstagram} className="w-4 h-4 text-orange-500" />
                  </a>
                  <a href="#" className="bg-white/80 p-2 rounded-full hover:bg-white transition-colors duration-300">
                    <FontAwesomeIcon icon={faLinkedin} className="w-4 h-4 text-orange-500" />
                  </a>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{partner.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{partner.description}</p>
                <button className="w-full bg-orange-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-orange-600 transition-colors duration-300">
                  LEARN MORE
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA Section */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Become a Partner</h2>
          <p className="text-gray-600 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
            Join us in making a difference in communities across the nation. Together, we can create lasting impact.
          </p>
          <button className="bg-orange-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-orange-600 transition-colors duration-300">
            GET INVOLVED
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Ourpatner;