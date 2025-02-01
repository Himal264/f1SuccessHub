import React from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";

const StickyAdvisorNote = () => {
  const navigate = useNavigate();
  return (
    <>
      {/* Advisor Section - Desktop */}
      <div className="hidden lg:block lg:w-72">
        <div className="sticky top-4 bg-white rounded-lg shadow-lg p-4">
          <div className="flex justify-center mb-4">
            <div className="flex -space-x-3">
              <img
                src={assets.advisor1}
                alt="Advisor 1"
                className="w-12 h-12 rounded-full border-2 border-white"
              />
              <img
                src={assets.advisor2}
                alt="Advisor 2"
                className="w-12 h-12 rounded-full border-2 border-white"
              />
              <img
                src={assets.advisor3}
                alt="Advisor 3"
                className="w-12 h-12 rounded-full border-2 border-white"
              />
            </div>
          </div>

          <h3 className="text-base font-medium text-center mb-3">
            Our free advising helps you step by step - from application to graduation!
          </h3>

          <div className="space-y-2 mb-4">
            {[
              "Advice & research",
              "Application & visa help",
              "Pre-arrival info",
              "No application fee",
            ].map((text, index) => (
              <div key={index} className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-green-600 flex-shrink-0"
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
                <span className="text-xs">{text}</span>
              </div>
            ))}
          </div>

          <button className="w-full bg-[#F37021] hover:bg-[#e26417] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors duration-300">
            Ask an Advisor
            <svg
              className="w-4 h-4"
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

      {/* Mobile Advisor Section - Fixed at Bottom */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t p-3 z-50">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              <img
                src={assets.advisor1}
                alt="Advisor 1"
                className="w-8 h-8 rounded-full border-2 border-white"
              />
              <img
                src={assets.advisor2}
                alt="Advisor 2"
                className="w-8 h-8 rounded-full border-2 border-white"
              />
              <img
                src={assets.advisor3}
                alt="Advisor 3"
                className="w-8 h-8 rounded-full border-2 border-white"
              />
            </div>
            <p className="text-xs max-w-[150px]">
              Our free advising helps you step by step
            </p>
          </div>
          <button
      className="bg-[#F37021] hover:bg-[#e26417] text-white px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap"
      onClick={() => navigate("/advisor-inquiriesform")}
    >
      Ask an Advisor
    </button>
        </div>
      </div>
    </>
  );
};

export default StickyAdvisorNote;
