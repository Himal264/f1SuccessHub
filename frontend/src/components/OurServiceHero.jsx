import React from "react";
import assets from "../assets/assets";

const OurServiceHero = () => {
  return (
    <div className="flex flex-col sm:flex-row border mb-12">
  {/* Hero Left Side */}
  <div className="w-full sm:w-1/2 flex flex-col justify-center p-6">
    <div className="text-[#414141] max-w-lg mx-auto sm:mx-0 sm:max-w-none lg:max-w-lg">
      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif mb-2 sm:mb-4">
        Explore Our Comprehensive Services
      </h1>
      <p className="text-sm sm:text-lg md:text-xl mb-6 sm:mb-8 leading-relaxed">
        We provide a full range of services to support students pursuing higher education in the U.S., from the initial application process to graduation and beyond. Our services also extend to career guidance, ensuring a smooth transition from academics to your professional journey.
      </p>

      {/* Service Button */}
      <button
        className="w-full sm:w-auto bg-[#F37021] hover:bg-[#e26417] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base md:text-lg transition-colors duration-300 font-medium flex items-center justify-center sm:justify-start gap-2"
      >
        Explore Our Services
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

  {/* Hero Right Side */}
  <div className="w-full sm:w-1/2 flex items-center justify-center">
    <img
      className="w-full h-full  object-cover "
      src={assets.OurServiceHero} // Update with the correct image path for your service
      alt="Our services"
    />
  </div>
</div>

  );
};

export default OurServiceHero;
