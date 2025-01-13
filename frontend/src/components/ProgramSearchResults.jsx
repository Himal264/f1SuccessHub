import React, { useState, useEffect } from "react";
import { Search, ChevronLeft } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";

const ProgramSearchResults = () => {
  const { level, subject } = useParams();
  const navigate = useNavigate();
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await fetch(`http://localhost:9000/api/university/search?level=${level}&subject=${subject}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setUniversities(data.universities || []);
      } finally {
        setLoading(false);
      }
    };
    fetchUniversities();
  }, [level, subject]);

  const formatSubject = (subject) => {
    return subject.replace(/([A-Z])/g, ' $1').trim();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ChevronLeft className="h-5 w-5" />
          <span>Back to Search</span>
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-serif text-gray-900 mb-2">
            {level} Programs in {formatSubject(subject)}
          </h1>
          <p className="text-gray-600">
            Showing {universities.length} universities offering {level.toLowerCase()} programs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {universities.map((uni) => (
            <Link 
              key={uni._id} 
              to={`/university/${uni._id}`}
              className="block hover:transform hover:scale-105 transition-transform duration-200"
            >
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="h-20 w-20 mx-auto mb-4 flex items-center justify-center">
                    <img
                      src={uni.logoUrl || "/api/placeholder/80/80"}
                      alt={uni.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 text-center mb-2">
                    {uni.name}
                  </h3>
                  <div className="text-sm text-gray-600 space-y-2">
                    <p>Location: {uni.city}, {uni.state}</p>
                    <p>Ranking: #{uni.usNewsRanking} U.S. News Ranking</p>
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-900 mb-1">Available Programs:</h4>
                      <ul className="list-disc pl-4 text-gray-600">
                        {level === 'Undergraduate' 
                          ? uni.undergraduatePrograms.programs[subject]?.slice(0, 3).map((program, idx) => (
                              <li key={idx}>{program}</li>
                            ))
                          : uni.graduatePrograms.programs[subject]?.slice(0, 3).map((program, idx) => (
                              <li key={idx}>{program}</li>
                            ))
                        }
                      </ul>
                      {((level === 'Undergraduate' ? uni.undergraduatePrograms.programs[subject]?.length : uni.graduatePrograms.programs[subject]?.length) > 3) && (
                        <p className="text-sm text-gray-500 mt-1">+ more programs</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgramSearchResults;