import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import UniPageHero from "../components/UniPageHero";
import LocationSection from "../components/LocationSection";
import FeeStructureSection from "../components/FeeStructureSection";
import AdmissionRequirementsSection from "../components/AdmissionRequirementsSection";
import ProgramsSection from "../components/ProgramsSection";
import CampusLifeSection from "../components/CampusLifeSection";
import Footer from "../components/Footer";
import AboutSection from "../components/AboutSection";
import ScholarshipSection from "../components/ScholarshipSection";
import RelatedUniversities from "../components/RelatedUniversities";
import FAQpage from "./FAQpage"

const UniversityDetail = () => {
  const { id } = useParams();
  const [universityData, setUniversityData] = useState(null);
  const [activeSection, setActiveSection] = useState("aboutuni"); // Set default section
  const [isNavOpen, setIsNavOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUniversity = async () => {
      if (!id) return;
      try {
        const response = await fetch(
          `http://localhost:9000/api/university/${id}`
        );
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setUniversityData(data);
      } catch (error) {
        console.error("Error fetching university:", error);
      }
    };
    fetchUniversity();
  }, [id]);

  const navigationItems = [
    { id: "aboutuni", label: "About" },
    { id: "admissions", label: "Admissions Requirements" },
    { id: "location", label: "Location" },
    { id: "fees", label: "Fees Structure" },
    { id: "scholarships", label: "Scholarships" },
    { id: "programs", label: "Programs" },

  ];

  const handleNavClick = (sectionId) => {
    setActiveSection(sectionId);
    setIsNavOpen(false); // Close mobile menu after selection
  };

  const handleApplyNow = () => {
    navigate(`/applynow/${id}`, {
      state: { 
        university: universityData.university,
        level: "Graduate" // You can modify this based on your needs
      }
    });
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case "aboutuni":
        return <AboutSection university={universityData?.university} />;
      case "programs":
        return <ProgramsSection university={universityData?.university} />;
      case "admissions":
        return (
          <AdmissionRequirementsSection
            university={universityData?.university}
          />
        );
      case "fees":
        return <FeeStructureSection university={universityData?.university} />;
      case "scholarships":
        return <ScholarshipSection university={universityData?.university} />;

      case "location":
        return <LocationSection university={universityData?.university} />;
      default:
        return null;
    }
  };

  return (
    <div>
      {universityData?.university ? (
        <>
          <UniPageHero university={universityData.university} />

          {/* Mobile Navigation Toggle */}
          <div className="lg:hidden border-b bg-gray-600">
            <button
              onClick={() => setIsNavOpen(!isNavOpen)}
              className="w-full p-4 flex justify-between items-center text-white"
            >
              <span>
                {
                  navigationItems.find((item) => item.id === activeSection)
                    ?.label
                }
              </span>
              <svg
                className={`w-6 h-6 transform transition-transform ${
                  isNavOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>

          {/* Navigation Bar */}
          <nav
            className={`bg-white border-b ${
              isNavOpen ? "block" : "hidden lg:block"
            }`}
          >
            <div className="max-w-7xl mx-auto px-4">
              <ul className="lg:flex lg:space-x-8 flex-col lg:flex-row">
                {navigationItems.map((item) => (
                  <li key={item.id} className="w-full lg:w-auto">
                    <button
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full lg:w-auto py-4 px-2 border-b-2 transition-colors ${
                        activeSection === item.id
                          ? "border-blue-900 text-blue-900"
                          : "border-transparent text-gray-600 hover:text-blue-900"
                      }`}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          {/* Active Section Content */}
          {renderActiveSection()}

          {universityData?.university && (
            <RelatedUniversities currentUniversity={universityData.university} />
          )}

          <button 
            onClick={handleApplyNow}
            className="bg-blue-600 text-white px-6 py-2 rounded-md"
          >
            Apply Now
          </button>

          <FAQpage/>
        </>
      ) : (
        <p className="p-4 text-center">Loading university data...</p>
      )}
    </div>
  );
};

export default UniversityDetail;
