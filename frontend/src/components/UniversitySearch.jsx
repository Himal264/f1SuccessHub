import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom"; // Import Link for routing

const UniversitySearch = () => {
  const navigate = useNavigate()
  const [universities, setUniversities] = useState([]);
  const [programLevel, setProgramLevel] = useState("Undergraduate");
  const [subject, setSubject] = useState("Engineering");
  const [loading, setLoading] = useState(true);

  const subjects = [
    "Engineering",
    "Humanities",
    "MedicalandHealthSciences",
    "NaturalSciences",
    "Business",
    "ComputerScience",
    "SocialScience",
    "Education"
  ];

  const handleSearch = () => {
    // Navigate to the subject program page instead of search results
    navigate(`/subject/${programLevel}/${subject}`);
  };

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await fetch("http://localhost:9000/api/university/list");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setUniversities(data.universities || []);
      } finally {
        setLoading(false);
      }
    };
    fetchUniversities();
  }, []);

  const firstRow = universities.slice(0, Math.ceil(universities.length / 2));
  const secondRow = universities.slice(Math.ceil(universities.length / 2));

  return (
    <div className="w-full bg-gray-50">
      <div className="max-w-4xl mx-auto pt-12 pb-8 px-4 text-center">
        <h1 className="text-4xl font-serif text-gray-900 mb-4">Find your perfect program</h1>
        <p className="text-gray-600 mb-8">
          We offer thousands of university programs, serving every type of learner,<br />
          across the US and beyond.
        </p>
        
        <div className="flex gap-2 max-w-2xl mx-auto">
          <select
            value={programLevel}
            onChange={(e) => setProgramLevel(e.target.value)}
            className="w-48 p-2 border border-gray-300 rounded-md bg-white"
          >
            <option value="Undergraduate">Undergraduate</option>
            <option value="Graduate">Graduate</option>
          </select>
          
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded-md bg-white"
          >
            {subjects.map((sub) => (
              <option key={sub} value={sub}>
                {sub.replace(/([A-Z])/g, ' $1').trim()}
              </option>
            ))}
          </select>

          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <Search className="h-5 w-5" />
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
            animation: scroll 40s linear infinite;
          }
          .university-card {
            width: 280px;
            flex-shrink: 0;
          }
        `}
      </style>

      {/* First Row */}
      <div className="scroll-container">
        <div className="scroll-content">
          {[...firstRow, ...firstRow].map((uni, index) => (
            <div key={`${uni._id}-${index}`} className="university-card p-4">
              <Link to={`/university/${uni._id}`}> {/* Wrap with Link */}
                <div className="bg-white rounded-lg p-6 flex flex-col items-center">
                  <div className="h-20 w-20 mb-4 flex items-center justify-center">
                    <img
                      src={uni.logoUrl || "/api/placeholder/80/80"}
                      alt={uni.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <h3 className="text-center font-medium text-gray-800">{uni.name}</h3>
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
              <Link to={`/university/${uni._id}`}> {/* Wrap with Link */}
                <div className="bg-white rounded-lg p-6 flex flex-col items-center">
                  <div className="h-20 w-20 mb-4 flex items-center justify-center">
                    <img
                      src={uni.logoUrl || "/api/placeholder/80/80"}
                      alt={uni.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <h3 className="text-center font-medium text-gray-800">{uni.name}</h3>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UniversitySearch;
