import React from "react";
import assets from "../assets/assets";
const Hero = () => {
  return (
    <div className="flex flex-col sm:flex-row border border-gray-400">
      {/* Hero Left Side */}
      <div className="w-full sm:w-1/2 flex flex-col justify-center p-8 sm:p-12 h-[600px]">
        <div className="text-[#414141] max-w-lg">
          <h1 className="text-4xl sm:text-5xl font-serif mb-6">
            F1 Visa Interview Questions & Answers Guide
          </h1>
          <p className="text-lg mb-8 leading-relaxed">
            All questions and answers are thoughtfully crafted in consultation with former visa officers and experienced students, ensuring you're fully prepared for your interview.
          </p>
          
          {/* Advisory Section */}
          <div className="mb-8">
            <h3 className="text-xl font-medium mb-4">
              Our free advising helps you step by step - from application to graduation!
            </h3>
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Advice & research</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Application & visa help</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Pre-arrival info</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>No application fee</span>
              </div>
            </div>
            <button 
              className="bg-[#F37021] hover:bg-[#e26417] text-white px-6 py-3 rounded-lg text-lg transition-colors duration-300 font-medium flex items-center gap-2"
            >
              Ask an Advisor
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Right Side */}
      <div className="w-full sm:w-1/2 h-[600px]">
        <img 
          className="w-full h-full object-cover"
          src={assets.hero}
          alt="Student consulting with advisor"
        />
      </div>
    </div>
  );
};

export default Hero;