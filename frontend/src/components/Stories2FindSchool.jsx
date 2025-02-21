import React from 'react';
import { Link } from 'react-router-dom';

const Stories2FindSchool = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden my-6">
      <div className="relative">
        {/* Hero Image */}
        <img 
          src="/path/to/classroom-image.jpg" // Replace with your actual image path
          alt="Students in classroom"
          className="w-full h-48 object-cover"
        />
        
        {/* Content */}
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Our school match questionnaire - and free advisor services - can help you find your ideal US university.
          </h2>
          
          {/* Checklist */}
          <ul className="space-y-2 mb-6">
            <li className="flex items-center gap-2">
              <svg 
                className="w-5 h-5 text-[#F37021]" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-gray-700">Compare your matches</span>
            </li>
            <li className="flex items-center gap-2">
              <svg 
                className="w-5 h-5 text-[#F37021]" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-gray-700">Apply with ease</span>
            </li>
            <li className="flex items-center gap-2">
              <svg 
                className="w-5 h-5 text-[#F37021]" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-gray-700">Speak with experts</span>
            </li>
          </ul>

          {/* CTA Button */}
          <Link
            to="/find-school" // Replace with your actual route
            className="inline-block w-full text-center bg-[#F37021] text-white px-6 py-3 rounded-full hover:bg-[#e85d0a] transition-colors duration-300"
          >
            Find your school →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Stories2FindSchool;