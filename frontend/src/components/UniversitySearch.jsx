import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom"; // Import Link for routing
import { backendUrl } from "../App";

const UniversitySearch = () => {
  const navigate = useNavigate();
  const [universities, setUniversities] = useState([]);
  const [programLevel, setProgramLevel] = useState("Undergraduate");
  const [subject, setSubject] = useState("Engineering");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const subjects = [
    "Engineering",
    "Humanities",
    "MedicalandHealthSciences",
    "NaturalSciences",
    "Business",
    "ComputerScience",
    "SocialScience",
    "Education",
  ];

  const handleSearch = () => {
    // Navigate to the subject program page instead of search results
    navigate(`/subject/${programLevel}/${subject}`);
  };

  const fetchUniversities = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${backendUrl}/api/university/list`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Extract universities array from the response
      const universityList = data.universities || [];
      setUniversities(universityList);
    } catch (error) {
      console.error("Error fetching universities:", error);
      setError(error.message);
      setUniversities([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUniversities();
  }, []);

  if (loading) return <div>Loading universities...</div>;
  if (error) return <div>Error: {error}</div>;

  // Only calculate rows if universities is not empty
  const firstRow = universities.length > 0 ? universities.slice(0, Math.ceil(universities.length / 2)) : [];
  const secondRow = universities.length > 0 ? universities.slice(Math.ceil(universities.length / 2)) : [];

  return (
    <div className="w-full bg-gray-50">
      <div className="max-w-4xl mx-auto pt-8 sm:pt-12 pb-6 sm:pb-8 px-4 text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#414141] mb-3 sm:mb-4">
          Find your perfect program
        </h1>
        <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
          We offer thousands of university programs, serving every type of
          learner, across the US and beyond.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 max-w-2xl mx-auto">
          <select
            value={programLevel}
            onChange={(e) => setProgramLevel(e.target.value)}
            className="w-full sm:w-48 p-2 border border-gray-300 rounded-md bg-white text-sm sm:text-base"
          >
            <option value="Undergraduate">Undergraduate</option>
            <option value="Graduate">Graduate</option>
          </select>

          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full sm:flex-1 p-2 border border-gray-300 rounded-md bg-white text-sm sm:text-base"
          >
            {subjects.map((sub) => (
              <option key={sub} value={sub}>
                {sub.replace(/([A-Z])/g, " $1").trim()}
              </option>
            ))}
          </select>

          <button
            onClick={handleSearch}
            className="w-full sm:w-auto bg-[#002349] hover:bg-[#002349] text-white px-4 sm:px-6 py-2 rounded-md flex items-center justify-center gap-2 text-sm sm:text-base transition-colors duration-300"
          >
            <Search className="h-4 w-4 sm:h-5 sm:w-5" />
            Search
          </button>
        </div>
      </div>

      <style>
        {`
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .scroll-container {
            overflow: hidden;
            margin: 20px 0;
          }
          .scroll-content {
            display: flex;
            width: max-content;
            animation: scroll 10s linear infinite;
          }
          .university-card {
            width: 280px;
            flex-shrink: 0;
          }
        `}
      </style>

      {/* Only render university rows if there are universities */}
      {universities.length > 0 ? (
        <>
          {/* First Row */}
          <div className="scroll-container">
            <div className="scroll-content">
              {[...firstRow, ...firstRow].map((uni, index) => (
                <div key={`${uni._id}-${index}`} className="university-card p-4">
                  <Link to={`/university/${uni._id}`}>
                    {" "}
                    {/* Wrap with Link */}
                    <div className="bg-white rounded-lg p-6 flex flex-col items-center">
                      <div className="h-20 w-20 mb-4 flex items-center justify-center">
                        <img
                          src={uni.logoUrl || "/api/placeholder/80/80"}
                          alt={uni.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <h3 className="text-center font-medium text-gray-800">
                        {uni.name}
                      </h3>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Second Row */}
          <div className="scroll-container">
            <div className="scroll-content">
              {[...secondRow, ...secondRow].map((uni, index) => (
                <div key={`${uni._id}-${index}`} className="university-card p-4">
                  <Link to={`/university/${uni._id}`}>
                    {" "}
                    {/* Wrap with Link */}
                    <div className="bg-white rounded-lg p-6 flex flex-col items-center">
                      <div className="h-20 w-20 mb-4 flex items-center justify-center">
                        <img
                          src={uni.logoUrl || "/api/placeholder/80/80"}
                          alt={uni.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <h3 className="text-center font-medium text-gray-800">
                        {uni.name}
                      </h3>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-8">No universities found</div>
      )}
    </div>
  );
};

export default UniversitySearch;
