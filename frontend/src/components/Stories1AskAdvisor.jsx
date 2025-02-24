import React from "react";
import { Link } from "react-router-dom";
import assets from "../assets/assets";

const Stories1AskAdvisor = () => {
  return (
    <div className="bg-[#2A3342] text-white rounded-lg p-6 my-6">
      <div className="flex items-center gap-6">
        <div className="flex-shrink-0">
          <img
            src={assets.advisor1}
            alt="Advisor 1"
            className="w-24 h-24 rounded-full object-cover"
          />
        </div>
        <div className="flex-grow">
          <h2 className="text-2xl font-semibold mb-2">Ask an Advisor</h2>
          <p className="text-gray-300 mb-4">
            Our education counselors help every step of the way, from
            application to arrival, at no additional cost to you.
          </p>
          <Link
            to="/advisor-inquiriesform"
            className="inline-block bg-[#F37021] text-white px-6 py-2 rounded-full hover:bg-[#e85d0a] transition-colors duration-300"
          >
            Ask an Advisor →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Stories1AskAdvisor;
