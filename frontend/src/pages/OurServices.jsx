import React from 'react';
import OurServiceHero from '../components/OurServiceHero';
import { FaUniversity, FaPassport, FaHandshake, FaDollarSign, FaGraduationCap, FaPlane } from 'react-icons/fa';
import { BsFillChatDotsFill } from 'react-icons/bs';
import StickyAdvisorNote from '../components/StickyAdvisorNote';
import SuccessMatters from '../components/SuccessMatters';
import Footer from '../components/Footer';

const OurServices = () => {
  const services = [
    {
      icon: <FaUniversity className="text-4xl text-[#F37021]" />,
      title: "University Selection & Application",
      description: "Expert guidance in selecting the right universities based on your academic profile, career goals, and preferences. We assist with the entire application process, from drafting compelling essays to submitting applications.",
      features: [
        "Personalized university shortlisting",
        "Application strategy planning",
        "Essay review and guidance",
        "Document preparation assistance",
        "Application tracking and follow-up"
      ]
    },
    {
      icon: <FaPassport className="text-4xl text-[#F37021]" />,
      title: "F1 Visa Interview Preparation",
      description: "Comprehensive preparation for your F1 visa interview with mock interviews, document review, and latest updates on visa policies.",
      features: [
        "One-on-one mock interviews",
        "Document checklist review",
        "Latest visa policy updates",
        "Common questions preparation",
        "Interview strategy coaching"
      ]
    },
    {
      icon: <FaDollarSign className="text-4xl text-[#F37021]" />,
      title: "Education Loan Assistance",
      description: "Navigate the financial aspects of your education with our comprehensive loan assistance service.",
      features: [
        "Loan option comparison",
        "Documentation support",
        "Bank liaison assistance",
        "Financial planning guidance",
        "Scholarship application help"
      ]
    },
    {
      icon: <BsFillChatDotsFill className="text-4xl text-[#F37021]" />,
      title: "Pre-Departure Orientation",
      description: "Get well-prepared for your journey with our comprehensive pre-departure guidance.",
      features: [
        "Cultural adaptation tips",
        "Housing assistance",
        "Travel arrangements",
        "Insurance guidance",
        "Emergency contact setup"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <OurServiceHero />
      
      <div className="relative flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto px-4 pb-20">
        {/* Main Content */}
        <div className="flex-1">
          {/* Services Grid */}
          <div className="grid grid-cols-1 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-orange-50 rounded-lg">
                    {service.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {service.description}
                    </p>
                    
                    {/* Features List */}
                    <div className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-[#F37021] rounded-full"></div>
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    {/* Action Button */}
                    <button className="mt-6 px-4 py-2 bg-[#F37021] hover:bg-[#e26417] text-white rounded-lg transition-colors text-sm">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Information Section */}
          <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Why Choose Our Services?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FaHandshake className="text-2xl text-[#F37021]" />
                  <span className="text-gray-700">Personalized Guidance</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaGraduationCap className="text-2xl text-[#F37021]" />
                  <span className="text-gray-700">Expert Counselors</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FaPlane className="text-2xl text-[#F37021]" />
                  <span className="text-gray-700">End-to-End Support</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaUniversity className="text-2xl text-[#F37021]" />
                  <span className="text-gray-700">University Partnerships</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Advisor Note */}
        <StickyAdvisorNote />
      </div>

      {/* Success Matters and Footer */}
      <div className="mt-6">
        <SuccessMatters />
        <Footer />
      </div>
    </div>
  );
};

export default OurServices;