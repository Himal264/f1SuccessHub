import React, { useState, useEffect } from "react";
import assets from "../assets/assets";
import { Link } from "react-router-dom";

const UniversityHero = () => {
  const [titleVisible, setTitleVisible] = useState(false);
  const [paragraphVisible, setParagraphVisible] = useState(false);
  const [imageVisible, setImageVisible] = useState(false);
  
  useEffect(() => {
    // Staggered animation timing
    const titleTimer = setTimeout(() => {
      setTitleVisible(true);
    }, 100);
    
    const paragraphTimer = setTimeout(() => {
      setParagraphVisible(true);
    }, 600); // Delay paragraph animation to start after title begins
    
    const imageTimer = setTimeout(() => {
      setImageVisible(true);
    }, 1000); // Delay image animation to start after paragraph begins
    
    return () => {
      clearTimeout(titleTimer);
      clearTimeout(paragraphTimer);
      clearTimeout(imageTimer);
    };
  }, []);

  return (
    <div className="flex flex-col sm:flex-row mb-12">
      {/* Hero Left Side */}
      <div className="w-full sm:w-1/2 flex flex-col justify-center p-6">
        <div className="text-[#414141] max-w-lg mx-auto sm:mx-0 sm:max-w-none lg:max-w-lg">
          {/* Title with animation */}
          <div className="overflow-hidden">
            <h1 
              className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif mb-4 sm:mb-6 transition-all duration-800 ease-out ${
                titleVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
              }`}
            >
              Find Best University
            </h1>
          </div>
          
          {/* Paragraph with animation */}
          <div className="overflow-hidden">
            <p 
              className={`text-base sm:text-sm md:text-xl mb-6 sm:mb-8 leading-relaxed transition-all duration-800 ease-out ${
                paragraphVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
              }`}
            >
              Find the University connects students with over 1,200 universities
              across the USA, offering a comprehensive and up-to-date database of
              institutions. Our mission is to simplify the search for higher
              education opportunities by providing personalized guidance and
              accurate information to help students make informed decisions about
              their academic future.
            </p>
          </div>

          {/* Find University Button - No animation */}
          <Link to="/universityform">
            <button className="w-full sm:w-auto bg-[#002349] hover:bg-[#002349] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base md:text-lg transition-colors duration-300 font-medium flex items-center justify-center sm:justify-start gap-2">
              Find University
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
          </Link>
        </div>
      </div>

      {/* Hero Right Side with Image Animation */}
      <div className="w-full sm:w-1/2 h-[300px] sm:h-auto overflow-hidden">
        <img
          className={`w-full h-full object-cover transition-all duration-1200 ease-in-out ${
            imageVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
          }`}
          src={assets.university_hero}
          alt="University search"
        />
      </div>
    </div>
  );
};

export default UniversityHero;
