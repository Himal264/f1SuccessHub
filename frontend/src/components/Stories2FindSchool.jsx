import React from 'react';
import { Link } from 'react-router-dom';
import assets from '../assets/assets';

const Stories2FindSchool = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden my-6 p-6">
      <div className="relative">
        {/* Advisor Images */}
        <div className="flex justify-center -space-x-4 mb-4">
          <img 
            src={assets.advisor1}
            alt="Advisor"
            className="w-16 h-16 rounded-full border-2 border-white"
          />
          <img 
            src={assets.advisor2}
            alt="Advisor"
            className="w-16 h-16 rounded-full border-2 border-white"
          />
          <img 
            src={assets.advisor3}
            alt="Advisor"
            className="w-16 h-16 rounded-full border-2 border-white"
          />
        </div>
        
        {/* Content */}
        <div className="text-center">
          <h2 className="text-xl font-medium text-gray-900 mb-4">
            Our free advising helps you<br />
            step by step - from<br />
            application to graduation!
          </h2>
          
          {/* Checklist */}
          <ul className="space-y-2 mb-6">
            <li className="flex items-center justify-center gap-2">
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
              <span className="text-gray-700">Advice & research</span>
            </li>
            <li className="flex items-center justify-center gap-2">
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
              <span className="text-gray-700">Application & visa help</span>
            </li>
            <li className="flex items-center justify-center gap-2">
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
              <span className="text-gray-700">Pre-arrival info</span>
            </li>
            <li className="flex items-center justify-center gap-2">
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
              <span className="text-gray-700">No application fee</span>
            </li>
          </ul>

          {/* CTA Button */}
          <Link
            to="/universityform"
            className="inline-block w-full text-center bg-[#F37021] text-white px-6 py-3 rounded-full hover:bg-[#e85d0a] transition-colors duration-300"
          >
            Ask an Advisor →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Stories2FindSchool;