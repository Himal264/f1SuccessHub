import React from "react";
import Title from "../components/Title";
import assets from "../assets/assets";
import Footer from "../components/Footer";
import FollowFoo from "../components/FollowFoo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquareFacebook,
  faInstagram,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import OurpatnerC from "../components/OurpatnerC";


const About = () => {
  return (
    <div className="bg-white">
      <div className="text-2xl text-center pt-8 border-t">
        <Title text1={"ABOUT"} text2={"US"} />
      </div>

      {/* Main content section */}
      <div className="my-10 flex flex-col gap-8">
        {/* Text paragraphs */}
        <div className="text-black space-y-6">
          <p className="text-center text-xl">
            Welcome to F1SuccessHub.com, your trusted partner in achieving your
            dream of studying in the United States! We are a dedicated platform
            designed to help aspiring students prepare for their F1 visa
            interviews with confidence. Whether you’re navigating the
            application process, understanding visa requirements, or crafting
            compelling responses, we provide comprehensive resources and expert
            guidance to ensure your success.
          </p>
          <p className="text-center text-xl">
            Our team consists of experienced professionals and former F1 visa
            applicants who understand the challenges and complexities of the
            process. We believe that every student deserves the opportunity to
            pursue their education abroad, and we are committed to equipping you
            with the tools and knowledge needed to overcome obstacles and
            achieve your goals.
          </p>
          <p className="text-center text-xl text-black">
            At F1SuccessHub.com, we’re not just a website—we’re a community of
            dreamers, achievers, and future leaders.
          </p>
        </div>

        {/* Image section */}
        <div className="w-full flex justify-center">
          <img className=" w-full" src={assets.about} alt="About Us" />
        </div>

        {/* Mission section */}
        <div className="text-gray-600 space-y-4">
          <b className="text-gray-800 text-2xl text-center block">
            Our Mission
          </b>
          <p className="text-xl text-center text-black">
            At F1SuccessHub.com, our mission is to empower international
            students to achieve their dreams of studying in the United States by
            providing them with the knowledge, resources, and confidence needed
            for a successful F1 visa journey. We are dedicated to simplifying
            the complexities of the visa process and equipping students with
            practical strategies to excel in their interviews. By fostering a
            supportive and informed community, we aim to inspire students to
            overcome challenges, unlock opportunities, and take the next step
            toward a brighter academic and professional future.
          </p>
        </div>

        {/* Why Choose Us section */}
        <div className="text-xl text-center py-4">
          <Title text1={"WHY"} text2={"CHOOSE US"} />
        </div>
        <div className="flex flex-col md:flex-row text-sm mb-20">
          <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
            <b className="text-center">Expertly Curated Guidance</b>
            <p className="text-gray-600 text-center">
              At F1SuccessHub.com, we provide meticulously researched and
              reliable resources tailored to help you excel in your F1 visa
              journey. Our expert-curated content ensures you have access to the
              most accurate and practical advice to boost your confidence and
              chances of success.
            </p>
          </div>
          <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
            <b className="text-center ">Streamlined Learning Experience</b>
            <p className="text-gray-600 text-center">
              Our platform is designed for your convenience, with an intuitive
              layout that makes it easy to find the guidance you need. Whether
              it’s detailed visa interview preparation or comprehensive
              documentation tips, we ensure a smooth and stress-free experience
              for every user.
            </p>
          </div>
          <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
            <b className="text-center ">Dedicated Support for Success</b>
            <p className="text-gray-600 text-center">
              We are more than just a website; we’re your partner in success.
              Our team is committed to providing personalized support,
              addressing your concerns, and guiding you every step of the way.
              Your dreams are our mission, and we are here to help you achieve
              them.
            </p>
          </div>
        </div>

        {/* Founder Section */}
        <div className="text-2xl text-center py-4">
          <Title text1={"OUR"} text2={"MAKERS"} />
        </div>
        
        <div className="w-full max-w-[400px] mx-auto mt-8 mb-9">
          <div className="relative group">
            <img
              src={assets.founder}
              alt="Founder"
              className="w-full h-[400px] object-cover"
            />
            
            <div className="absolute top-4 right-4 flex gap-2">
              <a href="#" className=" p-2 rounded-full">
                <FontAwesomeIcon icon={faSquareFacebook} className="w-4 h-4" />
              </a>
              <a href="#" className=" p-2 rounded-full">
                <FontAwesomeIcon icon={faInstagram} className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-full">
                <FontAwesomeIcon icon={faLinkedin} className="w-4 h-4" />
              </a>
            </div>
          </div>
          <div className="bg-red-600 p-4 text-white">
            <h3 className="text-xl text-center font-semibold">
              Himal Pache Magar
            </h3>
            <p className="text-sm text-center">
              Founder, Manager & Platform Developer
            </p>
          </div>
        </div>
        <p className="text-center text-xl">This platform is created and maintained by Himal Pache Magar, with all rights reserved exclusively to him. Any unauthorized use, reproduction, or distribution of its content or design is prohibited. For inquiries or bussiness collaborations, visit himalpachemagar.com or email pachemagarhimal@gmail.com.






</p>
      </div>
      <div className="mb-10">
      <div className="text-2xl text-center py-4">
          <Title text1={"OUR"} text2={"PARTNERS"} />
        </div>
        {/* <OurpatnerC /> */}
        <p className="text-center text-xl mt-7 mb-10">
  Our trusted partners—Global Edu Consult, LoanEase Financials, and VisaPrep Experts—are dedicated to helping you achieve your dreams. From expert educational guidance to affordable financial solutions and comprehensive F1 visa preparation, we ensure a seamless journey toward your goals. Together, we make success accessible, affordable, and stress-free.
</p>
      </div>

      <FollowFoo />
      <div className="mt-12 p-6">
      <Footer />
      </div>
    </div>
  );
};

export default About;
