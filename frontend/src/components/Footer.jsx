import React from "react";
import assets from "../assets/assets";
import { Link } from "react-router-dom";

const Footer = () => {
  const contactInfo = [
    {
      icon: assets.phoneIcon,
      text: "+977-9764558713",
      href: "tel:+9779706750713",
    },
    {
      icon: assets.emailIcon,
      text: "f1successhub@gmail.com",
      href: "mailto:f1successhub@gmail.com",
    },
    {
      icon: assets.locationIcon,
      text: "Kathmandu, Nepal.",
      href: "#",
    },
    {
      icon: assets.websiteIcon,
      text: "www.f1successhub.com",
      href: "#",
    },
  ];

  return (
    <div className="">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10">
        <div>
          <img src={assets.f1successhubLogo} className="mb-5 w-32" alt="" />
          <p className="w-full md:w-2/3 text-gray-600">
            "F1 SuccessHub is your ultimate guide for F1 visa preparation. We
            provide comprehensive questions and answers, along with free
            downloadable PDFs, to help you confidently navigate your F1 visa
            journey. Empowering students with reliable resources to achieve
            their dreams."
          </p>
        </div>
        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/f1successhub-ourservices">Our Services</Link></li>
            <li><Link to="/f1successhub-ourpatners">Our Patners</Link></li>
            <li><Link to="/aboutus">About Us</Link></li>
            <li><Link to="/termsandconditions">Terms & Conditions</Link></li>
            <li><Link to="/policy">Privacy Policy</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            {contactInfo.map((item, index) => (
              <li key={index}>
                <a href={item.href} className="text-blue-600 flex items-center gap-2">
                  <img src={item.icon} alt="" className="w-4 h-4" />
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="">
        <hr />
        <p className="py-5 text-sm text-center">
          Copyright 2024@ f1successhub.com - All Right
        </p>
      </div>
    </div>
  );
};

export default Footer;