import React from "react";
import Title from "../components/Title";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquareFacebook,
  faInstagram,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import assets from "../assets/assets";

const OurpatnerC = () => {
  return (
    <div className="bg-white">
 
      <div className="flex flex-wrap justify-center gap-8 px-4 lg:flex-nowrap">
        
        {/* Education Consultancy Partner */}
        <div className="w-full max-w-[400px] mx-auto">
          <div className="relative group">
            <img
              src={assets.education_patner}
              alt="Education Consultancy Partner"
              className="w-full h-[400px] object-cover rounded-lg shadow-md"
            />
            <div className="absolute top-4 right-4 flex gap-2">
              <a href="#" className="p-2 rounded-full">
                <FontAwesomeIcon icon={faSquareFacebook} className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-full">
                <FontAwesomeIcon icon={faInstagram} className="w-4 h-4" />
              </a>
              <a href="#" className="p-2  rounded-full ">
                <FontAwesomeIcon icon={faLinkedin} className="w-4 h-4" />
              </a>
            </div>
          </div>
          <div className="bg-red-600 p-4 text-white shadow-md">
          <h3 className="text-xl text-center font-semibold">
  Global Edu Consult
</h3>
<p className="text-sm text-center">
  Providing expert guidance for international education.
</p>

          </div>
        </div>

        {/* Student Loan Partner */}
        <div className="w-full max-w-[400px] mx-auto">
          <div className="relative group">
            <img
              src={assets.loan_patner}
              alt="Student Loan Partner"
              className="w-full h-[400px] object-cover rounded-lg shadow-md"
            />
            <div className="absolute top-4 right-4 flex gap-2">
              <a href="#" className="p-2  rounded-full">
                <FontAwesomeIcon icon={faSquareFacebook} className="w-4 h-4" />
              </a>
              <a href="#" className="p-2  rounded-full ">
                <FontAwesomeIcon icon={faInstagram} className="w-4 h-4" />
              </a>
              <a href="#" className="p-2  rounded-full ">
                <FontAwesomeIcon icon={faLinkedin} className="w-4 h-4" />
              </a>
            </div>
          </div>
          <div className="bg-red-600 p-4 text-white  shadow-md">
          <h3 className="text-xl text-center font-semibold">
  LoanEase Financials
</h3>
<p className="text-sm text-center">
  Financial solutions to make your dreams achievable.
</p>

          </div>
        </div>

        {/* F1 Interview Visa Preparation Partner */}
        <div className="w-full max-w-[400px] mx-auto">
          <div className="relative group">
            <img
              src={assets.interview_patner}
              alt="F1 Interview Visa Preparation Partner"
              className="w-full h-[400px] object-cover rounded-lg shadow-md"
            />
            <div className="absolute top-4 right-4 flex gap-2">
              <a href="#" className="p-2  rounded-full ">
                <FontAwesomeIcon icon={faSquareFacebook} className="w-4 h-4" />
              </a>
              <a href="#" className="p-2  rounded-full ">
                <FontAwesomeIcon icon={faInstagram} className="w-4 h-4" />
              </a>
              <a href="#" className="p-2  rounded-full ">
                <FontAwesomeIcon icon={faLinkedin} className="w-4 h-4" />
              </a>
            </div>
          </div>
          <div className="bg-red-600 p-4 text-white  shadow-md">
          <h3 className="text-xl text-center font-semibold">
  VisaPrep Experts
</h3>
<p className="text-sm text-center">
  Helping you succeed in your F1 visa interviews.
</p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default OurpatnerC;
