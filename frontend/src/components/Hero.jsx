import React from "react";
import assets from "../assets/assets";
import { backendUrl } from "../App";

const Hero = () => {
  return (
    <div className="flex flex-col sm:flex-row border border-gray-400 mb-12">
      {/* Hero Left Side */}
      <div className="w-full sm:w-1/2 flex flex-col justify-center p-4">
        <div className="text-[#414141] max-w-lg mx-auto sm:mx-0 sm:max-w-none lg:max-w-lg">
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-serif mb-2 sm:mb-4">
            F1 Visa Interview Questions & Answers Guide
          </h1>
          <p className="text-base sm:text-sm md:text-lg mb-6 sm:mb-8 leading-relaxed">
            All questions and answers are thoughtfully crafted in consultation with former visa officers and experienced students, ensuring you're fully prepared for your interview.
          </p>
          
          {/* Advisory Section */}
          <div className="mb-6 sm:mb-5">
            <h3 className="text-sm sm:text-lg font-medium text-black mb-3 sm:mb-4">
              Our free advising helps you step by step - from application to graduation!
            </h3>
            <div className="space-y-2 mb-2 sm:mb-4">
              {[
                "Advice & research",
                "Application & visa help",
                "Pre-arrival info",
                "No application fee",
              ].map((text, index) => (
                <div key={index} className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-green-600"
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
                  <span className="text-sm sm:text-base">{text}</span>
                </div>
              ))}
            </div>
            <button
              className="w-full sm:w-auto bg-[#F37021] hover:bg-[#e26417] text-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg text-sm sm:text-base md:text-lg transition-colors duration-300 font-medium flex items-center justify-center sm:justify-start gap-2"
            >
              Ask an Advisor
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Right Side */}
      <div className="w-full sm:w-1/2 h-[300px] sm:h-auto">
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