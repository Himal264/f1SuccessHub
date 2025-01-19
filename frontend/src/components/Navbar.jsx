import React, { useState } from "react";
import assets from "../assets/assets";
import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
  const [visible, setVisible] = useState(false); // Track visibility of the sidebar

  return (
    <div className="flex items-center justify-between font-medium py-5 w-full">
      {/* Logo */}
      <Link to="/">
        <img className="w-36" src={assets.f1successhubLogo} alt="Logo" />
      </Link>

      {/* Desktop Navigation */}
      <ul className="hidden sm:flex items-center justify-end gap-5 text-sm text-gray-700 ml-auto">
        <NavLink to="/" className="flex flex-col items-center gap-1 mr-4">
          <p className="text-sm">Home</p>
          <hr className="w-2/4 border-none hidden h-[1.5px] bg-gray-700" />
        </NavLink>
        <NavLink
          to="/f1questionsandanswers/:f1questionsandanswersId"
          className="flex flex-col items-center gap-1 mr-4"
        >
          <p className="text-sm">F1 Questions</p>
          <hr className="w-2/4 border-none hidden h-[1.5px] bg-gray-700" />
        </NavLink>
        <NavLink
          to="/f1successhub-ourservices"
          className="flex flex-col items-center gap-1 mr-4"
        >
          <p className="text-sm">Our Services</p>
          <hr className="w-2/4 border-none hidden h-[1.5px] bg-gray-700" />
        </NavLink>

        <NavLink
          to="/aboutus"
          className="flex flex-col items-center gap-1 mr-4"
        >
          <p className="text-sm">About Us</p>
          <hr className="w-2/4 border-none hidden h-[1.5px] bg-gray-700" />
        </NavLink>

        <NavLink to="/login" className="flex flex-col items-center gap-1">
          <p className="text-sm border border-black px-2 rounded-l-full rounded-r-full">
            Login
          </p>
        </NavLink>

        <NavLink to="/" className="flex flex-col items-center gap-1">
          <img src={assets.search_icon} className="w-5 cursor-pointer" alt="" />
        </NavLink>

        <NavLink
          to="/universitysearchform"
          className="flex flex-col items-center gap-1 mr-4"
        >
          <p className="text-sm text-white border bg-[#F37021]  border-[#F37021] px-2 rounded-l-full rounded-r-full">
            Find University
          </p>
        </NavLink>
      </ul>

      {/* Search Icon & Mobile Menu */}
      <div className="flex items-center gap-6">
        <img
          onClick={() => setVisible(!visible)} // Toggle sidebar visibility
          src={assets.menu_icon}
          className="w-5 cursor-pointer sm:hidden"
          alt=""
        />
      </div>

      {/* Sidebar Menu for Small Screens */}
      <div
        className={`absolute top-0 left-0 bottom-0 z-50 bg-white transition-all duration-300 ease-in-out ${
          visible ? "w-full opacity-100" : "w-0 opacity-0"
        } sm:hidden`}
      >
        {/* Sidebar Content */}
        <div
          className={`flex flex-col text-gray-600 h-full transition-all duration-300 ease-in-out ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            onClick={() => setVisible(false)} // Close the sidebar
            className="flex items-center gap-4 p-3 cursor-pointer"
          >
            <img className="h-4 rotate-180" src={assets.dropdown_icon} alt="" />
            <p>Back</p>
          </div>
          <NavLink
            onClick={() => setVisible(false)} // Close the sidebar when a link is clicked
            className="py-2 pl-6 border-b"
            to="/"
          >
            Home
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)} // Close the sidebar when a link is clicked
            className="py-2 pl-6 border-b"
            to="/findbestuniversity-for-you"
          >
            Find University
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)} // Close the sidebar when a link is clicked
            className="py-2 pl-6 border-b"
            to="/f1questionsandanswers/:f1questionsandanswersId"
          >
            F1 Questions
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)} // Close the sidebar when a link is clicked
            className="py-2 pl-6 border-b"
            to="/f1successhub-ourservices"
          >
            The Services We Provide ?
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)} // Close the sidebar when a link is clicked
            className="py-2 pl-6 border-b"
            to="/f1successhub-ourpatners"
          >
            Our Patners ?
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)} // Close the sidebar when a link is clicked
            className="py-2 pl-6 border-b"
            to="/forf1success"
          >
            What F1 Visa Success Matters?
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)} // Close the sidebar when a link is clicked
            className="py-2 pl-6 border-b"
            to="/f1successhubfaqs?"
          >
            F1SuccessHub FAQs?
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)} // Close the sidebar when a link is clicked
            className="py-2 pl-6 border-b"
            to="/aboutus"
          >
            About Us
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)} // Close the sidebar when a link is clicked
            className="py-2 pl-6 border-b"
            to="/login"
          >
            Login
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;