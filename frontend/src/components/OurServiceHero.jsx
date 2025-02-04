import React from "react";
import assets from "../assets/assets";

const OurServiceHero = () => {
  return (
    <div className="bg-[#2A374C] text-white py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center">
          {/* Hero Left Side - Made more compact */}
          <div className="w-full sm:w-1/2 flex flex-col justify-center p-6 sm:p-8">
            <div className="max-w-lg">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
                Your Journey to U.S. Education Starts Here
              </h1>
              <p className="text-gray-300 text-base mb-6">
                We provide comprehensive support services to make your dream of studying in the United States a reality. From university selection to visa preparation, we're with you every step of the way.
              </p>

              {/* CTA Buttons - Made more compact */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="bg-[#F37021] hover:bg-[#e26417] text-white px-5 py-2 rounded-lg font-medium transition-colors text-sm">
                  Get Started
                </button>
                <button className="border border-white hover:bg-white hover:text-[#2A374C] text-white px-5 py-2 rounded-lg font-medium transition-colors text-sm">
                  Learn More
                </button>
              </div>
            </div>
          </div>

          {/* Hero Right Side - Adjusted image size and stats */}
          <div className="w-full sm:w-1/2 p-6">
            <div className="relative">
              <img
                className="rounded-xl shadow-lg w-full h-[300px] object-cover"
                src={assets.OurServiceHero}
                alt="Students getting guidance"
              />
              {/* Stats Overlay - Made more compact */}
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white text-gray-800 rounded-lg shadow-lg p-3 w-11/12">
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center">
                    <div className="text-[#F37021] font-bold text-xl">500+</div>
                    <div className="text-xs">Students Placed</div>
                  </div>
                  <div className="text-center border-x border-gray-200">
                    <div className="text-[#F37021] font-bold text-xl">50+</div>
                    <div className="text-xs">Partner Universities</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[#F37021] font-bold text-xl">95%</div>
                    <div className="text-xs">Success Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurServiceHero;
