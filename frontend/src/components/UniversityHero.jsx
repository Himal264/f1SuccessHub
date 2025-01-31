import React from "react";
import assets from "../assets/assets";
import { Link } from "react-router-dom";

const UniversityHero = () => {
  return (
    <div className="flex flex-col sm:flex-row mb-12">
      {/* Hero Left Side */}
      <div className="w-full sm:w-1/2 flex flex-col justify-center p-6">
        <div className="text-[#414141] max-w-lg mx-auto sm:mx-0 sm:max-w-none lg:max-w-lg">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif mb-4 sm:mb-6">
            Find Best University
          </h1>
          <p className="text-base sm:text-sm md:text-xl mb-6 sm:mb-8 leading-relaxed">
            Find the University connects students with over 1,200 universities
            across the USA, offering a comprehensive and up-to-date database of
            institutions. Our mission is to simplify the search for higher
            education opportunities by providing personalized guidance and
            accurate information to help students make informed decisions about
            their academic future.
          </p>

          {/* Find University Button */}
          <Link to="/universityform">
            <button className="w-full sm:w-auto bg-[#F37021] hover:bg-[#e26417] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base md:text-lg transition-colors duration-300 font-medium flex items-center justify-center sm:justify-start gap-2">
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

      {/* Hero Right Side */}
      <div className="w-full sm:w-1/2 h-[300px] sm:h-auto">
        <img
          className="w-full h-full object-cover"
          src={assets.university_hero} // Make sure to update with the correct image path
          alt="University search"
        />
      </div>
    </div>
  );
};

export default UniversityHero;
